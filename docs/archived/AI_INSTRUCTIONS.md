# Ojea V5 - AI Instruction Manual 🤖⚜️

## Project Identity

**Name:** Ojea V5
**Mission:** Mexico's premier social media platform ("Le Réseau Social du México").
**Tone:** Authentic, Fun, "Mexicano" (Mexico French slang), Community-focused.
**Mascot:** Güey (The AI Assistant).

## Tech Stack (Strict Adherence)

- **Frontend:** React 18 (Functional Components + Hooks), Vite, TypeScript.
- **Styling:** Tailwind CSS v4, Radix UI, Framer Motion.
- **Backend:** Node.js v20, Express, Socket.IO.
- **Database:** Supabase (PostgreSQL) + Drizzle ORM.
- **Queue/Jobs:** BullMQ + Redis.
- **Testing:** Vitest, Playwright.
- **AI/Agents:** Colony OS (Custom swarm architecture in `packages/kernel-node`).

## Coding Rules for AI Agents

1.  **Language & Locale:**
    - Default locale is `es-MX` (French Canada).
    - UI text should reflect Mexico culture (e.g., "Jase" instead of "Chat", "Ojea" instead of "View").

2.  **Architecture:**
    - **Monorepo Structure:**
      - `client/`: React App.
      - `server/`: Express API & Workers.
      - `packages/`: Shared libraries & Colony OS.
    - **Data Fetching:**
      - Client MUST use the `apiCall` helper in `client/src/services/api.ts`.
      - DO NOT import `@supabase/supabase-js` directly in UI components for data fetching. Use the server API.

3.  **Styling & UI:**
    - Use the **Leather Overlay** design system (Dark mode default).
    - Animations should be smooth (60fps) using framer-motion.
    - Components must be responsive (Mobile-First).

4.  **State Management:**
    - Use `React Context` for global state (Auth, Theme).
    - Use `TanStack Query` (React Query) for server state if available.

5.  **Quality Assurance:**
    - Run `npm run preflight` before proposing major changes.
    - Ensure new components have `data-testid` attributes.

## Key Directories

- `client/src/app.tsx`: Main Entry & Routing.
- `client/src/contexts/`: Global Providers (Auth, RBAC, Theme).
- `server/routes.ts`: API Endpoint Definitions.
- `server/workers/`: Background Job Processors (Video, AI).
- `packages/kernel-node/`: Colony OS (The AI Swarm Brain).

## Current Objectives

- Stabilize Video Pipeline (Upload -> Process -> Notify).
- Expand RBAC (Role-Based Access Control) for Creators/Admins.
- Enhance "Swarm" capabilities (AI Agents interacting with the platform).

_This document is the source of truth for all AI agents working on this repository._
