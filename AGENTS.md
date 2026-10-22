<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## CodeLearn — Agent Rules

### What CodeLearn is

A platform that teaches programming through **case-based scenarios** (realistic
mini-situations), not Q&A quizzes. Scenarios are randomized per account from
templates with variable slots; a seed derived from `userId + templateId` makes the
same student always see the same version. Answers are judged by hidden test cases
that run the student's code. Admin-authored content (PDFs, zipped working examples)
is rendered by the app; students previewed material will be editable in a live
sandbox later.

### Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui (dark, calm, IDE-like theme; always-dark tokens in `app/globals.css`)
- PostgreSQL + Prisma (`prisma/schema.prisma`, seed via `npx prisma db seed`)
- Later stages: Monaco editor, S3-compatible storage, Auth.js, hidden-test runner

### Folder rules

- `app/` — routes/pages only, keep them thin
- `components/ui/` — shadcn primitives, do not hand-edit casually
- `components/layout/` — app shell (sidebar, top bar, base layout)
- `lib/` — typed pure logic and (for now) mock data
- `prisma/` — schema and seed script
- `docs/` — must stay in sync with the code (structure, data model)

### Naming conventions

- Files: `kebab-case.tsx` for components, pages follow Next.js conventions
- Prisma models: PascalCase singular; enums: SCREAMING_SNAKE values, PascalCase names
- Routes: lowercase, `/courses/[courseId]`
- Mock data lives in `lib/mock-data.ts` until replaced by real reads

### Data model summary

- `User` (role STUDENT | ADMIN)
- `Course` (status ACTIVE | ARCHIVED | DELETED; archive-before-delete so progress is never lost by accident)
- `Lesson` (in Course, orderIndex unique per course)
- `Asset` (metadata only: PDF | EXAMPLE_ZIP, storageKey, size, linked to Lesson)
- `ScenarioTemplate` (in Lesson; storyTemplate with {{slots}}, variableSlots JSON, hidden testSpec JSON, difficulty)
- `ScenarioInstance` (User x ScenarioTemplate, unique pair, seed Int, payload JSON)
- `Submission` (in ScenarioInstance, code, result JSON, passed)
- `Enrollment` (User x Course, unique pair) + `LessonProgress` (completion per lesson)

### Hard rules

- **Never change `prisma/schema.prisma` without updating the docs in `docs/`.**
- Do not add auth, file upload, or code execution in early stages.
- Do not install extra libraries without a written reason in the PR/message.
- Seed data must stay idempotent (upserts with fixed IDs).
