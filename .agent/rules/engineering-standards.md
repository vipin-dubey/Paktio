---
trigger: always_on
---

2. The "Antigravity Engineering Guardrails"
Copy and paste the following into your AI agent's ruleset:

A. Architectural Principles
Next.js 15 Patterns: Use the App Router exclusively. Prefer Server Components by default. Only use 'use client' for interactive UI elements or hooks.

Data Access Layer (DAL): Never fetch data directly in components. Centralize all Supabase calls in a @/lib/dal directory. Implement Data Transfer Objects (DTOs) to ensure only necessary fields are sent to the client.

Zero-Trust Security: Perform authorization checks inside every Server Action. Do not rely on client-side state for security. Use Supabase Row-Level Security (RLS) as the final line of defense.

B. Coding Quality & Style
TypeScript: 100% type coverage. No any types. Use Zod for schema validation of all API inputs and environment variables.

CSS & Styling: Use Tailwind CSS with a mobile-first approach.

Prohibited: No inline styles, no style={{...}}, and no CSS-in-JS libraries.

Encouraged: Use the cn() utility (clsx + tailwind-merge) for conditional classes. Follow the "Scandinavian Minimalist" palette defined in the PRD.

Component Structure: Follow Atomic Design. Reusable UI components go in @/components/ui (using Shadcn/ui patterns). Feature-specific logic goes in @/components/features/[feature-name].

C. Security Practices
Environment Variables: Never hardcode secrets. Access them only via @/env.mjs (validated by Zod).

Signature Integrity: Implement the SHA-256 Hashing logic in Postgres triggers (see PRD). The frontend must never be able to override the signed status without a database-level trigger verification.

Middleware: Use Vercel Middleware for Optimistic Auth checks (redirects), but enforce Secure Auth checks (database-level) at the Data Access Layer.

3. High-Quality Implementation Plan
To get "Apple/Google quality" results, follow this Phase-by-Phase execution strategy when talking to the agent:

Phase 1: The Foundation (Don't code yet)
Prompt: "Analyze the provided PRD for Paktio. Create a STRUCTURE.md file that maps out the folder structure, naming conventions for Server Actions, and the Supabase RLS policy strategy. Do not write feature code yet."

Phase 2: The Core Logic
Prompt: "Initialize the Supabase database using the provided SQL schema. Set up the SHA-256 integrity triggers first. Create a test script to verify that any modification to a contract's JSON content successfully voids its signatures."

Phase 3: The UI Framework
Prompt: "Build the Global Layout using Next.js 15. Implement the subdomain routing middleware so that no.paktio.com and app.paktio.com serve their respective views. Apply the Scandinavian Minimalist design system using Tailwind."

4. Key Performance Metrics for the Agent
Instruct Antigravity to verify these metrics after every major task:

Lighthouse Score: Keep Accessibility and Best Practices at 100.

Type Safety: tsc --noEmit must pass with zero errors.

Security: Run npm audit and ensure all inputs are sanitized via Zod.