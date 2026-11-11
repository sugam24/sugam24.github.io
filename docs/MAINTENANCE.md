# Maintenance guide

Use [`index.html`](../index.html) as the source of truth for portfolio content. Projects and publications are already grouped in single editable blocks. Each entry carries its own text and links, so ordinary content updates require only an HTML edit.

## Where to edit

### Frequently updated

- **Selected Projects** lives at `#projects` in `index.html`. Add or edit an `article.project-entry` in `.featured-projects` or `.projects-grid`. Keep the group headings, technology-stack styling, and existing anchor IDs. After editing, check the desktop groups, narrow mobile wrapping, project links, and the LightOnOCR highlight if its entry was touched.
- **Publications** lives at `#publications .publication-list`. Edit one `article.publication-entry` at a time. Keep author order, citation identifiers, and scholarly status accurate. Verify each updated destination and check long titles on mobile. When an update affects a preprint or dataset linked elsewhere, check Selected Highlights and Research Experience for the same resource before making any further edits.

### Occasionally updated

- **Research Experience** lives at `#research`. Edit the interests paragraph, the existing `.timeline-entry`, a single `.research-contribution`, or `.research-resources` as needed. Preserve verified metrics, dates, qualifications, and limitations. Check the scope of revised claims and open any updated resource links.
- **Professional Experience** lives at `#experience`. Each role is an `article.timeline-entry` with title, dates, affiliation, and bullets. Keep confidential affiliations confidential. Check role chronology, link destinations, and the timeline on desktop and mobile.
- **Technical Skills** lives at `#skills .skills-grid`. Update the relevant `dt` and `dd` pair inside a `.skill-group`. Add only supported skills. Check that the list wraps and the existing grid and background are preserved.
- **Credentials & Recognition** lives at `#certifications`, the stable anchor for the current heading. Edit an `article.credential-entry`. Update the NEC registration placeholder only when the owner provides the actual number. Preserve the order and professional affiliation layout unless the request changes them. Check the anchor, institution links, and wrapping on mobile.

### Generally stable

- **About Me** lives at `#about .about-columns`. For an approved copy update, edit the requested paragraphs and check the desktop columns and mobile reading order.
- **Education** lives at `#education .education-grid`. Edit the appropriate `.education-entry` with verified dates, results, and institutional links. Check the undergraduate emphasis, responsive stacking, and link destination.
- **Beyond the Lab** lives at `#beyond .beyond-copy`. Edit the approved paragraphs in place and verify their exact wording, paragraph order, and mobile wrapping.

### Protected by default

Global design, branding, sidebar, navigation order, hero, typography, palette, section layouts, theme styling, and footer are part of the finalized presentation. Edit them within the scope of an explicit request. CSS lives in [`assets/css/style.css`](../assets/css/style.css) and browser interactions live in [`assets/js/main.js`](../assets/js/main.js). The [design decisions](DESIGN_DECISIONS.md) explain the reasons for these defaults.

## Common updates

### Add a project

1. Locate the matching project group in `index.html`.
2. Copy the closest entry or use a template below. Enter the verified title, classification, description, technologies, and links. Include a status only when it is relevant and supported.
3. Use the featured contribution list to explain implementation, and keep comparisons and performance figures tied to their documented evaluation. Omit a link when there is no supplied destination. Follow the owner's explicit instruction about keeping the ProbeNet link.
4. Serve the page locally, check desktop and mobile layout, and follow each added link. Check the LightOnOCR anchor when editing that article.

### Add a publication

1. Copy the appropriate preprint or dataset entry in `#publications`.
2. Transcribe the title and authors from the source, with the original author order. Use the verified type, year, identifier, and venue. Confirm the status before using terms such as preprint, submitted, accepted, or published.
3. Add the applicable DOI, arXiv, repository, or publisher links. Confirm they resolve to the intended item and check title wrapping and author display in both themes.

### Update the CV

Replace [`assets/attachments/sugam-dahal-cv.pdf`](../assets/attachments/sugam-dahal-cv.pdf) with the approved PDF at the same path. Open the hero and sidebar CV links from the local preview and verify both serve the intended file. The existing URL can remain stable.

### Update the Kathmandu clock

The clock markup is at `#sidebar-clock` in `index.html`. Its style is near `.sidebar-location` in `style.css` and its logic is at the end of `main.js`. Retain `Asia/Kathmandu`, the 12-hour format, and the NPT label. Keep a single timeout aligned to the next minute, and preserve the visibility, focus, and page lifecycle behavior. Use ordinary text that assistive technology can read without announcing each tick. Verify a minute rollover and return from a background tab with the browser set to another time zone.

### Verify and prepare a change

Use the [local preview and checks in the README](../README.md). Review the diff for unrelated edits, test the paths you changed, and confirm that anchor destinations, keyboard focus, and responsive layouts still work. This repository has no local production build command. When the owner publishes, check the Pages deployment result and the live page.

## Entry templates

Replace every `{{placeholder}}` with verified information. Remove optional rows or links when they do not apply. Copy only the entry being added.

### Featured project

```html
<article class="project-entry">
  <h4>{{project_title}}</h4>
  <p class="project-meta">{{classification}} · <strong class="project-status">{{status_if_relevant}}</strong></p>
  <p class="project-description">{{what_the_project_does}}</p>
  <ul class="detail-list">
    <li>{{verified_technical_contribution}}</li>
  </ul>
  <p class="project-stack">{{technologies_used}}</p>
  <p class="resource-links">
    <a href="{{repository_url}}" target="_blank" rel="noopener noreferrer" aria-label="{{project_title}} on GitHub">GitHub</a>
  </p>
</article>
```

### Additional project

```html
<article class="project-entry">
  <h4>{{project_title}}</h4>
  <p class="project-meta">{{classification}}</p>
  <p class="project-description">{{short_description_of_the_work}}</p>
  <p class="project-stack">{{technologies_used}}</p>
  <p class="resource-links">
    <a href="{{repository_url}}" target="_blank" rel="noopener noreferrer" aria-label="{{project_title}} on GitHub">GitHub</a>
  </p>
</article>
```

### Research publication

Keep the authors in the source order, with Sugam's cited name wrapped in `strong` where it occurs.

```html
<article class="publication-entry">
  <p class="publication-type">Preprint · {{year}}</p>
  <h3>{{paper_title}}</h3>
  <p class="publication-authors">{{authors_before}}<strong>{{sugam_as_cited}}</strong>{{authors_after}}</p>
  <p class="publication-venue">arXiv:{{identifier}}</p>
  <p class="submission-status">{{verified_status_if_relevant}}</p>
  <p class="resource-links">
    <a href="{{arxiv_abstract_url}}" rel="noopener noreferrer" target="_blank">arXiv</a>
    <a href="{{pdf_url}}" rel="noopener noreferrer" target="_blank">PDF</a>
  </p>
</article>
```

### Dataset publication

```html
<article class="publication-entry">
  <p class="publication-type">Dataset · {{year}}</p>
  <h3>{{dataset_title_and_version}}</h3>
  <p class="publication-authors">{{authors_before}}<strong>{{sugam_as_cited}}</strong>{{authors_after}}</p>
  <p class="publication-venue">Zenodo</p>
  <p class="resource-links">
    <a href="{{doi_url}}" rel="noopener noreferrer" target="_blank">DOI {{doi}}</a>
    <a href="{{zenodo_record_url}}" rel="noopener noreferrer" target="_blank">Zenodo Record</a>
  </p>
</article>
```

### Research contribution

Place this in the appropriate `.research-contributions` block.

```html
<div class="research-contribution">
  <h4>{{contribution_heading}}</h4>
  <p>{{verified_method_result_and_relevant_limitations}}</p>
</div>
```

### Professional experience

```html
<article class="timeline-entry">
  <h3 class="timeline-title">{{role_title}}</h3>
  <div class="timeline-meta">
    <p class="timeline-date">{{verified_date_range}}</p>
    <p class="entry-affiliation">{{approved_affiliation}}</p>
  </div>
  <ul class="detail-list">
    <li>{{verified_responsibility_or_contribution}}</li>
  </ul>
</article>
```

### Credential

```html
<article class="credential-entry">
  <h3 class="credential-title">{{credential_title}}</h3>
  <p class="credential-meta">{{verified_issuer}} · <time datetime="{{year}}">{{year}}</time></p>
</article>
```

## If the portfolio grows

Consider a shared data source or build-time templates only if maintaining repeated content across several pages becomes costly. That would change how the site is rendered and published, so review it separately. For the current single page, the two contiguous HTML blocks keep edits local and preserve the existing publishing setup.
