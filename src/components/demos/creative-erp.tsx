import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  FolderKanban,
  Timer,
  BarChart3,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
} from "lucide-react";

const projects = [
  { name: "Brand Redesign — Acme Corp", progress: 78, status: "on-track", tasks: "18/23", due: "Feb 15", team: ["RM", "AL", "JP"] },
  { name: "Mobile App UI — HealthCo", progress: 45, status: "at-risk", tasks: "9/20", due: "Mar 1", team: ["SK", "RM"] },
  { name: "Marketing Site — Nova", progress: 92, status: "on-track", tasks: "11/12", due: "Feb 5", team: ["AL", "TN", "JP", "SK"] },
  { name: "Dashboard Widgets — SaaS Inc", progress: 15, status: "new", tasks: "2/14", due: "Mar 20", team: ["TN"] },
];

const kanbanColumns = [
  {
    title: "To Do",
    icon: Circle,
    count: 5,
    tasks: [
      { title: "Design system tokens audit", priority: "high", assignee: "RM" },
      { title: "Iconography pack v2", priority: "medium", assignee: "AL" },
    ],
  },
  {
    title: "In Progress",
    icon: Clock,
    count: 3,
    tasks: [
      { title: "Landing page hero section", priority: "high", assignee: "JP" },
      { title: "Email template set", priority: "low", assignee: "SK" },
    ],
  },
  {
    title: "Review",
    icon: AlertCircle,
    count: 2,
    tasks: [
      { title: "Client presentation deck", priority: "medium", assignee: "TN" },
    ],
  },
  {
    title: "Done",
    icon: CheckCircle2,
    count: 12,
    tasks: [
      { title: "Logo variations export", priority: "low", assignee: "RM" },
    ],
  },
];

const timeEntries = [
  { project: "Brand Redesign", task: "Color palette exploration", hours: "3.5h", person: "RM" },
  { project: "Mobile App UI", task: "Wireframe iteration", hours: "2.0h", person: "SK" },
  { project: "Marketing Site", task: "Responsive testing", hours: "1.5h", person: "AL" },
  { project: "Brand Redesign", task: "Typography pairing", hours: "2.0h", person: "JP" },
];

function priorityColor(p: string) {
  if (p === "high") return "destructive";
  if (p === "medium") return "default";
  return "secondary";
}

export function CreativeERP() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">2 on track, 1 at risk, 1 new</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22</div>
            <p className="text-xs text-muted-foreground">5 due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hours This Week</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34.5h</div>
            <Progress value={86} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue (MTD)</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$18,420</div>
            <p className="text-xs text-primary">72% of monthly target</p>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Task Board</CardTitle>
              <CardDescription>Brand Redesign — Acme Corp</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {kanbanColumns.map((col) => (
              <div key={col.title} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <col.icon className="h-4 w-4 text-muted-foreground" />
                    {col.title}
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{col.count}</Badge>
                </div>
                <div className="space-y-2">
                  {col.tasks.map((task) => (
                    <div
                      key={task.title}
                      className="rounded-lg border border-border bg-card p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium leading-snug">{task.title}</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={priorityColor(task.priority)} className="text-[10px]">
                          {task.priority}
                        </Badge>
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[9px]">{task.assignee}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Projects List */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Projects Overview</CardTitle>
            <CardDescription>All active client projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((p) => (
              <div key={p.name} className="space-y-2 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Due {p.due} • {p.tasks} tasks</p>
                  </div>
                  <Badge variant={p.status === "at-risk" ? "destructive" : p.status === "new" ? "outline" : "default"}>
                    {p.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={p.progress} className="flex-1" />
                  <span className="text-xs font-medium">{p.progress}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    {p.team.map((m) => (
                      <Avatar key={m} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-[9px]">{m}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Time Tracking */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Time Tracking
                </CardTitle>
                <CardDescription>Today&apos;s log</CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="mr-1 h-3 w-3" />
                Log
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {timeEntries.map((entry, i) => (
              <div key={i} className="flex items-center gap-3">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="text-[9px]">{entry.person}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{entry.task}</p>
                  <p className="text-xs text-muted-foreground">{entry.project}</p>
                </div>
                <Badge variant="secondary" className="shrink-0 text-xs">{entry.hours}</Badge>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total today</span>
              <span className="font-semibold">9.0h</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Active timer</span>
                <Input
                  placeholder="What are you working on?"
                  className="ml-3 h-7 text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
