# Architecture

Sugam Dahal's portfolio is a single static page hosted on GitHub Pages. HTML contains the complete portfolio, CSS handles presentation, and a deferred browser script adds interactive behavior. The site has no application framework, package manager, server runtime, or local compilation step.

## Repository layout

- [`index.html`](../index.html) is the entry point. It holds metadata, the sidebar, the hero, all portfolio sections, the footer, and a short script that restores the theme.
- [`assets/css/style.css`](../assets/css/style.css) contains the palette, typography, page layout, section styles, responsive rules, and print styles.
- [`assets/js/main.js`](../assets/js/main.js) enhances the existing markup with the mobile drawer, section tracking, theme control, pronunciation, and Kathmandu clock.
- [`assets/img/`](../assets/img/) contains the original portrait, the WebP portrait variants, the favicon, and a speaker image. The current pronunciation control and other small interface icons use inline SVG.
- [`assets/audio/name-pronunciation.wav`](../assets/audio/name-pronunciation.wav) is the name pronunciation recording.
- [`assets/attachments/sugam-dahal-cv.pdf`](../assets/attachments/sugam-dahal-cv.pdf) serves both CV links.
- [`docs/`](./) contains maintenance documentation. [`AGENTS.md`](../AGENTS.md) gives coding agents the project defaults.

## Page and content flow

The browser reads `index.html`. The script in the head restores a saved dark preference before CSS loads, then the deferred script runs once the document has been parsed. All project and publication entries are ordinary HTML inside the page. No browser request, database, or build-time data import supplies them.

The sidebar contains numbered links to the nine content sections. The main landmark starts with the masthead, hero, and Selected Highlights. It then contains About Me, Research Experience, Publications, Professional Experience, Selected Projects, Education, Technical Skills, Credentials & Recognition, and Beyond the Lab. A footer follows. Each numbered sidebar link corresponds to a main section ID in the same order. The highlights include two external research links and an in-page link to the LightOnOCR heading at `#ocr-microservice`.

Projects use `article.project-entry` inside `.featured-projects` or `.projects-grid`. Publications use `article.publication-entry` inside `#publications .publication-list`. Shared classes such as `.resource-links` and `.detail-list` give related content consistent styling. The [maintenance guide](MAINTENANCE.md) shows the fields to update.

## Styling and breakpoints

`style.css` defines the light palette and font stacks on `:root`. Dark colors override those variables under `:root[data-theme="dark"]` for screens. Sections share the page's spacing and divider conventions, with dedicated rules for timelines, publications, project groups, and credentials. Fonts come from the system stacks. The portrait uses two local WebP sizes through `srcset`, while the CSS frame and object position control its crop.

The desktop sidebar is fixed. At widths up to 1000 px, the page shows a sticky mobile top bar and JavaScript presents the same sidebar as a drawer. The HTML and CSS provide an in-flow navigation fallback on mobile when JavaScript is disabled. At 700 px and below, the hero and section grids reflow for narrow screens. Additional rules handle compact desktop heights and narrower phones. The 1000 px drawer breakpoint is shared by CSS and `matchMedia` in JavaScript. Scroll padding accounts for the sticky top bar, and the reduced-motion rule disables smooth scrolling and transitions when requested.

## Browser behavior

- **Sidebar drawer.** The menu button opens the drawer and moves focus to its close control. While open, the rest of the page is inert, the drawer exposes modal semantics, and Tab stays within it. Escape or the close controls restore focus to the menu button. Following a sidebar anchor closes the drawer and focuses the destination while the browser handles scrolling.
- **Active section.** The script reads the section IDs from the sidebar links. Scroll and resize events queue one update per animation frame. The last section that has crossed the top-of-viewport threshold gets `.active` and `aria-current="location"`. Near the footer, a clicked section may be unable to reach that threshold. The code honors a visible fragment in that case and drops that preference after the visitor scrolls away.
- **Theme.** Light is the default. The button switches `data-theme`, updates the control label and browser theme color, and saves `portfolio-theme` to local storage when available. The early head script is responsible for restoring dark styling before first paint.
- **Pronunciation.** Clicking the speaker resets the audio position and plays the same file. The tooltip supports pointer hover and keyboard focus and can be dismissed with Escape. Playback errors are reported through the status element.
- **Kathmandu clock.** The sidebar clock is initially hidden. `Intl.DateTimeFormat` renders a 12-hour time in `Asia/Kathmandu`, with the NPT label supplied by HTML. One timeout targets the next minute boundary. Visibility and focus changes refresh the clock, and page-hide cancels the pending timeout. The clock is ordinary text for assistive technology.
- **Back to top.** The footer link uses the native `#top` fragment. CSS supplies smooth scrolling when the visitor allows motion.

## Serving and publishing

The root HTML and its relative asset URLs are the deployable site. The repository has no package manifest, build script, or checked-in deployment workflow. GitHub's public deployment history shows its generated Pages build and deployment running on `main` for the `github-pages` environment. The site's publishing files are at the root. The repository owner's **Settings → Pages** view is the authority for the configured source. See the [README](../README.md) for local preview and checks. [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
