// Student dashboard — Stage 1 placeholder with static mock data only.
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
        <div>
          <h1 className="font-mono text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Your courses and next case-based scenario.
          </p>
        </div>

        <div className="grid gap-4">
          {enrolled.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle className="font-mono">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
                <CardAction className="flex items-center gap-2">
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
                {/* Progress bar — plain divs, no chart lib needed for Stage 1 */}
                <div
                  role="progressbar"
                  aria-valuenow={course.progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-end">
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/courses/${course.id}`}>
                      {course.progressPercent === 0 ? "Start" : "Continue"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
