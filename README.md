# Cravings Lab

A gentle self-reflection toolkit for understanding cravings and changing automatic patterns.

**Live site:** https://snowch.github.io/cravings-lab/

## What it does

- Lightweight hunger, craving and context check-ins, with optional mood and eating-control notes.
- Four guided practices: noticing an urge, cognitive defusion, checking needs and an optional timed pause.
- One active experiment at a time, with editable plans and end-of-experiment reflections.
- Personal context summaries, check-in history and practice reflections.
- Evidence explanations and UK support links, with clear limits on diagnosis and treatment claims.
- Tab-only mode by default; optional device storage; JSON export; individual and complete deletion.

No food bans, weight targets, calories, abstinence streaks, diagnosis scores, accounts or analytics. Hunger is a reason to eat, not a signal to complete a delay exercise. Repeated loss of control and distress lead toward support rather than stricter limits.

## Run locally

Requires Node.js 24 and Python 3 for the development test server.

```sh
npm ci
npm run serve
```

Open http://localhost:4173. The app is plain HTML, CSS and JavaScript modules; there is no build or runtime dependency. Serve it over HTTP rather than opening index.html as a file.

## Verify

```sh
npm run check
npx playwright install chromium
npm test
```

Outside CI, the Playwright configuration uses `/usr/bin/chromium`, provided by the development environment. Change `executablePath` in `playwright.config.js` for another local installation. In CI, Playwright uses its downloaded Chromium.

Tests exercise desktop and mobile flows, tab-only behaviour, persistence, export contents, deletion, safe rendering of notes, experiment lifecycle, practices, timer behaviour and unavailable storage. Axe checks run on core screens for WCAG A/AA rules; these automated checks do not establish complete accessibility compliance or clinical validation.

## Deployment

Pushing `main` runs `.github/workflows/pages.yml`. The workflow installs development dependencies, checks JavaScript, runs browser/accessibility tests, then uploads only the five static application assets to GitHub Pages. Pull requests run the checks without deployment. Set repository **Settings → Pages → Source** to **GitHub Actions**.

Relative asset paths and hash-based routes support the `/cravings-lab/` project path without server rewrites.

## Files

- `index.html`: application shell, navigation and delete confirmation.
- `app.js`: screens, content, interactions and storage controls.
- `model.js`: data shape, storage reading, escaping and summaries.
- `style.css`: responsive styles, focus states and reduced-motion support.
- `tests/`: Playwright flows and axe accessibility checks.

## Privacy

Tab-only mode holds entries in JavaScript memory and clears them on reload or close. Opting into device saving writes to localStorage under `cravings-lab-v1`. Disabling device saving removes the persisted copy while keeping current entries in memory. Nothing is sent to an application backend. Local storage is not encrypted or isolated from other apps served from the same origin; avoid device saving on shared browser profiles. Browser clearing/private mode may erase entries. JSON exports contain sensitive information and cannot currently be imported.

GitHub Pages receives ordinary hosting requests. External source and support links open third-party sites. No external fonts, scripts, analytics or embedded services are used by the app.

## Content and scope

Informed by the supplied *Sugar and Chocolate “Addiction”* research synthesis (14 November 2026). Public content links to NICE NG69, NHS guidance, the sugar-addiction critical review and a review of laboratory craving interventions. Strong evidence for clinician-delivered CBT/guided self-help should not be interpreted as evidence that this app is an equivalent intervention. Brief craving techniques have more limited evidence.

This is a self-reflection toolkit for adults, not a diagnostic test, clinically validated programme, medical device or substitute for eating-disorder care. Content changes should preserve that distinction and avoid promoting restriction or compensatory behaviour.
