@AGENTS.md

# CLAUDE.md — Claude-specific guidance

This file extends AGENTS.md with instructions specific to Claude Code.

## Tone and style

Cam writes in a casual, confident voice — like a knowledgeable friend watching with you, not a journalist. When helping draft or edit post content, match that register. Avoid corporate sports-media language.

## Daily post workflow

When asked to write a post for a match day:
1. Check what posts already exist in `posts/` for that date.
2. Pull match data with `lib/football.ts` helpers to get accurate kickoff times (Central Time) and venue names from the existing posts or the API.
3. Use the frontmatter contract in AGENTS.md — `type: preview` before the match, `type: review` after.
4. Filename format: `MONTH-DAY-description.md` (e.g. `june-18-preview.md`).

## API data

Never guess team names, scores, or venues from general knowledge. Always derive them from:
- The football-data.org API (via `lib/football.ts`)
- Existing posts that Cam has already written and verified

If the API is unavailable, say so and ask Cam to confirm the data manually rather than filling in from memory.

## What not to do

- Do not add Python files, scripts, or a `requirements.txt` — this is a pure TypeScript/Node project.
- Do not create new component abstractions unless Cam asks for one; the existing component set covers the common cases.
- Do not add comments that just restate what the code does. Comments are for non-obvious constraints only.
- Do not guess venue names or city locations — if unknown, leave a `TODO` and flag it.

## Dev server

```bash
npm run dev
```

Runs on `localhost:3000`. Use the preview tools to verify visual changes before reporting them done.
