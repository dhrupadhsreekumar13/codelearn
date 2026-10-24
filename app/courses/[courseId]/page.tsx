// Course page — Stage 1 placeholder with static mock data only.
import { notFound } from "next/navigation";
import { FileText, FileArchive } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockCourses } from "@/lib/mock-data";

// Mock course ids are known at build time, so params are static.
export function generateStaticParams() {
  return mockCourses.map((course) => ({ courseId: course.id }));
}

// This Stage 1 page reads `params` directly with static mock data, so there is
// nothing meaningful to stream; allow the route to block instead of validating
// an instant shell (Next 16 Cache Components validation).
export const instant = false;

export default async function CoursePage({
  params,
}: PageProps<"/courses/[courseId]">) {
  const { courseId } = await params;
  const course = mockCourses.find((c) => c.id === courseId);

  // Unknown id -> 404, same behavior the real read will have later.
  if (!course) {
    notFound();
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="rise-in">
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-xl font-semibold">{course.title}</h1>
            <Badge variant="outline">{course.language}</Badge>
            {course.status === "ARCHIVED" ? (
              <Badge variant="secondary">archived</Badge>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">{course.description}</p>
        </div>

        <div className="flex flex-col">
          {course.lessons.map((lesson, i) => (
            <div
              key={lesson.id}
              className="rise-in"
              style={{ animationDelay: `${i * 110}ms` }}
            >
              {i > 0 ? <Separator className="my-2" /> : null}
              <div className="flex flex-col gap-1 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="text-muted-foreground">
                      {String(lesson.orderIndex + 1).padStart(2, "0")}
                    </span>
                    <span>{lesson.title}</span>
                    {lesson.isCompleted ? (
                      <Badge>done</Badge>
                    ) : (
                      <Badge variant="secondary">todo</Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={!lesson.scenario}
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Open scenario
                  </Button>
                </div>
                {lesson.scenario ? (
                  <p className="pl-7 text-xs text-muted-foreground">
                    Scenario: {lesson.scenario.title} ·{" "}
                    {lesson.scenario.difficulty.toLowerCase()} ·{" "}
                    {lesson.scenario.variableSlots.length} variable slots
                  </p>
                ) : null}
                <div className="flex gap-3 pl-7 text-xs text-muted-foreground">
                  {lesson.assets.map((asset) =>
                    asset.type === "PDF" ? (
                      <span
                        key={asset.name}
                        className="flex items-center gap-1 transition-colors duration-200 hover:text-foreground"
                      >
                        <FileText className="size-3" />
                        {asset.name} ({asset.sizeMb.toFixed(1)} MB)
                      </span>
                    ) : (
                      <span
                        key={asset.name}
                        className="flex items-center gap-1 transition-colors duration-200 hover:text-foreground"
                      >
                        <FileArchive className="size-3" />
                        {asset.name} ({asset.sizeMb.toFixed(1)} MB)
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
          {course.lessons.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No lessons</CardTitle>
                <CardDescription>
                  This archived course has no lessons attached.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
