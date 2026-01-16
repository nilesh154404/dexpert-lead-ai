import { useState } from "react";
import { UserPlus, Mail, Shield, MoreHorizontal, Search, Building2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "sales" | "support";
  department: string;
  status: "active" | "invited" | "inactive";
  leadsAssigned: number;
  lastActive: string;
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "admin",
    department: "Sales",
    status: "active",
    leadsAssigned: 45,
    lastActive: "2 min ago",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "manager",
    department: "Sales",
    status: "active",
    leadsAssigned: 32,
    lastActive: "1 hour ago",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.j@company.com",
    role: "sales",
    department: "Sales",
    status: "active",
    leadsAssigned: 28,
    lastActive: "30 min ago",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.w@company.com",
    role: "support",
    department: "Support",
    status: "active",
    leadsAssigned: 15,
    lastActive: "5 min ago",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.b@company.com",
    role: "sales",
    department: "Sales",
    status: "invited",
    leadsAssigned: 0,
    lastActive: "Never",
  },
];

const roleColors = {
  admin: "bg-violet-100 text-violet-700",
  manager: "bg-blue-100 text-blue-700",
  sales: "bg-emerald-100 text-emerald-700",
  support: "bg-amber-100 text-amber-700",
};

const statusColors = {
  active: "success",
  invited: "warning",
  inactive: "secondary",
} as const;

export default function Team() {
  return (
    <AppLayout title="Team Management" subtitle="Manage staff users and access">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="support">Support</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ai">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Members</p>
          <p className="text-2xl font-semibold mt-1">5</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active Now</p>
          <p className="text-2xl font-semibold mt-1 text-emerald-600">4</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Pending Invites</p>
          <p className="text-2xl font-semibold mt-1 text-amber-600">1</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Avg Leads/Member</p>
          <p className="text-2xl font-semibold mt-1">24</p>
        </div>
      </div>

      {/* Team Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Leads Assigned</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={roleColors[member.role]}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    {member.department}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{member.leadsAssigned}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={statusColors[member.status]}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {member.lastActive}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                      <DropdownMenuItem>Reassign Leads</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Remove Access
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
