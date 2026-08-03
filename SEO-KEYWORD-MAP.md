# LinkGlimpse Keyword-to-URL Map

This map assigns each search intent to one primary indexable URL. Supporting pages should link to the primary URL but should not copy its title, H1, or core intent.

## Primary tool pages

| URL | Primary intent | Target keyword cluster | Supporting URLs |
| --- | --- | --- | --- |
| `/` | Preview one link across social platforms | link preview checker, social media preview, social share preview, link preview tool | All platform tools |
| `/open-graph-checker` | Audit and validate Open Graph implementation | open graph checker, OG checker, open graph test, OpenGraph tester, open graph validator, OG image checker, open graph preview, open graph debugger | Six troubleshooting articles and example reports |
| `/twitter-card-validator` | Validate an X/Twitter Card | Twitter Card validator, Twitter Card test, X Card validator, Twitter Card preview | `/blog/twitter-card-preview-not-showing`, `/blog/twitter-cards-optimization` |
| `/facebook-open-graph-debugger` | Debug a Facebook share card | Facebook Open Graph debugger, Facebook link debugger, Facebook OG tester | `/blog/facebook-link-preview-wrong` |
| `/linkedin-post-preview` | Inspect a LinkedIn link card | LinkedIn Post Inspector alternative, LinkedIn preview checker, LinkedIn link debugger | `/blog/linkedin-link-preview-not-updating` |
| `/compare` | Compare two metadata implementations | compare Open Graph tags, metadata comparison tool, OG tag diff | `/open-graph-checker` |

## Troubleshooting and reference pages

| URL | Primary intent | Target keyword cluster | Primary CTA |
| --- | --- | --- | --- |
| `/blog/twitter-card-preview-not-showing` | Repair a missing X/Twitter preview | Twitter Card preview not showing, Twitter link preview missing, X card image not showing | `/twitter-card-validator` |
| `/blog/open-graph-image-not-showing` | Repair a missing OG image | Open Graph image not showing, og:image missing, social preview image not working | `/open-graph-checker` |
| `/blog/linkedin-link-preview-not-updating` | Refresh or repair LinkedIn preview | LinkedIn preview not updating, LinkedIn link image not showing, LinkedIn cache | `/linkedin-post-preview` |
| `/blog/facebook-link-preview-wrong` | Repair incorrect Facebook preview | Facebook link preview wrong, Facebook preview image not updating, Facebook link image missing | `/facebook-open-graph-debugger` |
| `/blog/open-graph-image-size` | Select compatible social image dimensions | Open Graph image size, og:image dimensions, social preview aspect ratio | `/open-graph-checker` |
| `/blog/open-graph-tags-guide` | Copy complete implementation templates | Open Graph tag examples, OG tag template, Open Graph HTML, Next.js Open Graph tags | `/open-graph-checker` |
| `/examples/*` | Learn from a concrete diagnostic state | Open Graph report example plus issue-specific long tails | `/open-graph-checker` |

## Cannibalization rules

- The homepage owns broad multi-platform preview intent; it should not be retitled “Open Graph Checker.”
- `/open-graph-checker` owns the broad OG checker/test/validator cluster.
- Platform tools own transactional platform-specific checker terms.
- Articles answer a specific problem or implementation question and link to the matching tool.
- Do not create another general “Open Graph guide” or “Open Graph checker” page without first updating this map.
