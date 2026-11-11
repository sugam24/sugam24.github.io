# Sugam Dahal's portfolio

A personal academic and engineering portfolio covering research, publications, experience, and selected projects. The live site is [sugam24.github.io](https://sugam24.github.io/).

## Local preview

The site uses plain HTML, CSS, and browser JavaScript. From the repository root, use Python 3 to serve the files locally.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [127.0.0.1:8000](http://127.0.0.1:8000/). The site needs no dependency installation or local build.

## Checks

```sh
git diff --check
node --check assets/js/main.js
```

Node.js is optional and is used here only to check JavaScript syntax. The repository has no configured formatter, linter, type checker, or test runner. For a page change, preview the affected section at desktop and mobile widths in both themes and check any links or controls it touches.

## Deployment

GitHub Pages hosts the static files in this repository. The public deployment history shows GitHub's generated Pages workflow publishing from `main`. Review changes before they reach the publishing source, then check the Pages workflow result and the live site. The repository owner's **Settings → Pages** view shows the configured source.

## Documentation

- [Architecture](docs/ARCHITECTURE.md) explains how the page is assembled, styled, and enhanced.
- [Maintenance](docs/MAINTENANCE.md) shows where to edit content and provides copyable examples.
- [Design decisions](docs/DESIGN_DECISIONS.md) explains the established visual and editorial choices.
- [Agent guidance](AGENTS.md) describes scope and verification for AI-assisted changes.
