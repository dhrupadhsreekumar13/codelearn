# CodeLearn — Folder Structure

CodeLearn teaches programming through **case-based scenarios** (realistic mini-situations
randomized per account), not Q&A quizzes. This file explains the folder layout so any
agent or developer lands consistently.

```
codelearn/
├── app/                  # Next.js App Router: routes/pages only
│   ├── page.tsx          # student dashboard (placeholder, Stage 1)
│   ├── admin/page.tsx    # admin dashboard (placeholder, Stage 1)
│   └── courses/[courseId]/page.tsx  # course page (placeholder, Stage 1)
├── components/
│   ├── layout/           # app shell: sidebar, top bar, base layout
│   └── ui/               # shadcn/ui primitives (button, card, badge, separator)
├── lib/
│   ├── utils.ts          # cn() helper from shadcn
│   └── mock-data.ts      # static mock data for Stage 1 placeholder pages
├── prisma/
│   ├── schema.prisma     # data model (User, Course, Lesson, Asset, Scenario*)
│   └── seed.ts           # seed: 1 admin, 2 students, 1 course, 2 lessons, 1 template
├── docs/                 # project documentation (STRUCTURE.md, data model docs)
└── public/               # static files
```

## Rules

- `app/` holds routing and pages only; business logic belongs in `lib/` (typed, pure).
- UI primitives live in `components/ui/` via shadcn; app-specific composed components
  go in `components/layout/` (and later `components/feature-specific` folders).
- Never change `prisma/schema.prisma` without updating the docs in this folder.
- Reuse existing dependencies before adding new ones; note the reason when adding any.
