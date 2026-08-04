# LinkGlimpse browser extension

The LinkGlimpse extension automatically audits the current public page when its toolbar popup opens. The score, social and Google search previews, platform readiness, metadata checks, extracted tags, and copy-ready fixes all stay inside the extension.

It requests `activeTab` to read the selected page URL after the user opens the popup and host access only to the LinkGlimpse metadata API. The current page URL is sent to `linkglimpse.com` only after that explicit toolbar action. The extension does not contain analytics code, request browser history, or run continuously in the background.

The Firefox package declares the selected URL as required `browsingActivity` data because Mozilla classifies transmitting a specific URL under that category. It does not read the user's browser history.
The package targets Firefox 140 or later on desktop and Firefox 142 or later on Android, where Mozilla's built-in data-consent prompt is available.

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
