import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function DemoShowcase() {
  return (
    <div className="space-y-10">
      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <Separator />

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Cards</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>Overview of your metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">2,847</div>
              <p className="text-sm text-muted-foreground">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>Manage your team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex -space-x-2">
                {["JD", "AK", "MC", "RL"].map((initials) => (
                  <Avatar
                    key={initials}
                    className="h-8 w-8 border-2 border-background"
                  >
                    <AvatarFallback className="text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>You have 3 unread messages</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Badge>New</Badge>
              <Badge variant="secondary">Update</Badge>
              <Badge variant="outline">Info</Badge>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                View all
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Inputs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Form Elements</h2>
        <div className="grid max-w-md gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" placeholder="Enter your password" />
          </div>
          <Button className="w-full">Sign In</Button>
        </div>
      </section>

      <Separator />

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      <Separator />

      {/* Colors */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Color Palette</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {[
            {
              name: "Primary",
              bg: "bg-primary",
              fg: "text-primary-foreground",
            },
            {
              name: "Secondary",
              bg: "bg-secondary",
              fg: "text-secondary-foreground",
            },
            { name: "Muted", bg: "bg-muted", fg: "text-muted-foreground" },
            { name: "Accent", bg: "bg-accent", fg: "text-accent-foreground" },
            {
              name: "Destructive",
              bg: "bg-destructive",
              fg: "text-destructive-foreground",
            },
            { name: "Card", bg: "bg-card", fg: "text-card-foreground" },
          ].map((color) => (
            <div key={color.name} className="space-y-1.5">
              <div
                className={`${color.bg} ${color.fg} flex h-16 items-center justify-center rounded-lg border border-border text-xs font-medium`}
              >
                {color.name}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
