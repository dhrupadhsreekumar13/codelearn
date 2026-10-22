// Seed script for Stage 1. Run with: npx prisma db seed
// Idempotent: uses fixed IDs and upserts, safe to run multiple times.

import { PrismaClient, Difficulty } from "@prisma/client";

const prisma = new PrismaClient();

// Fixed IDs so repeated runs update instead of duplicate.
const IDs = {
  admin: "user_admin",
  student1: "user_alice",
  student2: "user_bob",
  course: "course_python_basics",
  lesson1: "lesson_variables",
  lesson2: "lesson_conditionals",
  template1: "template_sticky_counter",
};

async function main() {
  // ----- Users: 1 admin, 2 students -----
  await prisma.user.upsert({
    where: { email: "admin@codelearn.dev" },
    update: {},
    create: {
      id: IDs.admin,
      email: "admin@codelearn.dev",
      name: "Admin",
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "alice@codelearn.dev" },
    update: {},
    create: {
      id: IDs.student1,
      email: "alice@codelearn.dev",
      name: "Alice",
      role: "STUDENT",
    },
  });

  await prisma.user.upsert({
    where: { email: "bob@codelearn.dev" },
    update: {},
    create: {
      id: IDs.student2,
      email: "bob@codelearn.dev",
      name: "Bob",
      role: "STUDENT",
    },
  });

  // ----- Course: 1 sample course -----
  const course = await prisma.course.upsert({
    where: { id: IDs.course },
    update: {},
    create: {
      id: IDs.course,
      title: "Python Basics",
      description:
        "Learn Python fundamentals through realistic bug-fixing scenarios.",
      language: "python",
      status: "ACTIVE",
    },
  });

  // ----- Lessons: 2 lessons with assets -----
  const lesson1 = await prisma.lesson.upsert({
    where: { courseId_orderIndex: { courseId: course.id, orderIndex: 0 } },
    update: {},
    create: {
      id: IDs.lesson1,
      courseId: course.id,
      orderIndex: 0,
      title: "Variables & Types",
      assets: {
        create: [
          {
            type: "PDF",
            name: "lesson-1-chapter.pdf",
            storageKey: "codelearn/lessons/lesson-1/lesson-1-chapter.pdf",
            size: 489_312,
          },
          {
            type: "EXAMPLE_ZIP",
            name: "lesson-1-example.zip",
            storageKey: "codelearn/lessons/lesson-1/lesson-1-example.zip",
            size: 21_044,
          },
        ],
      },
    },
  });

  const lesson2 = await prisma.lesson.upsert({
    where: { courseId_orderIndex: { courseId: course.id, orderIndex: 1 } },
    update: {},
    create: {
      id: IDs.lesson2,
      courseId: course.id,
      orderIndex: 1,
      title: "Conditionals",
      assets: {
        create: [
          {
            type: "PDF",
            name: "lesson-2-chapter.pdf",
            storageKey: "codelearn/lessons/lesson-2/lesson-2-chapter.pdf",
            size: 512_780,
          },
          {
            type: "EXAMPLE_ZIP",
            name: "lesson-2-example.zip",
            storageKey: "codelearn/lessons/lesson-2/lesson-2-example.zip",
            size: 24_912,
          },
        ],
      },
    },
  });

  // ----- Scenario template: 1 template on lesson 2 -----
  await prisma.scenarioTemplate.upsert({
    where: { id: IDs.template1 },
    update: {},
    create: {
      id: IDs.template1,
      lessonId: lesson2.id,
      title: "The Broken Discount Counter",
      difficulty: Difficulty.EASY,
      storyTemplate: [
        "You are a {{juniorRole}} at a {{domain}} platform.",
        "A checkout bug: when a customer applies a discount code twice, the counter",
        "decrements on {{wrongCondition}} instead of {{rightCondition}}.",
        "Stock levels {{dataHint}} the mismatch overnight.",
        "Fix {{functionName}} so the checkout flow passes the hidden tests.",
      ].join(" "),
      variableSlots: {
        juniorRole: ["backend intern", "on-call engineer"],
        domain: ["e-commerce", "digital library", "grocery delivery"],
        wrongCondition: ["an invalid input check", "the quantity == 0 branch"],
        rightCondition: ["a duplicate-application check", "the stock check"],
        dataHint: ["drift from", "stay silent about", "later shadow"],
        functionName: ["apply_discount", "apply_discount_code"],
      } as const,
      testSpec: {
        kind: "stdlib-stdout", // how the later stage runs the student's code
        files: ["main.py"],
        cases: [
          {
            name: "single application",
            input: { qty: 2, code: "SAVE5" },
            expectSubstring: "total_deduction=1",
          },
          {
            name: "duplicate application is ignored",
            input: { qty: 2, code: "SAVE5", duplicate: true },
            expectSubstring: "total_deduction=1",
          },
        ],
      } as const,
    },
  });

  // ----- Enrollments: both students in the sample course -----
  const enrollment1 = await prisma.enrollment.upsert({
    where: {
      userId_courseId: { userId: IDs.student1, courseId: course.id },
    },
    update: {},
    create: { userId: IDs.student1, courseId: course.id },
  });

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: { userId: IDs.student2, courseId: course.id },
    },
    update: {},
    create: { userId: IDs.student2, courseId: course.id },
  });

  // Alice completed lesson 1.
  await prisma.lessonProgress.upsert({
    where: {
      enrollmentId_lessonId: { enrollmentId: enrollment1.id, lessonId: lesson1.id },
    },
    update: {},
    create: {
      enrollmentId: enrollment1.id,
      lessonId: lesson1.id,
      isCompleted: true,
      completedAt: new Date(),
    },
  });

  console.log("Seed complete:");
  console.log(`  admin:    ${IDs.admin} (admin@codelearn.dev)`);
  console.log(`  students: ${IDs.student1}, ${IDs.student2} (alice, bob)`);
  console.log(`  course:   ${course.title} (${course.id})`);
  console.log(`  lessons:  ${lesson1.title}, ${lesson2.title}`);
  console.log(`  template: ${IDs.template1}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
