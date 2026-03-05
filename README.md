## pantri – MVP

pantri is a meal-generation app that helps university students reduce food waste by suggesting meal ideas based on ingredients they already have in their fridge or pantry.

This repository contains:

- `mobile`: Expo + React Native + TypeScript client
- `server`: Node.js + Express + TypeScript backend with PostgreSQL + Prisma

### Core MVP features

- Add ingredients currently in the pantry (optionally with expiration date)
- View the list of ingredients
- Generate meal ideas from available ingredients
- Mark ingredients as used or remove them

---

### Tech stack

- **Mobile**: Expo, React Native, TypeScript, React Navigation
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL

---

### Getting started

#### Prerequisites

- Node.js (LTS recommended)
- npm, pnpm, or yarn
- PostgreSQL instance
- Expo CLI (optional but recommended)

#### Backend (`server`)

1. `cd server`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and set `DATABASE_URL` for PostgreSQL
4. Run migrations and generate Prisma client:
   - `npx prisma migrate dev`
5. Start the dev server:
   - `npm run dev`

The API will run on `http://localhost:4000` by default.

#### Mobile app (`mobile`)

1. `cd mobile`
2. Install dependencies: `npm install`
3. Start the Expo dev server:
   - `npm start`

Update the API base URL in `src/services/api.ts` if your backend is not running on `http://localhost:4000`.

---

### High-level architecture

- **Mobile app**
  - `navigation`: React Navigation setup and route types
  - `screens`: Feature screens (`Pantry`, `AddIngredient`, `MealIdeas`)
  - `components`: Reusable UI components
  - `services`: API client for talking to the backend
  - `hooks`: Feature-specific hooks for state and data fetching
  - `theme`: Colors, spacing, and typography tokens

- **Backend**
  - `src/index.ts`: Express app entrypoint
  - `src/routes`: Feature-oriented route modules (`pantry`, `mealIdeas`)
  - `src/prisma.ts`: Prisma client singleton
  - `prisma/schema.prisma`: Database schema definition

