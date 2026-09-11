# AI Agents App

## Project Guide

- Read [README.md](README.md) for the workspace overview and [agent-webapp/README.md](agent-webapp/README.md) for setup, scripts, persistence, and the source map.
- The application lives in `agent-webapp/` and uses React, strict TypeScript, Vite, Vitest, and React Testing Library.
- Run commands from `agent-webapp/`:
  - `npm test` for the focused test suite.
  - `npm run build` for strict TypeScript validation and the production bundle.
  - `npm run dev` for local development.

## Architecture

- Keep task contracts in `agent-webapp/src/types.ts`.
- Keep task state, filtering, mutations, ID generation, and `localStorage` persistence in `agent-webapp/src/hooks/useTaskStream.ts`.
- Keep UI composition in `agent-webapp/src/components/`; preserve the existing separation between the hook and presentational components.
- Tasks use the `daymark.tasks.v1` browser storage key. Preserve invalid-storage and unavailable-storage behavior when changing persistence.

## Tests And Changes

- Put tests under `agent-webapp/src/test/`, organized by feature area such as `components/` and `hooks/`. Do not add tests beside production files unless the project structure is intentionally changed.
- Add or update React Testing Library and Vitest coverage for user-visible behavior and edge cases, especially filtering, persistence, empty states, and storage failures.
- After changes, run the narrowest relevant test first, then `npm test` and `npm run build` when the change affects shared behavior or TypeScript contracts.
- Keep changes focused and preserve accessible labels, button semantics, and existing UI behavior unless the task explicitly changes them.

## Specialized Agents

- Use [dev](.github/agents/dev.md) for React and TypeScript implementation work.
- Use [qa](.github/agents/qa.md) for code-quality, documentation, and ignore-rule review.
- Use [test](.github/agents/test.md) for Vitest and React Testing Library coverage.