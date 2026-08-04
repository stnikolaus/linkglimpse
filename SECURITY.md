# Security policy

## Supported versions

Security fixes are applied to the current `main` branch and the production deployment. Older commits and third-party forks are not supported.

## Reporting a vulnerability

Please use the repository's **Security → Report a vulnerability** flow to submit a private GitHub security advisory. Do not disclose the issue in a public issue, discussion, pull request, or social post before a fix is available.

Include:

- The affected route, package, or extension version.
- Clear reproduction steps and the expected security impact.
- Whether the report involves server-side URL fetching, redirect handling, browser permissions, injected metadata, or a dependency.
- A minimal proof of concept that does not access third-party data or infrastructure.

Please do not test against private networks, cloud metadata endpoints, accounts, or URLs you do not control. We will acknowledge a complete report when repository access and notification settings allow, investigate it, and coordinate disclosure after a fix.

## Scope notes

LinkGlimpse processes untrusted public URLs and HTML. Changes must preserve SSRF defenses, output escaping, fetch limits, timeouts, redirect limits, and minimal extension permissions.
