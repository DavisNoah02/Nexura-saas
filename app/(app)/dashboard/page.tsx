import Link from "next/link";
import { Activity, ArrowRight, Users, Zap } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Active projects", value: "12", icon: Zap },
  { label: "Team members", value: "8", icon: Users },
  { label: "This week", value: "24h", icon: Activity },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Welcome back. Here&apos;s an overview of your workspace.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent activity placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>
            Latest updates across your projects. Connect to your data source in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              features/projects/server
            </code>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-12">
            <p className="text-sm">No activity yet</p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                Back to marketing
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

