# Streckbase Frontend V3

## Project Overview
Angular 22 rewrite of `streckbase_frontend_v2` (Angular 7). Same pages, templates, and SCSS,
ported to standalone components. Frontend for the workplace beverage purchase tracker.

## Tech Stack
- **Angular 22** (standalone components, lazy admin routes)
- **Node 22** via nvm-windows (`nvm use 22.22.3`; the OLD frontend needs `nvm use 10.24.1`)
- **ZONELESS change detection** (Angular 22 default). zone.js was tried first via
  `provideZoneChangeDetection()` + polyfill but zone-driven ticks never fired (bridge
  silently inactive in v22 despite correct setup — verified with browser automation).
  Instead: every async callback that mutates component state calls
  `ChangeDetectorRef.markForCheck()`. KEEP THIS PATTERN in new async code
  (HTTP subscribes, setTimeout/setInterval, promise .then).
  Safety net: header + clock tick markForCheck every second, which refreshes the whole
  (default-CD) component tree — a missed markForCheck self-heals within ~1s.
- TypeScript `strict: false` / `strictTemplates: false` — faithful port of loosely-typed v2 code.
- FontAwesome (angular-fontawesome), date-fns v4, SCSS with the v2 design tokens.

## Layout
- `src/app/app.ts` — root component (header + router-outlet + modal container)
- `src/app/app.config.ts` — providers + `streckbaseConfig` (page idle timeout)
- `src/app/pages/` — front, add, item, party, user, users, admin/* (admin is lazy via admin.routes.ts)
- `src/app/components/` — clock, feed, header, highscore, menu
- `src/app/shared/` — action-bar, button, checkbox, hidden-input, modal, spinner, user-card, wrapper, pipes
- `src/app/types/` — User, Item, Purchase
- `src/assets/styles/` — global SCSS (variables, base, forms, grid)

## Dev
- `npm start` (ng serve) — http://localhost:4200
- Backend: `streckbase_v3` (FastAPI) on port 8080 — `uv run serve` there first
- `src/environments/environment.ts` → apiUrl http://localhost:8080/api (prod build swaps in environment.prod.ts)

## Porting notes (vs v2)
- Admin `UsersService` renamed `AdminUsersService` (collision with pages/users service in root scope)
- Class guard → functional guard wrapper in admin.routes.ts
- date-fns v1 `distanceInWords` → v4 `formatDistance`
- Sass divisions (`$x/2`) converted; `@import` deprecation warnings remain (cosmetic)
- NBSP chars in v2 templates normalized to regular spaces
- products form uses `UntypedFormGroup` (mixes string/number values)
- front page: Hjälp button calls `onHelpClick($event)` with stopPropagation — the whole
  page is a routerLink to /users; without it, navigation races (and beats) the modal
- dev apiUrl is `http://127.0.0.1:8080/api`, NOT localhost — the FastAPI backend is
  IPv4-only and Windows resolves localhost to ::1 first (~2s penalty per connection)
