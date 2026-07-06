# Back-to-Top and Floating World Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair the Back to top anchor and make the world-model image feel borderless and more dynamically suspended.

**Architecture:** Move the `#top` target from the fixed header to the document body so native smooth scrolling reaches the actual page origin. Keep the world-model PNG but visually integrate its white background using borderless styling and multiply blending, with larger horizontal keyframes on desktop and safe reduced-amplitude motion on mobile.

**Tech Stack:** Static HTML, CSS animations, native anchor navigation, Node.js validation

---

### Task 1: Add validation

**Files:**
- Modify: `scripts/check-site.mjs`

- [x] Require `id="top"` on `<body>` and reject it on the fixed header.
- [x] Require the world-model rule to use no border, no shadow, no radius, and `mix-blend-mode: multiply`.
- [x] Require desktop horizontal motion of at least 18px and a duration of 3.8 seconds.

### Task 2: Repair Back to top

**Files:**
- Modify: `index.html`

- [x] Move `id="top"` from `.site-header` to `<body>`.
- [x] Preserve both the brand and footer links as `href="#top"`.
- [x] Verify from the bottom of the page that the link returns `window.scrollY` to zero.

### Task 3: Refine world-model motion

**Files:**
- Modify: `styles.css`

- [x] Remove border, border radius, and box shadow from `.world-model-visual`.
- [x] Add `mix-blend-mode: multiply` so the pale background visually merges with the page.
- [x] Change desktop motion to `translateX(-18px)` ↔ `translateX(18px)` over 3.8 seconds.
- [x] Add a mobile keyframe using ±10px to avoid clipped content while remaining more dynamic than before.

### Task 4: Verify and publish

**Files:**
- Test: `scripts/check-site.mjs`

- [x] Run static and syntax checks.
- [x] Test the footer link and animation clearance at desktop and mobile widths.
- [x] Commit with `git commit -m "fix back to top and world motion"` and push `main`.
