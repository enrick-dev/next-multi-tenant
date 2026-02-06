import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  CalendarDays,
  Activity,
  Heart,
  Search,
  Phone,
  Mail,
  Clock,
  FileText,
} from "lucide-react";

const patients = [
  {
    name: "Maria Silva",
    age: 34,
    condition: "Routine checkup",
    next: "Feb 3",
    status: "scheduled",
    avatar: "MS",
  },
  {
    name: "João Santos",
    age: 58,
    condition: "Cardiology follow-up",
    next: "Feb 5",
    status: "confirmed",
    avatar: "JS",
  },
  {
    name: "Ana Oliveira",
    age: 27,
    condition: "Dermatology consult",
    next: "Feb 5",
    status: "scheduled",
    avatar: "AO",
  },
  {
    name: "Pedro Costa",
    age: 45,
    condition: "Lab results review",
    next: "Feb 6",
    status: "pending",
    avatar: "PC",
  },
  {
    name: "Lucia Ferreira",
    age: 62,
    condition: "Diabetes management",
    next: "Feb 7",
    status: "confirmed",
    avatar: "LF",
  },
];

const todayAppointments = [
  {
    time: "09:00",
    patient: "Carlos Mendes",
    type: "Initial Consultation",
    duration: "45min",
  },
  {
    time: "10:00",
    patient: "Beatriz Lima",
    type: "Follow-up",
    duration: "20min",
  },
  {
    time: "11:00",
    patient: "Rafael Alves",
    type: "Lab Review",
    duration: "15min",
  },
  {
    time: "14:00",
    patient: "Fernanda Rocha",
    type: "Telemedicine",
    duration: "30min",
  },
];

export function HealthCRM() {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients, appointments, records..."
            className="pl-10"
          />
        </div>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          New Patient
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">+42 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Appointments
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 min</div>
            <p className="text-xs text-primary">-3 min from avg</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Today&apos;s Schedule
            </CardTitle>
            <CardDescription>January 31, 2026</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayAppointments.map((apt) => (
              <div
                key={apt.time}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <div className="text-center">
                  <Clock className="mx-auto mb-0.5 h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold">{apt.time}</span>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{apt.patient}</p>
                  <p className="text-xs text-muted-foreground">{apt.type}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {apt.duration}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Patient Quick View */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Patient Quick View</CardTitle>
            <CardDescription>Selected patient details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">MS</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">Maria Silva</h3>
                  <p className="text-sm text-muted-foreground">
                    Female, 34 years • Patient since 2023
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">No allergies</Badge>
                  <Badge variant="outline">Blood: A+</Badge>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    +55 11 99999-0000
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    maria@email.com
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">
                    <FileText className="mr-1.5 h-3.5 w-3.5" />
                    Medical Record
                  </Button>
                  <Button size="sm" variant="outline">
                    <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Patients scheduled this week</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Next Visit</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((p) => (
                <TableRow key={p.name}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {p.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.age} years
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{p.condition}</TableCell>
                  <TableCell className="text-sm">{p.next}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.status === "confirmed"
                          ? "default"
                          : p.status === "scheduled"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
