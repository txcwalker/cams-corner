<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — AI Handoff Contract

This file is the canonical "land here first" document for any AI agent (Claude, Codex, Gemini, Cursor, etc.) working in this repo.

## What this project is

A personal Next.js blog for the 2026 FIFA World Cup. Cam writes daily match previews and post-match reviews in Markdown. The site pulls live scores and standings from football-data.org and displays them alongside the written content.

## Active files — safe to read and edit

| Path | Purpose |
|---|---|
| `app/` | All Next.js App Router pages and API routes |
| `components/` | Shared UI components |
| `lib/football.ts` | All football-data.org API calls |
| `lib/posts.ts` | Markdown post loading and metadata |
| `lib/dates.ts` | Central Time date helpers |
| `posts/*.md` | Cam's written content — one file per day |
| `package.json` | All dependencies |
| `.env.local` | API keys (never commit) |

## Do not touch

| Path | Reason |
|---|---|
| `.next/` | Build output — generated, not source |
| `node_modules/` | Installed packages |
| `.env.local` | Secrets — read but never write or log |

## Environment variables

All three must be set in `.env.local`:

```
FOOTBALL_API_BASE=https://api.football-data.org/v4
FOOTBALL_API_KEY=<key>
WORLD_CUP_ID=2000
```

## Data quirks — read before touching football.ts or posts

- **Team names** must match football-data.org spellings exactly (e.g. "United States" not "USA", "Korea Republic" not "South Korea"). Mismatches break match card lookups.
- **Timezone**: The API returns UTC. All date helpers in `lib/dates.ts` work in US Central Time. Do not add timezone logic outside that file.
- **Venue format**: Venue strings in post frontmatter use "Stadium Name, City" — city only, no state or country.
- **Match card fuzzy matching**: `ArticleWithCards.tsx` matches post frontmatter `match` field against API fixture names using a simple includes check. The match string should be "Home vs Away" using the API's exact team names.
- **WORLD_CUP_ID**: `2000` is the football-data.org competition ID for the 2026 World Cup. Do not change it.

## Verification commands

```bash
npm run dev     # start dev server — verify pages render at localhost:3000
npm run build   # production build — catches type errors and broken imports
npm run lint    # ESLint
```

A passing build (`npm run build`) is the minimum bar before any PR or commit.

## Post frontmatter contract

```yaml
---
title: "Post title"
date: "YYYY-MM-DD"
type: preview   # or review
excerpt: "One-line teaser"
match: "Home vs Away"          # optional — triggers inline match card
venues:                        # optional — displayed on match cards
  "Home vs Away": "Stadium, City"
---
```

## Tech versions (do not upgrade without testing)

- Next.js 16.2.9
- React 19.2.4
- Tailwind CSS 4
- TypeScript 5

## What agents typically work on here

1. Writing or editing Markdown posts in `posts/`
2. UI tweaks in `components/` or `app/`
3. API helper changes in `lib/football.ts`
4. Adding new pages or routes under `app/`
5. Styling adjustments in `app/globals.css` or inline Tailwind classes
