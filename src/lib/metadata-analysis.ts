import type {
  ApiResponse,
  DiagnosticReport,
  DiagnosticStatus,
  MetadataCheck,
  PlatformReadiness,
} from '@/types';

type CheckInput = Omit<MetadataCheck, 'weight'> & { weight?: number };

function makeCheck(input: CheckInput): MetadataCheck {
  return { ...input, weight: input.weight ?? 1 };
}

function readiness(
  platform: PlatformReadiness['platform'],
  requirements: Array<[string, boolean]>,
): PlatformReadiness {
  const missing = requirements.filter(([, present]) => !present).map(([name]) => name);

  return {
    platform,
    status: missing.length === 0 ? 'ready' : 'needs-work',
    missing,
  };
}

export function analyzeMetadata(metadata: ApiResponse): DiagnosticReport {
  const tags = metadata.tags ?? {};
  const ogTitle = tags['og:title'];
  const ogDescription = tags['og:description'];
  const ogImage = tags['og:image'];
  const ogUrl = tags['og:url'];
  const twitterCard = tags['twitter:card'];
  const twitterTitle = tags['twitter:title'];
  const twitterDescription = tags['twitter:description'];
  const twitterImage = tags['twitter:image'];
  const robots = (metadata.robots ?? '').toLowerCase();
  const imageInfo = metadata.imageInfo;
  const checks: MetadataCheck[] = [];

  checks.push(makeCheck({
    id: 'http-status',
    label: 'Page fetch',
    category: 'fetch',
    status: metadata.status && metadata.status >= 200 && metadata.status < 300 ? 'pass' : 'fail',
    value: metadata.status ? `${metadata.status} ${metadata.statusText ?? ''}`.trim() : 'No response status',
    recommendation: 'The page must return a successful 2xx response to social crawlers.',
    weight: 2,
  }));

  checks.push(makeCheck({
    id: 'redirects',
    label: 'Final URL',
    category: 'fetch',
    status: metadata.redirected ? 'warning' : 'pass',
    value: metadata.finalUrl ?? metadata.url,
    recommendation: 'Use the final URL directly where possible to avoid crawler delays and stale caches.',
  }));

  checks.push(makeCheck({
    id: 'og-title',
    label: 'Open Graph title',
    category: 'open-graph',
    status: ogTitle ? 'pass' : metadata.title ? 'warning' : 'fail',
    value: ogTitle ?? metadata.title,
    recommendation: 'Add one non-empty og:title tag that clearly names the page.',
    weight: 2,
  }));

  checks.push(makeCheck({
    id: 'og-description',
    label: 'Open Graph description',
    category: 'open-graph',
    status: ogDescription ? 'pass' : metadata.description ? 'warning' : 'fail',
    value: ogDescription ?? metadata.description,
    recommendation: 'Add an og:description that explains the page value without truncation-prone filler.',
  }));

  checks.push(makeCheck({
    id: 'og-image',
    label: 'Open Graph image',
    category: 'open-graph',
    status: ogImage ? 'pass' : metadata.image ? 'warning' : 'fail',
    value: ogImage ?? metadata.image,
    recommendation: 'Add an absolute HTTPS og:image URL for a shareable preview image.',
    weight: 2,
  }));

  checks.push(makeCheck({
    id: 'og-url',
    label: 'Open Graph URL',
    category: 'open-graph',
    status: ogUrl ? 'pass' : 'warning',
    value: ogUrl,
    recommendation: 'Declare og:url so platforms associate shares with the intended canonical page.',
  }));

  checks.push(makeCheck({
    id: 'twitter-card',
    label: 'Twitter card type',
    category: 'twitter',
    status: twitterCard ? 'pass' : 'fail',
    value: twitterCard,
    recommendation: 'Add twitter:card, usually summary_large_image for image-led content.',
    weight: 2,
  }));

  checks.push(makeCheck({
    id: 'twitter-title',
    label: 'Twitter title',
    category: 'twitter',
    status: twitterTitle ? 'pass' : ogTitle ? 'warning' : 'fail',
    value: twitterTitle ?? ogTitle,
    recommendation: 'Add twitter:title or verify that the Open Graph fallback is intentional.',
  }));

  checks.push(makeCheck({
    id: 'twitter-description',
    label: 'Twitter description',
    category: 'twitter',
    status: twitterDescription ? 'pass' : ogDescription ? 'warning' : 'fail',
    value: twitterDescription ?? ogDescription,
    recommendation: 'Add twitter:description or verify that the Open Graph fallback is intentional.',
  }));

  checks.push(makeCheck({
    id: 'twitter-image',
    label: 'Twitter image',
    category: 'twitter',
    status: twitterImage ? 'pass' : ogImage ? 'warning' : 'fail',
    value: twitterImage ?? ogImage,
    recommendation: 'Add twitter:image or verify that the Open Graph image fallback is intentional.',
  }));

  checks.push(makeCheck({
    id: 'canonical',
    label: 'Canonical URL',
    category: 'indexing',
    status: metadata.canonical ? 'pass' : 'warning',
    value: metadata.canonical,
    recommendation: 'Add a self-referencing canonical URL to clarify which page should be indexed.',
    weight: 2,
  }));

  checks.push(makeCheck({
    id: 'robots',
    label: 'Robots directives',
    category: 'indexing',
    status: robots.includes('noindex') ? 'fail' : 'pass',
    value: metadata.robots ?? 'No noindex directive detected',
    recommendation: 'Remove noindex if this page is intended to appear in search results.',
    weight: 2,
  }));

  if (metadata.image) {
    const imageStatus: DiagnosticStatus = imageInfo?.status && imageInfo.status >= 200 && imageInfo.status < 300
      ? 'pass'
      : imageInfo?.error || imageInfo?.status
        ? 'fail'
        : 'warning';
    const dimensions = imageInfo?.width && imageInfo.height
      ? `${imageInfo.width}×${imageInfo.height}`
      : 'Dimensions unavailable';

    checks.push(makeCheck({
      id: 'image-fetch',
      label: 'Share image fetch',
      category: 'image',
      status: imageStatus,
      value: [imageInfo?.status, imageInfo?.contentType, dimensions].filter(Boolean).join(' · '),
      recommendation: 'Ensure the image URL is public, returns an image response, and does not require cookies.',
      weight: 2,
    }));

    checks.push(makeCheck({
      id: 'image-https',
      label: 'Secure image URL',
      category: 'image',
      status: metadata.image.startsWith('https://') ? 'pass' : 'warning',
      value: metadata.image,
      recommendation: 'Serve share images over HTTPS with an absolute URL.',
    }));

    if (imageInfo?.contentType) {
      checks.push(makeCheck({
        id: 'image-content-type',
        label: 'Share image content type',
        category: 'image',
        status: imageInfo.contentType.startsWith('image/') ? 'pass' : 'fail',
        value: imageInfo.contentType,
        recommendation: 'Return an image/* Content-Type header instead of HTML, JSON, or a generic download response.',
        weight: 2,
      }));
    }

    if (imageInfo?.width && imageInfo.height) {
      const ratio = imageInfo.width / imageInfo.height;
      checks.push(makeCheck({
        id: 'image-dimensions',
        label: 'Share image dimensions',
        category: 'image',
        status: imageInfo.width >= 1200 && imageInfo.height >= 630
          ? 'pass'
          : imageInfo.width >= 600 && imageInfo.height >= 315
            ? 'warning'
            : 'fail',
        value: `${imageInfo.width}×${imageInfo.height}`,
        recommendation: 'Use a 1200×630 source image for a reliable large cross-platform card.',
        weight: 2,
      }));
      checks.push(makeCheck({
        id: 'image-aspect-ratio',
        label: 'Share image aspect ratio',
        category: 'image',
        status: ratio >= 1.8 && ratio <= 2 ? 'pass' : 'warning',
        value: `${ratio.toFixed(2)}:1`,
        recommendation: 'Use an image close to 1.91:1 and keep important content inside a crop-safe central area.',
      }));
    }

    if (imageInfo?.contentLength) {
      checks.push(makeCheck({
        id: 'image-file-size',
        label: 'Share image file size',
        category: 'image',
        status: imageInfo.contentLength <= 1_500_000 ? 'pass' : 'warning',
        value: `${Math.round(imageInfo.contentLength / 1024)} KB`,
        recommendation: 'Compress the share image to improve crawler fetch reliability while preserving visual quality.',
      }));
    }
  }

  const weightedTotal = checks.reduce((sum, check) => sum + check.weight, 0);
  const weightedScore = checks.reduce((sum, check) => {
    if (check.status === 'pass') return sum + check.weight;
    if (check.status === 'warning') return sum + check.weight * 0.5;
    return sum;
  }, 0);
  const score = weightedTotal > 0 ? Math.round((weightedScore / weightedTotal) * 100) : 0;
  const counts = checks.reduce<Record<DiagnosticStatus, number>>(
    (result, check) => ({ ...result, [check.status]: result[check.status] + 1 }),
    { pass: 0, warning: 0, fail: 0 },
  );
  const ogTitleReady = Boolean(ogTitle);
  const ogDescriptionReady = Boolean(ogDescription);
  const ogImageReady = Boolean(ogImage);
  const ogUrlReady = Boolean(ogUrl);

  return {
    score,
    counts,
    checks,
    platforms: [
      readiness('Facebook', [
        ['og:title', ogTitleReady],
        ['og:description', ogDescriptionReady],
        ['og:image', ogImageReady],
        ['og:url', ogUrlReady],
      ]),
      readiness('LinkedIn', [
        ['og:title', ogTitleReady],
        ['og:description', ogDescriptionReady],
        ['og:image', ogImageReady],
        ['og:url', ogUrlReady],
      ]),
      readiness('X / Twitter', [
        ['twitter:card', Boolean(twitterCard)],
        ['twitter:title or og:title', Boolean(twitterTitle || ogTitle)],
        ['twitter:description or og:description', Boolean(twitterDescription || ogDescription)],
        ['twitter:image or og:image', Boolean(twitterImage || ogImage)],
      ]),
    ],
  };
}
