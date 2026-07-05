import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "index.html",
  "styles.css",
  "script.js",
  "favicon.svg",
  ".nojekyll",
  "assets/scholar-citations.png",
  "assets/scholar-stats.json",
  "assets/profile.png",
  "assets/world-model-visual.png",
  "assets/logos/pku-seal.svg",
  "assets/logos/nxu.png",
  "assets/logos/ncepu.png",
  "assets/logos/ucas.png",
  "assets/logos/ikingtec.png",
  "scripts/update-scholar-snapshot.mjs",
  ".github/workflows/update-scholar-snapshot.yml",
  "assets/research/embodied-safety.png",
  "assets/research/multimodal-trust.png",
  "assets/research/copyright-authentication.png",
  "assets/research/content-traceability.png",
  "assets/publications/waveface.png",
  "assets/publications/see-to-act.png",
  "assets/publications/scene-adaptive-crowd-counting.png",
  "assets/publications/enhanced-blind-watermarking.png",
  "assets/publications/frame-recurrent-crowd-counting.png",
  "assets/publications/towards-blind-watermarking.png",
  "assets/publications/chosen-plaintext-attack.png",
  "assets/publications/optical-information-hiding.png",
  "assets/publications/multi-image-encryption.png",
  "assets/publications/scanning-position-error-correction.png",
  "assets/publications/sharpness-autofocusing.png",
  "assets/publications/natural-speckle-watermarking.png",
];

await Promise.all(required.map((path) => access(join(root, path))));

const [html, css] = await Promise.all([
  readFile(join(root, "index.html"), "utf8"),
  readFile(join(root, "styles.css"), "utf8"),
]);
const publicationCount = (html.match(/<article class="publication reveal"/g) || []).length;
if (publicationCount !== 13) {
  throw new Error(`Expected 13 publications, found ${publicationCount}`);
}

const journalCount = (html.match(/data-type="journal"/g) || []).length;
const conferenceCount = (html.match(/data-type="conference"/g) || []).length;
if (journalCount !== 9 || conferenceCount !== 4) {
  throw new Error(`Expected 9 journals and 4 conferences, found ${journalCount} and ${conferenceCount}`);
}

const publicationBlock = html.match(
  /<div class="publication-list"[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/,
)?.[0];
if (!publicationBlock) throw new Error("Publication list was not found");
if (/\b(under review|submitted|审稿中|投稿中)\b/i.test(publicationBlock)) {
  throw new Error("Publication list includes a submitted or under-review entry");
}

const publicationYears = [
  ...publicationBlock.matchAll(/publication-meta"><span>(\d{4})<\/span>/g),
].map((match) => Number(match[1]));
if (publicationYears.some((year, index) => index > 0 && year > publicationYears[index - 1])) {
  throw new Error(`Publications are not reverse chronological: ${publicationYears.join(", ")}`);
}

const honorList = html.match(/<div class="honor-list">([\s\S]*?)<\/div>\s*<aside class="funding-panel/)?.[1];
const fundingPanel = html.match(/<aside class="funding-panel reveal">([\s\S]*?)<\/aside>/)?.[1];
const heroLinks = html.match(/<div class="hero-links">([\s\S]*?)<\/div>/)?.[1];
if (!honorList || !fundingPanel || !heroLinks) {
  throw new Error("Could not locate honor, funding, or hero-link regions");
}
for (const fundingName of ["China Scholarship Council", "Outstanding Youth Program"]) {
  if (!fundingPanel.includes(fundingName) || honorList.includes(fundingName)) {
    throw new Error(`${fundingName} must appear in Funding only`);
  }
}
for (const profileUrl of [
  "https://github.com/rmpku",
  "https://scholar.google.com.hk/citations?user=IJTYZlUAAAAJ&hl=en",
]) {
  if (!heroLinks.includes(profileUrl)) throw new Error(`Missing top profile link: ${profileUrl}`);
}
if (html.includes("hero-name-zh")) {
  throw new Error("The Chinese name must be removed from the hero");
}

for (const id of ["about", "research", "publications", "patents", "experience", "honors", "service"]) {
  if (!html.includes(`id="${id}"`)) throw new Error(`Missing section #${id}`);
}

for (const href of [
  "assets/scholar-citations.png",
  "assets/profile.png",
  "styles.css",
  "script.js",
]) {
  if (!html.includes(`href="${href}`) && !html.includes(`src="${href}`)) {
    throw new Error(`Missing reference to ${href}`);
  }
}

if (/\.(pdf|docx)\b|assets\/cv-/i.test(html)) {
  throw new Error("The page still exposes a CV or document attachment");
}

for (const url of [
  "https://www.ai.pku.edu.cn/info/1139/2918.htm",
  "https://liuziwei7.github.io/",
]) {
  if (!html.includes(url)) throw new Error(`Missing advisor homepage: ${url}`);
}

if (html.includes("张尚航") || !html.includes("仉尚航")) {
  throw new Error("The Chinese spelling of 仉尚航 is missing or incorrect");
}

if (html.includes("assets/terminal-garden.svg")) {
  throw new Error("The removed flower artwork is still referenced");
}

if ((html.match(/class="timeline chronological-timeline"/g) || []).length !== 1) {
  throw new Error("Experience and education must use one chronological timeline");
}

if ((html.match(/class="[^"]*external-link[^"]*"/g) || []).length < 6) {
  throw new Error("Advisor links must use icon-only external-link styling");
}

if (!html.includes('class="email-link"') || !css.includes("text-transform: none")) {
  throw new Error("Lowercase email rendering is not protected");
}

if (html.includes("ruima@pku.edu.cn") || html.includes("mailto:")) {
  throw new Error("The public email must be obfuscated with AT");
}
if (!html.includes("ruima AT pku.edu.cn")) {
  throw new Error("The obfuscated public email is missing");
}
if (!html.includes("authorized patents") || !html.includes("项已授权发明专利")) {
  throw new Error("The hero statistics must include authorized patents");
}
if (!html.includes('id="scholar-citations-count"') || !html.includes("Google Scholar citations")) {
  throw new Error("The hero statistics must include the weekly Scholar citation count");
}
if (!html.includes('class="world-model-visual"')) {
  throw new Error("The hero must include the generated world-model visual");
}
if ((html.match(/class="timeline-org"/g) || []).length !== 6) {
  throw new Error("Every timeline entry must show an explicit organization name");
}
for (const logoPath of ["assets/logos/ikingtec.png", "assets/logos/ucas.png"]) {
  if (!html.includes(logoPath)) throw new Error(`Missing supplied logo reference: ${logoPath}`);
}
if (!html.includes("Visiting collaborator: mmlab@NTU")) {
  throw new Error("The CSC visiting-collaborator wording is outdated");
}
if (html.indexOf('<div class="hero-links">') > html.indexOf('<div class="hero-actions">')) {
  throw new Error("Hero profile links must appear above Explore publications");
}

if (!css.includes("white-space: nowrap")) {
  throw new Error("Long English section headings are not protected from wrapping");
}

if ((html.match(/class="research-visual"/g) || []).length !== 4) {
  throw new Error("Expected four Research Interests visuals");
}

if ((html.match(/class="publication-figure"/g) || []).length !== 13) {
  throw new Error("Expected one replaceable figure slot for every publication");
}
if ((html.match(/class="[^"]*\bpublication-figure-image\b[^"]*"/g) || []).length !== 12) {
  throw new Error("Expected twelve supplied publication figures");
}

if ((html.match(/class="publication-title-link"/g) || []).length !== 13) {
  throw new Error("Expected one publication link for every paper");
}

if ((html.match(/class="patent-card reveal"/g) || []).length !== 7) {
  throw new Error("Expected seven authorized patent cards");
}

for (const patent of [
  "CN112132747B",
  "CN111563938B",
  "CN111526261B",
  "CN110942413B",
  "CN110728164B",
  "CN110360924B",
  "CN110308117B",
]) {
  if (!html.includes(patent)) throw new Error(`Missing authorized patent: ${patent}`);
}

if (/CN(?:112132747|111563938|111526261|110942413|110728164|110360924|110308117)A\b/.test(html)) {
  throw new Error("Authorized patents must use grant publication numbers ending in B");
}

for (const url of [
  "https://eecs.pku.edu.cn/xxkxjsxy/info/1503/6701.htm",
  "https://people.ucas.ac.cn/~sys",
]) {
  if (!html.includes(url)) throw new Error(`Missing advisor homepage: ${url}`);
}

if (!html.includes('class="hero-portrait"') || html.includes('class="about-profile"')) {
  throw new Error("The portrait must appear beside the hero name, not in About");
}

if (!/class="[^"]*integrated-profile[^"]*"/.test(html) || !html.includes('id="experience"')) {
  throw new Error("About and Experience must be integrated in one early section");
}

const logoRule = css.match(/\.timeline-logo\s*\{([\s\S]*?)\}/)?.[1] || "";
const logoImageRule = css.match(/\.timeline-logo img\s*\{([\s\S]*?)\}/)?.[1] || "";
if (/\bbackground\s*:|\bfilter\s*:/.test(logoRule + logoImageRule)) {
  throw new Error("Timeline logos must not receive a background or color filter");
}

if (!/\.stat span\s*\{[\s\S]*?font-size:\s*13px/.test(css)) {
  throw new Error("Statistic labels must be enlarged by two pixels");
}
if (!/\.footer-bottom\s*\{[\s\S]*?font-size:\s*11px/.test(css)) {
  throw new Error("Footer copyright and back-to-top text must be enlarged");
}

console.log("PASS: integrated profile, visuals, links, logos, Scholar, and publications validated");
