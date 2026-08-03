# Contributing to LinkGlimpse

Thanks for helping make social-preview diagnostics more accurate and useful.

## Before starting

- Search existing issues before opening a new one.
- Open an issue before a large product, architecture, or platform-rendering change.
- Never include credentials, private URLs, customer data, or copied proprietary platform code.
- Treat every inspected page and metadata value as untrusted input.

## Local development

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

Analytics variables are optional. Do not add a live token to tests, fixtures, documentation, screenshots, commits, or issue reports.

Before submitting a pull request:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm extension:package
pnpm build
```

## Pull requests

- Keep changes focused and explain the user-visible behavior.
- Add tests for reusable parsing, CLI, or diagnostic logic when practical.
- Include before/after screenshots for meaningful interface changes.
- Document new environment variables in `.env.example` and `README.md`.
- Update browser-extension privacy and store copy when permissions or data flow changes.
- Confirm that you have the right to submit the code and assets under AGPL-3.0-or-later.

## Platform-preview corrections

LinkGlimpse renders representative previews; it does not claim pixel-perfect parity with private platform clients. When changing a preview, link to public platform documentation or provide a current screenshot with personal information removed.

## Reporting security issues

Do not open a public issue for a vulnerability. Follow [SECURITY.md](SECURITY.md).
