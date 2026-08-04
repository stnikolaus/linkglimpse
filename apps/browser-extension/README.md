# LinkGlimpse browser extension

The LinkGlimpse extension adds one explicit action to Chrome, Firefox, and compatible browsers: inspect the current public page with LinkGlimpse.

It requests only `activeTab` and `contextMenus`. The current page URL is sent to `linkglimpse.com` only after the user clicks the toolbar action or context-menu command. The extension does not contain analytics code.

## Build

From the repository root:

```bash
pnpm extension:build
```

Load `dist/extension/chrome` as an unpacked Chrome extension or `dist/extension/firefox` as a temporary Firefox add-on.

Create submission ZIP files:

```bash
pnpm extension:package
```

The resulting files are written to `release/`.

See [STORE_LISTING.md](STORE_LISTING.md) for marketplace copy and the publication checklist.
