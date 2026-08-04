# LinkGlimpse

[![CI](https://github.com/stnikolaus/linkglimpse/actions/workflows/ci.yml/badge.svg)](https://github.com/stnikolaus/linkglimpse/actions/workflows/ci.yml)
[![AGPL-3.0-or-later](https://img.shields.io/badge/license-AGPL--3.0--or--later-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/linkglimpse.svg)](https://www.npmjs.com/package/linkglimpse)

LinkGlimpse is a free, open-source social-preview debugger. Give it a public URL to see representative platform cards, inspect the page's Open Graph and Twitter Card metadata, validate its share image, trace redirects, and copy actionable fixes.

**Live tool:** [linkglimpse.com](https://www.linkglimpse.com) · **Open Graph checker:** [linkglimpse.com/open-graph-checker](https://www.linkglimpse.com/open-graph-checker)

![LinkGlimpse social preview diagnostics](public/images/icon/social-preview-1200x630.jpeg)

## What it includes

- Representative previews for Facebook, X, LinkedIn, Instagram, Threads, Tumblr, Mastodon, Nextdoor, Bluesky, and Google Search.
- Weighted diagnostics for Open Graph tags, Twitter Cards, canonicals, robots directives, redirects, HTTP responses, and share images.
- Image response, content type, dimensions, aspect ratio, and file-size checks.
- Copy-ready remediation, shareable live reports, URL comparison, bulk processing, and a JSON API.
- A zero-dependency [npm CLI](packages/cli) for terminals and CI.
- A minimal-permission [Chrome and Firefox extension](apps/browser-extension).
- Troubleshooting guides and implementation examples.

LinkGlimpse simulates likely previews from public metadata. Social platforms control their own crawlers, caches, crops, and final rendering, so no third-party checker can guarantee a byte-for-byte platform result.

## Quick start

Requirements: Node.js 20+ and pnpm 10.

```bash
git clone https://github.com/stnikolaus/linkglimpse.git
cd social-preview
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Analytics variables are optional; the checker works without them.

## Commands

```bash
pnpm dev                # Next.js development server
pnpm build              # Production build
pnpm lint               # ESLint
pnpm typecheck          # TypeScript
pnpm test               # CLI tests
pnpm cli:pack           # Inspect the npm package tarball
pnpm extension:build    # Build Chrome and Firefox directories
pnpm extension:package  # Create marketplace ZIP files
```

## CLI

Run an audit without installing anything globally:

```bash
npx linkglimpse https://example.com
npx linkglimpse https://example.com --fail-on warning
npx linkglimpse https://example.com --json
```

The default CLI calls the public LinkGlimpse API with the URL you explicitly provide. Pass `--api-base http://localhost:3000` or set `LINKGLIMPSE_API_BASE` to use another deployment. See the [CLI README](packages/cli/README.md) for details.

## Browser extension

The extension automatically audits the active page after the user opens its toolbar popup and keeps the score, previews, diagnostics, extracted tags, and fixes inside the extension. It requests `activeTab` plus access to the LinkGlimpse API; it does not request browser history, cookies, credentials, or access to every website.

```bash
pnpm extension:build
```

Load `dist/extension/chrome` as an unpacked Chrome extension or `dist/extension/firefox` as a temporary Firefox add-on. See the [extension README](apps/browser-extension/README.md) and [store listing](apps/browser-extension/STORE_LISTING.md).

## API

Inspect one URL:

```bash
curl --get 'https://www.linkglimpse.com/api/metadata' \
  --data-urlencode 'url=https://example.com'
```

The response contains extracted metadata, redirect and image information, diagnostic checks, platform readiness, and a score. The public endpoint is currently unauthenticated and may be rate limited; production consumers should self-host or implement retry and backoff behavior.

## Environment variables

Copy `.env.example` to `.env.local`. Do not commit `.env.local` or live credentials.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | No | Sends explicit product events to PostHog |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | PostHog ingestion host |
| `GOOGLE_SITE_VERIFICATION` | No | Google Search Console verification value |

Plausible is loaded through the public site configuration and does not require a local secret. See [ANALYTICS.md](ANALYTICS.md).

## Project structure

```text
src/                         Next.js website, API, diagnostics, and previews
content/blog/                Markdown troubleshooting guides
packages/cli/                Zero-dependency npm CLI
apps/browser-extension/      Chrome and Firefox extension source
scripts/                     Extension build and packaging scripts
.github/                     CI, release workflows, and contribution templates
```

## Security and privacy

Only submit URLs that are safe to send to the selected LinkGlimpse deployment. The hosted service fetches public URLs on demand; see the [privacy policy](https://www.linkglimpse.com/privacy). Security issues should be reported according to [SECURITY.md](SECURITY.md), not through a public issue.

## Contributing

Bug reports, platform-rendering corrections, validation improvements, accessibility fixes, and documentation contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) and the public [roadmap](ROADMAP.md) before starting substantial work.

## License

LinkGlimpse is licensed under the [GNU Affero General Public License v3.0 or later](LICENSE). If you run a modified version as a network service, the AGPL requires you to offer the corresponding source to its users.
