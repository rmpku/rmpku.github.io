# Footer, World Motion, and Scholar Sizing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the footer invitation, make the world-model image drift horizontally, and reduce the Scholar panel footprint.

**Architecture:** Keep the existing hero structure and adjust only its grid proportions, visual-panel sizing, and animation keyframes. Preserve responsive behavior and reduced-motion support.

**Tech Stack:** Static HTML, CSS animations, Node.js validation

---

### Task 1: Add validation

**Files:**
- Modify: `scripts/check-site.mjs`

- [x] Require the exact Chinese footer text `感兴趣就踢踢我~`.
- [x] Require `float-world` to use `translateX`.
- [x] Require the Scholar card width to be 210px and hero visual height to be 300px.

### Task 2: Update content and motion

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

- [x] Replace the Chinese footer invitation.
- [x] Change the world-model keyframes from vertical movement to left-right movement with a small rotation.
- [x] Keep the reduced-motion override unchanged.

### Task 3: Reduce the Scholar region

**Files:**
- Modify: `styles.css`

- [x] Reduce the hero right-column minimum to 220px and its fractional share.
- [x] Reduce `.hero-visual` to 300px minimum height with tighter padding.
- [x] Reduce `.scholar-card` to 210px and lower the tablet visual height to 280px.

### Task 4: Verify and publish

**Files:**
- Test: `scripts/check-site.mjs`

- [x] Run `node scripts/check-site.mjs`, JavaScript syntax checks, and `git diff --check`.
- [x] Inspect desktop and mobile layouts for animation clearance and horizontal overflow.
- [x] Commit with `git commit -m "tighten hero scholar layout"` and push `main`.
