# LinkGlimpse Firefox extension source submission

This archive contains the human-readable source code and build scripts for LinkGlimpse Firefox extension version 0.1.0.

## Build environment

- Operating system: any platform supported by Node.js
- Node.js: 20 or later (Mozilla's default Node.js 24 environment is supported)
- Additional npm packages: none
- Optional packaging utility: `zip`

The extension contains no minified, obfuscated, transpiled, bundled, or remotely executed code. The build script copies the readable HTML, CSS, JavaScript, and icons without transforming them. It generates the target-specific `manifest.json` from `apps/browser-extension/src/manifest.base.json`.

## Build the reviewer-readable Firefox directory

From the root of the extracted source archive, run:

```sh
node scripts/build-extension.mjs
```

The Firefox extension is generated at:

```text
dist/extension/firefox
```

Compare the contents of that directory with the submitted Firefox extension ZIP. The files should match exactly.

## Build the release ZIP

If the `zip` command is available, run:

```sh
node scripts/package-extension.mjs
```

The submitted Firefox package is generated at:

```text
release/linkglimpse-firefox-0.1.0.zip
```
