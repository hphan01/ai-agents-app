# Agent Webapp

A small React and TypeScript task list application. Tasks can be added, completed, filtered, deleted, and cleared in bulk. Data is persisted in the browser with `localStorage`.

## Requirements

- Node.js 18 or newer
- npm

## Run Locally

From this directory:

```bash
npm install
npm run dev
```

Vite will print the local development URL.

## Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` runs the strict TypeScript build and creates a production bundle.
- `npm test` runs the Vitest and React Testing Library suite.
- `npm run preview` serves the production bundle locally.

## Structure

- `src/types.ts` defines the `Task`, `TaskFilter`, and `TaskStream` contracts.
- `src/hooks/useTaskStream.ts` owns task state, filtering, mutations, ID creation, and local-storage persistence.
- `src/components/TaskApp.tsx` is the primary application container and connects the stream to the UI.
- `src/components/TaskComposer.tsx` handles new task input.
- `src/components/TaskList.tsx` renders task rows and empty states.
- `src/main.tsx` mounts the React application.
- `src/styles.css` contains the responsive visual styling.
- `src/components/TaskApp.test.tsx` covers end-to-end task interactions.
- `src/hooks/useTaskStream.test.ts` covers state, filtering, persistence, and storage failures.

## Persistence

Tasks are stored under the `daymark.tasks.v1` local-storage key. Invalid stored entries are ignored. If browser storage is unavailable or full, the current session remains usable in memory, but changes cannot be persisted.
