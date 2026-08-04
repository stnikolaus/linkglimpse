# Browser extension privacy

The LinkGlimpse browser extension does not continuously inspect browsing activity and does not contain analytics or advertising code.

When a user explicitly opens the LinkGlimpse toolbar popup, the extension reads the selected public HTTP or HTTPS URL and sends it to the LinkGlimpse metadata API. LinkGlimpse fetches that URL and returns the requested diagnostic report to the popup. The extension renders the score, preview, platform readiness, checks, and fixes locally; it does not open an external report page. The hosted API's processing practices are described in the [LinkGlimpse privacy policy](https://www.linkglimpse.com/privacy).

If the inspected page declares a share image, the popup loads that public image URL so the user can see its social preview. This happens only as part of the user-requested audit.

The extension uses:

- `activeTab` to read the current page URL after the user opens the extension.
- Host access to `https://www.linkglimpse.com/*` so the popup can request the diagnostic report from the LinkGlimpse API.
- Firefox's required `browsingActivity` data declaration because the selected page URL is transmitted to the LinkGlimpse API when the user opens the popup. The extension does not read or transmit browser history.

The extension does not request access to browser history, cookies, credentials, or all websites.
