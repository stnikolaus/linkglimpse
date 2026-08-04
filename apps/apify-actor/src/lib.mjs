import sharp from 'sharp';
import { PREVIEW_IMAGE_CONTENT_TYPES, PREVIEW_PLATFORMS, buildFixPlan, fetchPublicImage, renderPreviewSvg } from 'linkglimpse/core';

export function normalizeInput(input = {}) {
  const urls = (input.urls ?? []).map((entry) => typeof entry === 'string' ? entry : entry?.url).filter(Boolean);
  if (!urls.length) throw new Error('Provide at least one public URL.');
  if (urls.length > 100) throw new Error('A single run supports up to 100 URLs.');
  const previewPlatform = input.previewPlatform || 'all';
  if (previewPlatform !== 'all' && !PREVIEW_PLATFORMS.includes(previewPlatform)) {
    throw new Error(`Preview platform must be all or one of: ${PREVIEW_PLATFORMS.join(', ')}.`);
  }
  return {
    urls,
    concurrency: Math.max(1, Math.min(Number(input.concurrency) || 4, 8)),
    renderPreviews: input.renderPreviews !== false,
    previewPlatform,
  };
}

export function toDatasetItem(result, preview) {
  if (!result.success) return { url: result.url, success: false, error: result.error };
  const report = result.report;
  return {
    url: report.finalUrl || report.url,
    requestedUrl: report.requestedUrl,
    success: true,
    status: report.status,
    redirected: report.redirected,
    score: report.diagnostics?.score ?? 0,
    passed: report.diagnostics?.counts.pass ?? 0,
    warnings: report.diagnostics?.counts.warning ?? 0,
    failed: report.diagnostics?.counts.fail ?? 0,
    title: report.title,
    description: report.description,
    canonical: report.canonical,
    robots: report.robots,
    shareImage: report.image,
    imageInfo: report.imageInfo,
    platformReadiness: report.diagnostics?.platforms ?? [],
    checks: report.diagnostics?.checks ?? [],
    fixes: buildFixPlan(report),
    preview,
  };
}

export async function renderReportPreview(report, platform) {
  let imageDataUrl;
  if (report.image) {
    try {
      const asset = await fetchPublicImage(report.image, { userAgent: 'LinkGlimpse-Apify/0.1' });
      const contentType = asset.contentType.split(';', 1)[0].trim().toLowerCase();
      if (PREVIEW_IMAGE_CONTENT_TYPES.includes(contentType)) {
        imageDataUrl = `data:${contentType};base64,${Buffer.from(asset.bytes).toString('base64')}`;
      }
    } catch {
      // Keep rendering with the missing-image state so the visual itself exposes the issue.
    }
  }
  const rendered = renderPreviewSvg(report, { platform, imageDataUrl });
  const png = await sharp(Buffer.from(rendered.svg)).png({ compressionLevel: 8 }).toBuffer();
  return { ...rendered, png };
}
