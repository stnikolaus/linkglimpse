# State of Open Graph study design

Status: pre-collection methodology, version 1.0.0.

No study observations have been collected or published from this design.
The methodology, sample manifest schema, and observation schema must pass review before collection begins.

## Research question

The study asks how often a controlled convenience sample of popular public home pages exposes server-rendered Open Graph, Twitter Card, canonical, robots, and share-image signals that a non-JavaScript crawler can inspect.
It also asks which detectable metadata defects are most common inside that sample.

The study does not estimate the state of the entire web.
It does not measure social-platform cache state, private rendering behavior, search rankings, traffic, or whether a page earns engagement.

## Related work and distinct contribution

Prior web-corpus research measured Open Graph adoption at very large scale, but differences in corpora and extractors make results difficult to compare directly.
The 2012 paper [Metadata Statistics for a Large Web Corpus](https://ceur-ws.org/Vol-937/ldow2012-inv-paper-1.pdf) is useful historical context for that limitation.

A September 2026 [SerpPrism study of 62 usable home pages](https://www.serpprism.com/guides/open-graph-in-the-wild) provides a current hand-selected comparison and reports field presence, empty image tags, declared image dimensions, and title differences.
The LinkGlimpse study is designed as a complementary reproducible measurement rather than a larger-looking version of the same claim.
It uses a permanent deterministic Tranco frame, keeps blocked and failed domains in the coverage denominator, records redirect and image-fetch outcomes, publishes schema-valid privacy-minimized observations, and requires manual double-checking before publication.

## Unit of observation

One observation represents one requested HTTPS home page from one source-list domain at one recorded time.
Redirects are preserved in the observation rather than treated as separate sample units.
A domain remains in the denominator even when collection is excluded or fails, because replacing it would create survivorship bias.

## Sample frame

Collection will use one immutable standard [Tranco](https://tranco-list.eu/) list snapshot without subdomains.
The run record must preserve the list identifier, download URL, retrieval timestamp, and SHA-256 hash before any page request is made.
The snapshot is a convenience frame of popular domains and is not a probability sample of all websites.
Tranco [combines several source rankings](https://tranco-list.eu/methodology) across a rolling window, so provider coverage and ranking methodology can bias which sites enter the frame.

The target sample contains 200 distinct source-list domains from the first 10,000 ranks.
The sample is stratified to retain useful coverage across popularity levels:

- Twenty domains come from ranks 1 through 100.
- Forty domains come from ranks 101 through 1,000.
- One hundred forty domains come from ranks 1,001 through 10,000.

Within each stratum, ranks are selected by deterministic systematic spacing.
For a stratum with inclusive lower rank `L`, inclusive upper rank `U`, and target count `N`, sample index `i` from zero through `N - 1` selects `L + floor((i + 0.5) * (U - L + 1) / N)`.
No hand-picked replacement is allowed when a selected domain is blocked, unavailable, duplicated by redirect, or otherwise unusable.

The generated manifest must validate against [`sample.schema.json`](sample.schema.json).
The complete 200-record manifest must also validate against [`manifest.schema.json`](manifest.schema.json).
The manifest must be sorted by `sample_id` and committed with its source snapshot metadata before collection.
Cross-record validation must confirm the exact 20/40/140 stratum counts, the systematic ranks defined above, unique sample IDs, unique source ranks, unique source domains, and an exact `https://<source_domain>/` requested URL for every row.
The generator must reject a source snapshot that does not contain exactly ranks 1 through 10,000 in order.
It must refuse to replace an existing output file.

Create a manifest only from a previously downloaded permanent Tranco snapshot:

```bash
pnpm research:manifest -- \
  --input /absolute/path/to/tranco_<list-id>-top-10000.csv \
  --list-id <list-id> \
  --download-url https://tranco-list.eu/download/<list-id>/10000 \
  --retrieved-at 2026-09-30T00:00:00Z \
  --output /absolute/path/to/sample-manifest.json
```

The generator reads local bytes, hashes the complete CSV, validates every record and the complete manifest, and performs no network request.

## Requested URL policy

Each source-list domain is converted to `https://<domain>/` without adding a path, locale, query string, or tracking parameter.
The collector may follow at most eight HTTP redirects.
The final public URL and every redirect hop are recorded.
Redirects to private, reserved, local, credential-bearing, or unsupported URLs are rejected.

Only public HTML or XHTML responses are eligible for metadata analysis.
The collector does not sign in, accept consent on behalf of a user, solve challenges, bypass access controls, execute client-side JavaScript, or use a browser session.

## Robots and load controls

The collector identifies itself as `LinkGlimpse-Research/1.0 (+https://www.linkglimpse.com/methodology)`.
Before requesting a sampled page, it fetches that origin's `/robots.txt` with the same user agent.
An explicit disallow for the requested path or any redirect target records `robots_disallowed` and stops collection for that sample.
A missing robots file does not imply permission beyond ordinary public HTTP access, and all other safeguards still apply.

Robots handling follows [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) with a deliberately conservative unreachable policy.
The parser matches the `LinkGlimpse-Research` product token, falls back to `*`, applies the longest matching allow or disallow rule, and prefers allow when equally specific rules conflict.
The robots fetch follows no more than five redirects and parses at most 512 KiB.
An HTTP 4xx response other than 429 is recorded as unavailable and permits the public-page request under RFC 9309.
An HTTP 429, HTTP 5xx response, DNS error, timeout, TLS error, connection error, unsafe redirect, or robots redirect overflow is recorded as unreachable and prevents the page request.
The collector does not reuse a robots result for more than 24 hours.
Before following a page redirect to a new target, it evaluates the target path against the target origin's robots policy.
Before requesting a share image, it applies the same network-safety and robots checks to the image URL and every image redirect target.

The collector sends no more than one in-flight request per origin.
It waits at least two seconds between requests to the same origin and honors a longer valid `Crawl-delay` when one is present.
Global page concurrency is capped at two.
Share-image inspection follows the same per-origin controls and only reads the bounded header prefix needed for response and dimension checks.

HTTP 429 and 503 responses may be retried once.
The collector honors a valid `Retry-After` value or waits 30 seconds when the response omits one.
Other failures are recorded without repeated requests.

Collection stops immediately if the operator sees repeated rate limiting, access challenges, unexpected authenticated content, or evidence of load impact.

## Fetch boundaries

The maximum HTML response body is 2,000,000 bytes.
The maximum share-image header read is 65,536 bytes.
The request timeout is 12 seconds per request.
The collector accepts only HTTP and HTTPS URLs and rechecks DNS safety before every redirect.

The initial HTML response is the metadata source.
Metadata injected only after JavaScript execution is intentionally out of scope because many crawlers do not execute page scripts.

## Recorded fields

Every sample produces one record that validates against [`observation.schema.json`](observation.schema.json).
The record includes sample provenance, UTC observation time, requested and final URLs, redirects, response status, content type, byte limits, robots outcome, and collection disposition.

For page text fields, the dataset stores presence, normalized character length, and a SHA-256 hash rather than the full title or description.
For canonical and image URLs, the dataset stores validity, scheme, host relationship, and fetch characteristics without publishing query strings.
The dataset records Open Graph and Twitter field presence, card type, image response properties, diagnostic outcomes, and a hash of the inspected initial HTML prefix.

The public aggregate should not expose full page HTML, full metadata descriptions, request headers, IP addresses, cookies, or any authenticated content.

## Detection rules

Tag names and property names are matched case-insensitively in the initial HTML.
When duplicate metadata properties exist, the first non-empty value is the primary value and `duplicate_count` records the total non-empty occurrences.
Whitespace is trimmed before presence and length calculations, but text is not rewritten or translated.

A canonical is `self` when its normalized origin and path equal the final page origin and path after removing the fragment and default port.
A canonical is `same_origin_other_path` when only the path differs on the same origin.
A canonical is `cross_origin` when its normalized origin differs from the final page origin.
An unparsable canonical is `invalid`, and an absent canonical is `missing`.

An Open Graph image is present only when `og:image` or `og:image:url` contains a parseable HTTP or HTTPS URL after resolution against the final page URL.
Image dimensions are measured only when they can be read from the bounded public image response.
The approximately 1.91:1 classification uses an aspect-ratio tolerance of 0.05 and is reported as a compatibility heuristic, not a platform requirement.

A Twitter Card is present when a non-empty `twitter:card` value appears in the initial HTML.
Fallback from Open Graph fields is reported separately and does not convert a missing Twitter property into an explicitly present one.

Robots directives combine the first non-empty `robots` and `googlebot` meta values for reporting.
The study records `noindex` when that token appears case-insensitively after comma and whitespace tokenization.

Framework or CMS detection is excluded from version 1 unless a separate rule set demonstrates repeatable precision on labeled fixtures.

## Exclusions and failures

Each manifest row must end with exactly one disposition.

- `collected` means the eligible initial HTML was inspected and the metadata fields were recorded.
- `excluded` means policy or scope prevented inspection.
- `failed` means an eligible request could not be completed within the bounded retry policy.

Exclusion reasons are limited to the schema enum and include robots denial, authentication, access challenge, non-HTML content, unsafe redirects, duplicate final destinations, and operator safety stops.
Failure reasons include DNS, timeout, TLS, connection, HTTP, response-size, redirect-limit, and parser failures.
The report must publish disposition counts and reason counts so readers can see coverage loss.

## Quality assurance

The collection code commit, Node.js version, LinkGlimpse core version, schema versions, user agent, timeout, byte limits, concurrency, and delay settings are frozen in the run manifest.
All observation records must validate before aggregation.
Sample IDs, source domains, and collected final URLs must be checked for duplicates.

At least 20 collected records, or 10 percent of collected records when larger, must receive a manual double-check against saved response summaries.
The manual review checks tag presence, duplicate counts, canonical classification, image classification, and disposition.
Any systematic disagreement blocks publication until the detection rule and affected records are corrected.

The final observation file is sorted by `sample_id` and published with a SHA-256 hash.
Aggregation code must read only schema-valid records and must be pinned to the same repository commit as the published methodology.

## Analysis and reporting

Every percentage must show its numerator and denominator.
Metadata prevalence uses collected HTML pages as its denominator.
Collection coverage uses all 200 manifest rows as its denominator.
Exclusions and failures are never silently removed from the coverage calculation.

Subgroup results are descriptive and are withheld when a subgroup contains fewer than 20 collected pages.
The report may include Wilson 95 percent intervals for proportions, but it must not present them as correcting the convenience-sample bias.
No difference is called causal.

The publication must repeat the sample-frame limitation near the headline findings and in the methodology section.

## Publication gate

Collection may begin only after the methodology and all three schemas are reviewed and the schema tests pass.
Collection also requires the manifest schema, manifest semantic tests, RFC 9309 robots fixtures, redirect-origin fixtures, response-limit fixtures, and public-network safety fixtures to pass.
Publication additionally requires a complete manifest, a complete disposition record for every sample, successful schema validation, duplicate checks, manual QA, reproducible aggregation, and a written limitations section.
If any gate fails, the dataset remains unpublished and the issue is recorded for the next run.

## Versioning

Methodology and schemas use semantic versions.
A changed sampling frame, denominator, detection rule, or exclusion rule requires a new major methodology version.
A backward-compatible field addition requires a minor version.
Editorial corrections that do not affect interpretation require a patch version.
