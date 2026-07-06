# Education Field Copy Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the Chinese advisor name, simplify the Chinese Scholar label, and rewrite all three degree fields and research directions bilingually.

**Architecture:** Keep the existing chronological timeline and language-switch structure. Replace only the bilingual copy and add regression checks for exact Chinese and English education text.

**Tech Stack:** Static HTML, Node.js validation

---

### Task 1: Add regression checks

**Files:**
- Modify: `scripts/check-site.mjs`

- [x] Reject `谢晓东研究员` and require `解晓东研究员`.
- [x] Require the Chinese Scholar statistic label to be exactly `Google Scholar`.
- [x] Require all six new bilingual degree strings.

### Task 2: Update bilingual copy

**Files:**
- Modify: `index.html`

- [x] Change the Chinese advisor display name to `解晓东研究员`.
- [x] Change the Chinese Scholar label to `Google Scholar`.
- [x] Set the Ph.D. copy to Computer Science / Computer Vision & Information Security.
- [x] Set the M.S. copy to Physics / Optical Imaging & Information Hiding.
- [x] Set the B.E. copy to Automation / Measurement, Control Technology & Instrumentation.

### Task 3: Verify and publish

**Files:**
- Test: `scripts/check-site.mjs`

- [x] Run static and syntax checks.
- [x] Inspect English and Chinese timeline rendering at desktop and mobile widths.
- [x] Commit with `git commit -m "correct education fields and advisor name"` and push `main`.
