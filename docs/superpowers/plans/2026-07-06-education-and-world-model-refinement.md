# Education and World Model Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the education timeline, complete the final publication figure, and replace the hero artwork with a simpler mathematical world-model visual.

**Architecture:** Preserve the current static site structure and apply targeted HTML/CSS updates. Keep the generated artwork and supplied publication figure as optimized project-local PNG assets, with tests enforcing advisor text, logo sizing, and complete publication-image coverage.

**Tech Stack:** Static HTML, CSS, Node.js validation, built-in image generation

---

### Task 1: Add validation for the requested refinements

**Files:**
- Modify: `scripts/check-site.mjs`

- [x] **Step 1: Require the updated Ph.D. advisors**

Assert that the Ph.D. entry contains `Dr. Xiaodong Xie`, `Academician Wen Gao`, and `高文院士`, and no longer lists Shanghang Zhang as a Ph.D. advisor.

- [x] **Step 2: Require thirteen publication images**

Change the expected `publication-figure-image` count from 12 to 13 and require `assets/publications/enhanced-visual-cryptography.png`.

- [x] **Step 3: Require dedicated UCAS logo sizing**

Assert that the UCAS timeline logo uses a dedicated class and a smaller width than the general seal logo rule.

### Task 2: Update education timeline details

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

- [x] **Step 1: Enlarge organization names**

Increase `.timeline-org` from 12px to 14px while preserving its blue emphasis and spacing.

- [x] **Step 2: Replace the Ph.D. advisor line**

Use the official Peking University profile links for Dr. Xiaodong Xie and Academician Wen Gao in English and Chinese.

- [x] **Step 3: Reduce only the UCAS logo**

Add `timeline-logo-ucas` to the UCAS entry and set it to a slightly smaller desktop and mobile width.

### Task 3: Add the final publication figure

**Files:**
- Create: `assets/publications/enhanced-visual-cryptography.png`
- Modify: `index.html`

- [x] **Step 1: Copy and optimize the supplied image**

Copy the exact-title match from the user’s publication-image folder and resize it to a maximum dimension of 1000px without changing its aspect ratio.

- [x] **Step 2: Replace the remaining placeholder**

Render the new image inside the existing `publication-figure` container with descriptive alt text and lazy loading.

### Task 4: Replace the world-model artwork

**Files:**
- Create: `assets/world-model-visual-v2.png`
- Modify: `index.html`

- [x] **Step 1: Generate a mathematical visual**

Create a minimal white-background composition based on a latent manifold, state-space trajectories, geometric projections, and predictive dynamics; use thin cobalt, teal, and restrained gold lines; include no robot, landscape, text, logo, or watermark.

- [x] **Step 2: Preserve the previous asset**

Reference the new versioned file from the hero instead of overwriting the existing generated image.

### Task 5: Verify and publish

**Files:**
- Test: `scripts/check-site.mjs`

- [x] **Step 1: Run static validation**

Run:

```bash
node scripts/check-site.mjs
node --check script.js
node --check scripts/update-scholar-snapshot.mjs
git diff --check
```

Expected: all checks pass.

- [x] **Step 2: Inspect desktop and mobile rendering**

Verify the new mathematical artwork, timeline typography, UCAS logo scale, advisor links, and all 13 publication figures with no horizontal overflow.

- [x] **Step 3: Commit and push**

```bash
git add index.html styles.css scripts/check-site.mjs assets docs
git commit -m "refine education and world model visual"
git push origin main
```
