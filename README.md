# Uptown Spaces CRM

Uptown Spaces CRM is a React and Express sales workspace for managing Indian real-estate leads from capture through qualification, site visit, negotiation, and won/lost outcomes.

## Features

- MongoDB-backed lead CRUD with status, notes, search, and filters
- Pipeline stages: New, Contacted, Qualified, Site Visit, Negotiation, Won, Lost
- Deterministic lead intelligence scoring with HOT, WARM, and COLD classifications
- Property inventory API with budget, location, and property-type matching
- Follow-up API for calls, meetings, email, WhatsApp, and site visits
- MongoDB-backed analytics for pipeline and source metrics
- Password hashing with `bcryptjs` and HTTP-only JWT session cookies
- Responsive CRM dashboard using Recharts and the existing component library
- Seed command with realistic Mumbai-region demo data

## Architecture

The Vite React client talks to a shared Express application in `api/app.ts`. The local development server mounts that app alongside Vite middleware. `api/index.ts` exports the same app for Vercel. Mongoose models live in `api/models`, while lead scoring and property matching live in `api/services`.

## Stack

React, TypeScript, Vite, Tailwind CSS, Express, Mongoose, MongoDB, React Hook Form, Zod, Recharts, Lucide React, and Motion.

## Setup

1. Install Node.js 20 or newer and MongoDB (local or Atlas).
2. Copy `.env.example` to `.env` and set `MONGODB_URI` and a long `JWT_SECRET` value.
3. Install dependencies:

```bash
npm install
```

4. Seed demo data:

```bash
npm run seed
```

5. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3002`. Create an account from the login screen, then use the seeded pipeline.

## Environment Variables

- `MONGODB_URI`: required for leads, properties, follow-ups, authentication, and analytics
- `JWT_SECRET`: signs login tokens; replace the development value in real deployments
- `GEMINI_API_KEY`: optional and reserved for future server-side Gemini explanations; no key is exposed to the browser
- `PORT`: optional local server port, default `3002`

## API Overview

- `GET /api/health`
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`
- `GET/POST/PATCH/DELETE /api/leads`
- `GET/POST/PATCH/DELETE /api/properties`
- `GET/POST/PATCH /api/follow-ups`
- `GET /api/leads/:id/matches`
- `GET /api/analytics`

All business endpoints return JSON errors with appropriate status codes and reject malformed MongoDB IDs.

## AI Lead Intelligence

The current intelligence engine is deterministic and available without an external provider. It considers budget, contact completeness, stage progression, notes, location/property completeness, and recency. Gemini is intentionally not called unless a server-side integration is added; no fake provider response is generated.

## Screenshots

_Add screenshots here after capturing the dashboard and lead command center._

## Deployment

Build the client with `npm run build` and deploy the Express API with a Node host or use the included Vercel function entrypoint. Configure the environment variables in the hosting provider and use an accessible MongoDB Atlas connection string. This project includes basic input validation and password hashing but should receive a production security review before handling sensitive customer data.
