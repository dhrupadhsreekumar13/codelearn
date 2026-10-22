// Static mock data for Stage 1 placeholder pages. These will be replaced by
// real Prisma reads in a later stage; they mirror the schema's shape so that
// swap is mechanical.

export type CourseStatus = "ACTIVE" | "ARCHIVED" | "DELETED";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface MockAsset {
  type: "PDF" | "EXAMPLE_ZIP";
  name: string;
  sizeMb: number;
}

export interface MockLesson {
  id: string;
  orderIndex: number;
  title: string;
  isCompleted: boolean;
  assets: MockAsset[];
  scenario?: {
    title: string;
    difficulty: Difficulty;
    variableSlots: string[]; // names of the story slots
  };
}

export interface MockCourse {
  id: string;
  title: string;
  language: string;
  description: string;
  status: CourseStatus;
  progressPercent: number;
  lessons: MockLesson[];
}

export const mockCourses: MockCourse[] = [
  {
    id: "python-basics",
    title: "Python Basics",
    language: "python",
    description: "Learn Python fundamentals through realistic bug-fixing scenarios.",
    status: "ACTIVE",
    progressPercent: 33,
    lessons: [
      {
        id: "lesson-1",
        orderIndex: 0,
        title: "Variables & Types",
        isCompleted: true,
        assets: [
          { type: "PDF", name: "lesson-1-chapter.pdf", sizeMb: 0.5 },
          { type: "EXAMPLE_ZIP", name: "lesson-1-example.zip", sizeMb: 0.02 },
        ],
      },
      {
        id: "lesson-2",
        orderIndex: 1,
        title: "Conditionals",
        isCompleted: false,
        assets: [
          { type: "PDF", name: "lesson-2-chapter.pdf", sizeMb: 0.5 },
          { type: "EXAMPLE_ZIP", name: "lesson-2-example.zip", sizeMb: 0.02 },
        ],
        scenario: {
          title: "The Broken Discount Counter",
          difficulty: "EASY",
          variableSlots: ["domain", "bugType", "constraints"],
        },
      },
    ],
  },
  {
    id: "js-intro",
    title: "JavaScript Intro",
    language: "javascript",
    description: "Arrays, objects and DOM basics via debugging mini-situations.",
    status: "ACTIVE",
    progressPercent: 0,
    lessons: [
      {
        id: "js-lesson-1",
        orderIndex: 0,
        title: "Arrays & Loops",
        isCompleted: false,
        assets: [{ type: "PDF", name: "chapter.pdf", sizeMb: 0.4 }],
        scenario: {
          title: "The Duplicated Cart Item",
          difficulty: "MEDIUM",
          variableSlots: ["cartData", "bugType"],
        },
      },
    ],
  },
  {
    id: "old-html-101",
    title: "HTML 101 (legacy)",
    language: "html",
    description: "Retired course kept ARCHIVED so student progress is preserved.",
    status: "ARCHIVED",
    progressPercent: 100,
    lessons: [],
  },
];

export const mockAdminStats = {
  students: 128,
  activeCourses: 2,
  archivedCourses: 1,
  scenarioSubmissions: 37, // last 24h
} as const;
