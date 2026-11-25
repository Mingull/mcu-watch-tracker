# MCU Watch Tracker

A React + Vite + TypeScript watch tracker with shadcn/ui-compatible local components (`components.json`, Radix UI primitives, Tailwind CSS v4, Lucide icons). It stores progress in `localStorage` and supports JSON export/import.

## Run locally

```bash
pnpm install
pnpm dev
```

Build with `pnpm build`.

## Features

- Chronological MCU watch order with approximate in-universe date labels.
- Films, specials and one-shots can be marked watched.
- Series seasons expand into individually trackable episode checkboxes.
- Search, type/phase/status filters, and optional multiverse/alternate-timeline entries.
- Continue-watching view and a next-up card.
- Progress stored locally; export/import JSON backups.

## Timeline data

The main chronology follows Marvel's [Complete MCU Timeline](https://www.marvel.com/articles/movies/mcu-timeline-order-disney-plus) where possible, supplemented with Marvel Television and multiverse entries for a broader watch-through. It is a curated guide rather than a claim that every disputed placement is official. Dates labelled approximate, upcoming projects, and the placement of Spider-Man: Brand New Day / VisionQuest may change as Marvel publishes more information. Runtime and episode-count metadata are estimates for tracking purposes. Series are tracked by season with episode numbers, not episode titles.
