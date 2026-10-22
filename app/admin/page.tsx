// Admin dashboard — Stage 1 placeholder with static mock data only.
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockAdminStats, mockCourses } from "@/lib/mock-data";

export default function AdminPage() {
  const stats = [
    { label: "Students", value: mockAdminStats.students },
    { label: "Active courses", value: mockAdminStats.activeCourses },
    { label: "Archived courses", value: mockAdminStats.archivedCourses },
    { label: "Submissions (24h)", value: mockAdminStats.scenarioSubmissions },
  ];

  return (
    <AppShell>
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div>
          <h1 className="font-mono text-xl font-semibold">Admin</h1>
          <p className="text-sm text-muted-foreground">
            Manage courses: create them, archive first, delete permanently later.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} size="sm">
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="font-mono text-2xl">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Courses table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Courses</CardTitle>
            <CardDescription>
              Archive keeps a course out of listings without losing progress.
            </CardDescription>
            <CardAction>
              <Button size="sm" disabled>
                + New course
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {mockCourses.map((course, i) => (
              <div key={course.id}>
                {i > 0 ? <Separator className="my-2" /> : null}
                <div className="flex items-center justify-between py-2">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 font-mono text-sm">
                      {course.title}
                      <Badge variant="outline">{course.language}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {course.lessons.length} lessons
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {course.status === "ACTIVE" ? (
                      <Badge>active</Badge>
                    ) : course.status === "ARCHIVED" ? (
                      <Badge variant="secondary">archived</Badge>
                    ) : (
                      <Badge variant="destructive">deleted</Badge>
                    )}
                    <Button size="sm" variant="outline">
                      Archive
                    </Button>
                    <Button size="sm" variant="destructive" disabled>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
