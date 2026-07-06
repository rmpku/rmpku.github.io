# Navigation and Motion Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve navigation distinction, add subtle motion, simplify the Scholar label, enlarge publication venues, and update Wen Gao’s link.

**Architecture:** Preserve the existing static navigation and IntersectionObserver reveal system. Add lightweight CSS-generated navigation markers, a globe icon and pill styling for language controls, restrained looping hero motion, and hover micro-interactions that honor `prefers-reduced-motion`.

**Tech Stack:** Static HTML, CSS animations, vanilla JavaScript, Node.js validation

---

### Task 1: Add validation

**Files:**
- Modify: `scripts/check-site.mjs`

- [x] **Step 1: Require the simplified Scholar label**

Assert that the English statistic label is exactly `Google Scholar` and does not include `citations · weekly`.

- [x] **Step 2: Require the updated Wen Gao URL**

Assert that the page uses `https://idm.pku.edu.cn/info/1017/1041.htm` and no longer uses the previous Computer Science School URL.

- [x] **Step 3: Require navigation and motion hooks**

Assert that the language switch includes `language-icon`, CSS defines colored navigation markers, motion keyframes, and publication venue font size of 11px.

### Task 2: Refine navigation and language controls

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

- [x] **Step 1: Add a language globe icon**

Insert a small inline SVG before the EN/中文 buttons, keeping it hidden from assistive technology.

- [x] **Step 2: Add colored section markers**

Use `::before` markers on the six navigation links with distinct restrained colors, and animate each marker on hover and active state.

- [x] **Step 3: Style language buttons as compact pills**

Give the selected language a blue-tinted background and the inactive language a neutral hover treatment.

### Task 3: Add subtle page motion

**Files:**
- Modify: `styles.css`
- Modify: `script.js`

- [x] **Step 1: Strengthen reveal transitions**

Add a small blur and longer easing curve to `.reveal`, then clear both when visible.

- [x] **Step 2: Stagger grouped cards**

Assign `--reveal-delay` values to direct reveal children in research, publication, patent, honor, and timeline containers.

- [x] **Step 3: Add ambient and hover motion**

Animate the mathematical world-model image and Scholar card with slow vertical drift; add slight image scale and border-color transitions to publication and research cards.

- [x] **Step 4: Preserve accessibility**

Keep all new animations disabled by the existing `prefers-reduced-motion` override.

### Task 4: Update content and publication metadata

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

- [x] **Step 1: Simplify the Scholar label**

Change the English label from `Google Scholar citations · weekly` to `Google Scholar`.

- [x] **Step 2: Update Wen Gao’s link**

Replace the old URL with `https://idm.pku.edu.cn/info/1017/1041.htm` in both language variants.

- [x] **Step 3: Enlarge venues**

Set `.publication-meta span:nth-child(2)` to 11px with medium weight.

### Task 5: Verify and publish

**Files:**
- Test: `scripts/check-site.mjs`

- [x] **Step 1: Run static checks**

```bash
node scripts/check-site.mjs
node --check script.js
git diff --check
```

Expected: all checks pass.

- [x] **Step 2: Inspect desktop and mobile rendering**

Verify nav markers, language pills, active state, animation hooks, 11px venues, no overflow, and readable mobile navigation.

- [x] **Step 3: Commit and push**

```bash
git add index.html styles.css script.js scripts/check-site.mjs docs
git commit -m "refine navigation and page motion"
git push origin main
```
