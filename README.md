# Cam's Corner — World Cup 2026 Blog

A personal match-day blog for the 2026 FIFA World Cup. Built with Next.js (App Router), Tailwind CSS, and live data from the football-data.org API.

## What it does

- Live scores ticker bar on every page
- Daily preview and match-review posts written in Markdown
- Standings table pulled live from the API
- Match calendar with upcoming fixtures
- Bracket page for the knockout rounds

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Data | football-data.org REST API |
| Content | Markdown files in `posts/` via gray-matter |
| Prose rendering | remark + remark-html |

## Setup

```bash
npm install
```

Create `.env.local` with:

```
FOOTBALL_API_BASE=https://api.football-data.org/v4
FOOTBALL_API_KEY=your_key_here
WORLD_CUP_ID=2000
```

## Run

```bash
npm run dev      # localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

## Dependencies

All dependencies live in `package.json` — there is no Python layer. Node 18+ required.

## Content workflow

Add a new Markdown file to `posts/` with the required frontmatter and the post appears automatically on the home page and the `/posts`, `/previews`, or `/reviews` routes.

Required frontmatter fields:

```yaml
---
title: "Post title"
date: "YYYY-MM-DD"
type: preview   # or review
excerpt: "One-line teaser shown on post cards"
---
```

Optional fields: `match` (fuzzy-matched to API fixture names for inline match cards), `venues` (map of "Home vs Away" to "Stadium, City").

## Project layout

```
app/           Next.js App Router pages and API routes
components/    Shared UI components (MatchCard, ScoresBar, etc.)
lib/           API helpers (football.ts) and content helpers (posts.ts, dates.ts)
posts/         Markdown content — one file per day/post
public/        Static assets
```
