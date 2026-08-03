# Browser extension privacy

The LinkGlimpse browser extension does not continuously inspect browsing activity and does not contain analytics or advertising code.

When a user explicitly chooses **Inspect this page** or the LinkGlimpse context-menu command, the extension opens `linkglimpse.com` with the selected public HTTP or HTTPS URL. LinkGlimpse fetches that URL to create the requested diagnostic report. The hosted website's processing and analytics practices are described in the [LinkGlimpse privacy policy](https://www.linkglimpse.com/privacy).

The extension uses:

- `activeTab` to read the current page URL after the user opens the extension.
- `contextMenus` to provide the explicit **Inspect this page with LinkGlimpse** command.

The extension does not request access to browser history, cookies, credentials, or all websites.
