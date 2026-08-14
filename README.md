# GRE 刷题平台 · GRE Practice Platform

**Live:** https://whitmanz.github.io/gre-study-platform/

A clean, GRE-style practice platform for **Verbal (语文)** and **Quant (数学)** questions.
Upload your own papers (PDF / Markdown / TXT) or jump straight into the built-in real-exam samples,
then review every question with a click-to-jump results page.

Built as a single static site — **no build step, no backend**. Open `index.html` and go.

## Features

- **Cover / library** — pick a test, see your best score, resume or review.
- **Player** — Text Completion (1/2/3 blanks), Sentence Equivalence (6-option, pick 2),
  Quantitative Comparison, single/multi-choice, and numeric-entry questions.
- **Results** — raw score + a rough GRE 170-scale estimate, **per subject** (V and Q estimated separately),
  with an animated score ring and a clickable question list that jumps straight to the explanation.
- **Upload** — paste Markdown/PDF, or type questions in the simple format below.
- **Local-first** — tests and scores are saved in your browser (`localStorage`).

## Run it

Just open `index.html` in a browser. Or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Question format (for upload)

One question per numbered line. Options use letters `A`–`I`; the answer goes on a `> answer:` line.

```text
1. Scientists argued the compound was ____ interesting.
   A. limited
   B. dubious
   C. intrinsic
   > answer: C
   > explanation: intrinsic = 固有的，与后文 important 同向。

2. Although safe, the drug remains (i)____ and (ii)____ unsettling.
   A. sound     D. retroactively
   B. risky     E. innocuously
   C. odd       F. intrinsically
   > answer: A, F
   > explanation: Although 转折……
```

- **Blanks:** use `____` or `(i)____ (ii)____`. For 2/3 blanks, options are grouped A–C / D–F / G–I automatically.
- **Sentence Equivalence (6→2):** single blank + two letters in `> answer:`.
- **Numeric entry:** no options; write the value directly, e.g. `> answer: 40` (decimals and fractions like `3/4` supported).
- **Subject:** choose 语文 / 数学 in the upload dialog — the results page estimates each separately.

> Note: scanned / image-only PDFs (like the Sept real-exam sheets) can't be text-extracted.
> Export them to the Markdown format above, or just use the built-in samples.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | App shell (cover / player / results / review views) |
| `app.js` | Parser, router, scoring and review logic |
| `styles.css` | All styling |
| `samples.js` | Built-in sample tests (GRE 9.1 Sec 2, GRE 9.2 Sec 3, Quant demo) |
| `GRE9.1.md`, `GRE9.2.md` | The same samples as uploadable Markdown |

## Design

Styled following [Emil Kowalski's design-engineering principles](https://animations.dev/):
custom easing curves, `scale(.97)` press feedback on every control, origin-aware modal entrance,
a score ring that animates its fill, staggered card entrance, and a `prefers-reduced-motion` fallback.

## GRE score estimate

The "≈ X / 170" figure is a **rough linear conversion** (`130 + correct_rate × 40`) applied per section.
Real GRE uses adaptive equating — treat it as a ballpark, not a prediction.
