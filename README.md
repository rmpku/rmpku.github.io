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
- `styles.css` — responsive warm-white editorial visual system
- `script.js` — language, navigation, and publication filtering
- `assets/` — profile portrait, original-color institution logos, research illustrations, and the Scholar snapshot
- `scripts/update-scholar-snapshot.mjs` — weekly Scholar citation capture
- `.github/workflows/update-scholar-snapshot.yml` — scheduled refresh every Monday

The website itself is dependency-free. Playwright is used only by the scheduled Scholar
snapshot workflow.

About, experience, and education share one early profile section, with the latter two
presented as a reverse-chronological timeline. Advisor homepages use compact external-link
icons, every publication title links to its Scholar record or exact Scholar search, and
each paper includes a replaceable figure slot for future experiment screenshots. The
patent section lists seven granted Chinese invention patents with grant publication
numbers, authorization dates, bilingual titles, and external patent records. Publications
are displayed in reverse chronological order; fellowships and research grants are kept in
the Funding column, while GitHub and Google Scholar links remain in the hero.
