// Student dashboard — Stage 1 placeholder with static mock data only.
import type { CSSProperties } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockCourses } from "@/lib/mock-data";

export default function DashboardPage() {
  const enrolled = mockCourses.filter((c) => c.status !== "DELETED");

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="rise-in">
          <h1 className="font-mono text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Your courses and next case-based scenario.
          </p>
        </div>

        <div className="grid gap-4">
          {enrolled.map((course, i) => (
            <div
              key={course.id}
              style={{ animationDelay: `${i * 110}ms` }}
              className="rise-in"
            >
            <Card 
              className="transition-all duration-300 hover:-translate-y-0.5 hover:ring-primary/30"
            >
              <CardHeader>
                <CardTitle className="font-mono">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
                <CardAction className="flex items-center gap-2">
                  {/* Live dot marks the course active: ping + soft glow pulse */}
                  {course.status === "ACTIVE" ? (
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
                      <span className="dot-live relative inline-flex size-2 rounded-full bg-primary" />
                    </span>
                  ) : null}
                  <Badge variant="outline">{course.language}</Badge>
                  {course.status === "ARCHIVED" ? (
                    <Badge variant="secondary">archived</Badge>
                  ) : null}
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {course.lessons.filter((l) => l.isCompleted).length}/
                    {course.lessons.length} lessons
                  </span>
                  <span>{course.progressPercent}%</span>
                </div>
                {/* Progress bar — plain divs, no chart lib needed for Stage 1.
                    .bar-fill animates width from 0 to --bar-width. */}
                <div
                  role="progressbar"
                  aria-valuenow={course.progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="bar-fill h-full rounded-full bg-primary transition-colors group-hover/card:bg-primary"
                    style={{ "--bar-width": `${course.progressPercent}%` } as CSSProperties}
                  />
                </div>
                <div className="mt-2 flex justify-end">
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="transition-transform duration-200 hover:scale-105 active:scale-95"
                  >
                    <Link href={`/courses/${course.id}`}>
                      {course.progressPercent === 0 ? "Start" : "Continue"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
