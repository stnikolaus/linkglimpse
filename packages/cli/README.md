# LinkGlimpse CLI

Audit Open Graph, Twitter Card, share-image, redirect, canonical, and indexing metadata from a terminal or CI job.

```bash
npx linkglimpse https://example.com
```

Use findings as a CI gate:

```bash
npx linkglimpse https://example.com --fail-on warning
```

Use JSON when another program needs the complete diagnostic response:

```bash
npx linkglimpse https://example.com --json > linkglimpse-report.json
```

By default the CLI sends the URL you explicitly provide to the public LinkGlimpse API. It does not include telemetry of its own. To use a local or self-hosted deployment:

```bash
npx linkglimpse https://example.com --api-base http://localhost:3000
```

See the [CLI documentation](https://www.linkglimpse.com/cli), [web checker](https://www.linkglimpse.com/open-graph-checker), or [source repository](https://github.com/stnikolaus/linkglimpse).

Licensed under AGPL-3.0-or-later.
