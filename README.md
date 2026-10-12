# Memtime Time Tracking

A small time-tracking workspace built on the Memtime interview API. Browse clients, projects and tasks, review your time entries, and create, edit or delete them.

## Features

- **Client → Project → Task tree.** Each level loads only when expanded, so browsing stays inside the API's 15 requests per minute. It includes a client filter, keyboard navigation and a "Log time" shortcut on every task.
- **Time entries table.** Sorting and pagination are kept in the URL. Times show in the user's time zone, with a computed duration column. Delete has an Undo.
- **Create / edit drawer.** The drawer opens from the URL (`?entry=new`, `?entry=<id>`).
  - The task picker shows recent tasks and lets you drill down client → project → task.
  - Time input is forgiving (`930`, `9a`, `1h30`), and start, end and duration stay in sync.
  - Validation errors appear inline. The API's 400 and 404 errors and rate limits each get a clear message.

## Tech stack

- **Framework:** Next.js 16 (App Router, Cache Components, Server Actions), React 19, TypeScript
- **UI:** [shadcn/ui](https://ui.shadcn.com) (Radix) with Tailwind CSS v4, lucide icons and sonner toasts
- **Validation:** zod, with one schema shared by the browser and the server
- **Tests:** Vitest unit tests for time parsing, validation and form logic

## Getting started

Create a `.env` file:

```
API_BASE_URL=https://interview-api.memtime-demo.deno.net/api/v1
API_TOKEN=<your api key>
```

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # unit tests
npm run build   # production build
```

## How it works

- **API client** (`app/lib/api/client.ts`): a server-only `fetch` wrapper.
  - Adds the Bearer token, a 10s timeout and typed errors.
  - Tracks the rate limit from the API's headers and stops calling the API once the limit is reached.
- **Services** (`app/services/`): typed functions for each endpoint. `cached.ts` wraps the reads in `'use cache'`:
  - Clients, projects and tasks are cached for hours, and time entries for minutes.
  - Readers return result objects instead of throwing, so error statuses survive the cache.
- **Route handlers** (`app/api/v1/`): mirror the Memtime API, so the browser can fetch through the app without ever seeing the API key.
  - `userId` is removed from time entries, because it contains the key.
- **Server Actions** (`app/actions/time-entries.ts`): create, update and delete. Each one validates with zod and invalidates the cached entries, so the table refreshes right away.

## Folder structure

```
app/
  actions/            Server Actions
  api/v1/             Route handlers that forward to the Memtime API
  components/
    ui/               shadcn/ui components
    shared/           Components used across features
    <feature>/        <feature>.tsx plus _components/, hooks/, lib/, types/
  hooks/              Shared client hooks
  lib/                API client, time parsing, validation, URL params
  services/           Endpoint functions and cached readers
  types/              API and shared types
```

The features are `project-tree`, `time-entries`, `time-entry-form`, `entry-drawer` and `workspace-shell`. A component that has its own subcomponents gets its own folder with an `_components/` directory.

## API notes

The live API differs from its documentation in a few ways:
- **Data shape:** statuses are `pending` / `in-progress` / `completed`, tasks have `projectId`, and ids start at 0.
- **Sorting:** results by `start` are unreliable after an entry is updated, so each page is also sorted in the app.
- **Persistence:** the demo data appears to reset from time to time.
