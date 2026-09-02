# Trivia Showdown

Jeopardy-style trivia board for youth group game nights. Single host screen,
3–20 teams, question bank with categories/point tiers, three question types
(text, letter-hint, live-picked audio clip).

## Status

This is stage 1 of 3 in the build plan: core gameplay has been migrated from
a Claude.ai prototype into a real, deployable project. Stage 2 (richer
question types — sequential photo reveal, multi-answer lists, simultaneous
audio) and stage 3 (theme presets, e.g. a Fall theme with its own category
set) are not built yet.

## Running locally

```
npm install
npm run dev
```

Then open http://localhost:3000.

## Data

The question bank and game session (teams, scores, current board) are saved
in the browser's localStorage — nothing leaves the device, no account or
database is required. Because of this, always play from the same
browser/device you set the game up on.

## Deploying

Push this repo to GitHub, then import it in Vercel (vercel.com) — no
configuration needed, it's a standard Next.js app.
