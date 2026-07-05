# Rui Ma · Research Profile

Bilingual research profile for [rmpku.github.io](https://rmpku.github.io/).

## Local preview

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173`.

## Content policy

- English CV content is the primary factual source.
- The Chinese CV contributes newer honors and accepted-paper updates.
- The publications section contains only published or formally accepted papers.
- Papers marked submitted or under review are intentionally excluded.
- Phone and WeChat details are intentionally omitted from the public site.
- CV files and download links are intentionally omitted; all public information is displayed in the page.

## Structure

- `index.html` — semantic bilingual content
- `styles.css` — responsive programmer-romantic visual system
- `script.js` — language, navigation, and publication filtering
- `assets/` — institution logos, the terminal-garden artwork, and the Scholar snapshot
- `scripts/update-scholar-snapshot.mjs` — weekly Scholar citation capture
- `.github/workflows/update-scholar-snapshot.yml` — scheduled refresh every Monday

The website itself is dependency-free. Playwright is used only by the scheduled Scholar
snapshot workflow.
