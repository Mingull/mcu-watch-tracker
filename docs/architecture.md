# Architecture

## Overview

The project is a single-page web application built with React and Vite.

Main responsibilities:

1. Timeline — displays the curated chronological MCU timeline.
2. Watch Tracking — manages watched status and playback progress.
3. Artwork — retrieves and displays media artwork using TMDB.
4. Persistence — stores and restores user progress through localStorage.

## Data Management

- The MCU timeline is maintained as curated static data.
- Watch progress is stored separately from timeline data.
- localStorage provides client-side persistence.
- Import and export support transferring watch progress.

Keep timeline metadata and user-specific progress separate.

## Integrations

- TMDB API is used for retrieving media artwork.
- Artwork metadata is maintained separately from the timeline.
- Avoid coupling core watch-tracking functionality to TMDB availability.

## Architectural Principles

- Modular and loosely coupled components.
- Clear separation between timeline data and watch progress.
- Reusable UI components.
- Minimal unnecessary abstractions.
- Keep the application client-side.
- Maintainable and type-safe implementations.
