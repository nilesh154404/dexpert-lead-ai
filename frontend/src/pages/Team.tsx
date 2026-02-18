// import { useEffect, useState } from "react";
// import { UserPlus, Mail, Shield, MoreHorizontal, Search, Building2 } from "lucide-react";
// import { AppLayout } from "@/components/layout/AppLayout";
// import { useAuth } from "@/contexts/AuthContext";
// import { usersApi, User } from "@/lib/api/users.api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface TeamMember {
//   id: string;
//   name: string;
//   email: string;
//   role: "admin" | "manager" | "sales" | "support";
//   department: string;
//   status: "active" | "invited" | "inactive";
//   leadsAssigned: number;
//   lastActive: string;
// }

// // Remove static teamMembers, use API

// const roleColors = {
//   admin: "bg-violet-100 text-violet-700",
//   manager: "bg-blue-100 text-blue-700",
//   sales: "bg-emerald-100 text-emerald-700",
//   support: "bg-amber-100 text-amber-700",
// };

// const statusColors = {
//   active: "success",
//   invited: "warning",
//   inactive: "secondary",
// } as const;

// export default function Team() {
//   const { user } = useAuth();
//   const [teamMembers, setTeamMembers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!user) return;
//     usersApi.getAll().then((allUsers) => {
//       // Filter users by current tenant
//       const filtered = allUsers.filter(u => u.tenantId === user.tenantId);
//       setTeamMembers(filtered);
//       setLoading(false);
//     });
//   }, [user]);

//   // Calculate stats
//   const totalMembers = teamMembers.length;
//   const activeNow = teamMembers.filter(u => u.status === "active").length;
//   const pendingInvites = teamMembers.filter(u => u.status === "invited").length;
//   const avgLeads = Math.round(
//     teamMembers.reduce((sum, u) => sum + (u.assignedLeads ? u.assignedLeads.length : 0), 0) /
//       (totalMembers || 1)
//   );

//   return (
//     <AppLayout title="Team Management" subtitle="Manage staff users and access">
//       {/* Header Actions */}
//       <div className="flex flex-col sm:flex-row gap-4 mb-6">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search team members..."
//             className="pl-9"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <Select defaultValue="all">
//             <SelectTrigger className="w-[140px]">
//               <SelectValue placeholder="Role" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Roles</SelectItem>
//               <SelectItem value="admin">Admin</SelectItem>
//               <SelectItem value="manager">Manager</SelectItem>
//               <SelectItem value="sales">Sales</SelectItem>
//               <SelectItem value="support">Support</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button variant="ai">
//             <UserPlus className="h-4 w-4 mr-2" />
//             Invite Member
//           </Button>
//         </div>
//       </div>

//       {/* Team Stats */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
//         <div className="rounded-xl border bg-card p-4">
//           <p className="text-sm text-muted-foreground">Total Members</p>
//           <p className="text-2xl font-semibold mt-1">{totalMembers}</p>
//         </div>
//         <div className="rounded-xl border bg-card p-4">
//           <p className="text-sm text-muted-foreground">Active Now</p>
//           <p className="text-2xl font-semibold mt-1 text-emerald-600">{activeNow}</p>
//         </div>
//         <div className="rounded-xl border bg-card p-4">
//           <p className="text-sm text-muted-foreground">Pending Invites</p>
//           <p className="text-2xl font-semibold mt-1 text-amber-600">{pendingInvites}</p>
//         </div>
//         <div className="rounded-xl border bg-card p-4">
//           <p className="text-sm text-muted-foreground">Avg Leads/Member</p>
//           <p className="text-2xl font-semibold mt-1">{avgLeads}</p>
//         </div>
//       </div>

//       {/* Team Table */}
//       <div className="rounded-xl border bg-card overflow-hidden">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-secondary/50">
//               <TableHead>Member</TableHead>
//               <TableHead>Role</TableHead>
//               <TableHead>Department</TableHead>
//               <TableHead>Leads Assigned</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Last Active</TableHead>
//               <TableHead className="w-[50px]"></TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center">Loading...</TableCell>
//               </TableRow>
//             ) : teamMembers.map((member) => (
//               <TableRow key={member.id}>
//                 <TableCell>
//                   <div className="flex items-center gap-3">
//                     <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
//                       {member.name.split(" ").map(n => n[0]).join("")}
//                     </div>
//                     <div>
//                       <p className="font-medium">{member.name}</p>
//                       <p className="text-sm text-muted-foreground">{member.email}</p>
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <Badge className={roleColors[member.role]}>
//                     {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <span className="flex items-center gap-1 text-sm text-muted-foreground">
//                     <Building2 className="h-3 w-3" />
//                     {member.department}
//                   </span>
//                 </TableCell>
//                 <TableCell>
//                   <span className="font-medium">{member.assignedLeads ? member.assignedLeads.length : 0}</span>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant={statusColors[member.status]}>
//                     {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-muted-foreground text-sm">
//                   {member.lastActiveAt ? member.lastActiveAt : "-"}
//                 </TableCell>
//                 <TableCell>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon-sm">
//                         <MoreHorizontal className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem>View Profile</DropdownMenuItem>
//                       <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
//                       <DropdownMenuItem>Reassign Leads</DropdownMenuItem>
//                       <DropdownMenuItem className="text-destructive">
//                         Remove Access
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </AppLayout>
//   );
// }


import { useEffect, useState } from "react";
import {
  UserPlus,
  MoreHorizontal,
  Search,
  Building2,
} from "lucide-react";

import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { usersApi, User } from "@/lib/api/users.api";

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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const roleColors: Record<string, string> = {
  admin: "bg-violet-100 text-violet-700",
  manager: "bg-blue-100 text-blue-700",
  sales: "bg-emerald-100 text-emerald-700",
  support: "bg-amber-100 text-amber-700",
};

const statusColors: Record<string, "success" | "warning" | "secondary"> = {
  active: "success",
  invited: "warning",
  inactive: "secondary",
};

export default function Team() {
  const { user } = useAuth();

  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteData, setInviteData] = useState({
    name: "",
    email: "",
    role: "sales",
    department: "",
  });

  const loadTeam = async () => {
    if (!user) return;
    setLoading(true);
    // const allUsers = await usersApi.getAll();
    // setTeamMembers(allUsers.filter(u => u.tenantId === user.tenantId));
    const allUsers = await usersApi.getAll();

if (user.role === 'super_admin') {
  setTeamMembers(allUsers); // 👈 see everyone
} else {
  setTeamMembers(allUsers.filter(u => u.tenantId === user.tenantId));
}

    setLoading(false);
  };

  useEffect(() => {
    loadTeam();
  }, [user]);

  const totalMembers = teamMembers.length;
  const activeNow = teamMembers.filter(u => u.status === "active").length;
  const pendingInvites = teamMembers.filter(u => u.status === "invited").length;
  const avgLeads = Math.round(
    teamMembers.reduce((s, u) => s + (u.assignedLeads?.length || 0), 0) /
      (totalMembers || 1)
  );

  return (
    <AppLayout title="Team Management" subtitle="Manage staff users and access">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search team members..." className="pl-9" />
        </div>

        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button variant="ai">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Full Name"
                value={inviteData.name}
                onChange={(e) =>
                  setInviteData({ ...inviteData, name: e.target.value })
                }
              />

              <Input
                placeholder="Email"
                type="email"
                value={inviteData.email}
                onChange={(e) =>
                  setInviteData({ ...inviteData, email: e.target.value })
                }
              />

              <Select
                value={inviteData.role}
                onValueChange={(value) =>
                  setInviteData({ ...inviteData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Department"
                value={inviteData.department}
                onChange={(e) =>
                  setInviteData({ ...inviteData, department: e.target.value })
                }
              />

              <Button
                className="w-full"
                onClick={async () => {
                  try {
                    await usersApi.create({
                      name: inviteData.name,
                      email: inviteData.email,
                      // Send role as lowercase to match backend enum
                      role: inviteData.role.toLowerCase(),
                      department: inviteData.department,
                    });
                    setInviteOpen(false);
                    setInviteData({
                      name: "",
                      email: "",
                      role: "sales",
                      department: "",
                    });
                    loadTeam();
                  } catch (err: any) {
                    alert(
                      err?.response?.data?.message ||
                        err?.message ||
                        "Failed to invite member. Please check the details and try again."
                    );
                  }
                }}
              >
                Send Invite
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Stat title="Total Members" value={totalMembers} />
        <Stat title="Active Now" value={activeNow} highlight />
        <Stat title="Pending Invites" value={pendingInvites} />
        <Stat title="Avg Leads / Member" value={avgLeads} />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Leads</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              teamMembers.map(member => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center font-medium">
                        {member.name[0]}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={roleColors[member.role]}>
                      {member.role}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      {member.department}
                    </span>
                  </TableCell>

                  <TableCell>
                    {member.assignedLeads?.length || 0}
                  </TableCell>

                  <TableCell>
                    <Badge variant={statusColors[member.status]}>
                      {member.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {member.lastActiveAt || "-"}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}

/* ---------- Small Stat Component ---------- */
function Stat({
  title,
  value,
  highlight,
}: {
  title: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p
        className={`text-2xl font-semibold mt-1 ${
          highlight ? "text-emerald-600" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
