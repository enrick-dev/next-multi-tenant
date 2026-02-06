import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
} from "lucide-react";

const transactions = [
  {
    id: "TXN-001",
    to: "Stripe Inc.",
    amount: "-$2,450.00",
    status: "completed",
    date: "Jan 31, 2026",
  },
  {
    id: "TXN-002",
    to: "AWS Services",
    amount: "-$1,200.00",
    status: "completed",
    date: "Jan 30, 2026",
  },
  {
    id: "TXN-003",
    to: "Client Payment",
    amount: "+$8,500.00",
    status: "completed",
    date: "Jan 29, 2026",
  },
  {
    id: "TXN-004",
    to: "Vercel Pro",
    amount: "-$20.00",
    status: "pending",
    date: "Jan 29, 2026",
  },
  {
    id: "TXN-005",
    to: "Invoice #1042",
    amount: "+$3,200.00",
    status: "pending",
    date: "Jan 28, 2026",
  },
];

export function FintechDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-primary" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,840.00</div>
            <p className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-primary" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,670.00</div>
            <p className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
              -4.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Savings Goal</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        {/* Portfolio Allocation */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
            <CardDescription>Your investment distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Stocks", pct: 45, color: "bg-primary" },
              { name: "Bonds", pct: 25, color: "bg-secondary" },
              { name: "Real Estate", pct: 20, color: "bg-muted-foreground" },
              { name: "Cash", pct: 10, color: "bg-accent-foreground" },
            ].map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <ArrowUpRight className="mr-2 h-4 w-4 text-primary" />
              Send Money
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ArrowDownRight className="mr-2 h-4 w-4 text-primary" />
              Request Payment
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CreditCard className="mr-2 h-4 w-4 text-primary" />
              Pay Bills
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <PiggyBank className="mr-2 h-4 w-4 text-primary" />
              Set Savings Goal
            </Button>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["AB", "CD", "EF"].map((i) => (
                  <Avatar
                    key={i}
                    className="h-7 w-7 border-2 border-background"
                  >
                    <AvatarFallback className="text-[10px]">{i}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                3 beneficiaries
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{tx.to}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tx.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${tx.amount.startsWith("+") ? "text-primary" : ""}`}
                  >
                    {tx.amount}
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
