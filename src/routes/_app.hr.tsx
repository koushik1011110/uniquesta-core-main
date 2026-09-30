import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  Plus,
  Users,
  UserCheck,
  Briefcase,
  Loader2,
  Trash2,
  ShieldCheck,
  Building2,
  Key,
  Mail,
  Phone,
  Edit2,
  Lock,
  ChevronRight,
  GraduationCap,
  FileCheck,
  Wallet,
  Plane,
  Headphones,
  CheckCircle2,
  Crown,
  Search,
  Filter,
  UserPlus,
  MapPin,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { getUser, isStaffRole } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/hr")({
  head: () => ({
    meta: [
      { title: "Staff & Role Hierarchy · Uniquesta ERP" },
      { name: "description", content: "Branch Admin and Role-based staff management across Uniquesta branches." },
      { property: "og:title", content: "Staff & Role Hierarchy · Uniquesta ERP" },
      { property: "og:description", content: "Branch-wise Admin and Staff Management." },
    ],
  }),
  component: HRPage,
});

// ═══════════════════════════════════════════════════════════════
// 1. SYSTEM ACCESS ROLES (Permission Level)
// ═══════════════════════════════════════════════════════════════
export const SYSTEM_ROLES: Record<string, { label: string; badge: string; icon: any; desc: string }> = {
  super_admin: {
    label: "Super Admin",
    badge: "bg-red-50 text-[#E52E20] border-red-200",
    icon: ShieldCheck,
    desc: "Global headquarters control: Can add branches, branch admins, and staff across all branches.",
  },
  branch_admin: {
    label: "Branch Admin",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Crown,
    desc: "Branch executive head: Oversees branch operations and adds/manages staff for their branch.",
  },
  staff: {
    label: "Staff",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Users,
    desc: "Operational branch personnel reporting to their Branch Admin.",
  },
};

export function getSystemRoleInfo(roleStr?: string) {
  const r = (roleStr || "").toLowerCase();
  if (r === "super_admin" || r.includes("super admin")) return SYSTEM_ROLES.super_admin;
  if (r === "branch_admin" || r.includes("branch admin") || r.includes("head")) return SYSTEM_ROLES.branch_admin;
  return SYSTEM_ROLES.staff;
}

// ═══════════════════════════════════════════════════════════════
// 2. JOB DESIGNATIONS (Functional Title)
// ═══════════════════════════════════════════════════════════════
export const STAFF_DESIGNATIONS = [
  { value: "Admissions Counsellor", label: "Admissions Counsellor", icon: GraduationCap, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { value: "Visa & Documentation Officer", label: "Visa & Documentation Officer", icon: FileCheck, color: "text-amber-600 bg-amber-50 border-amber-200" },
  { value: "Finance & Accounts Executive", label: "Finance & Accounts Executive", icon: Wallet, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { value: "Travel & Fleet Coordinator", label: "Travel & Fleet Coordinator", icon: Plane, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  { value: "Front Desk Executive", label: "Front Desk Executive", icon: Headphones, color: "text-slate-600 bg-slate-100 border-slate-300" },
  { value: "Telecaller / Lead Executive", label: "Telecaller / Lead Executive", icon: Phone, color: "text-teal-600 bg-teal-50 border-teal-200" },
];

export function getDesignationInfo(designation?: string, role?: string) {
  const d = (designation || role || "").toLowerCase();
  if (d.includes("super admin") || d.includes("director") || d.includes("ceo")) {
    return {
      label: designation || "Super Admin / Headquarters",
      icon: ShieldCheck,
      color: "text-[#E52E20] bg-red-50 border-red-200",
    };
  }
  if (d.includes("branch admin") || d.includes("branch manager") || d.includes("branch head") || d.includes("head")) {
    return {
      label: designation || "Branch Head / Branch Manager",
      icon: Crown,
      color: "text-purple-700 bg-purple-50 border-purple-200",
    };
  }
  if (d.includes("counsel")) {
    return { label: designation || "Admissions Counsellor", icon: GraduationCap, color: "text-blue-700 bg-blue-50 border-blue-200" };
  }
  if (d.includes("visa") || d.includes("doc")) {
    return { label: designation || "Visa & Documentation Officer", icon: FileCheck, color: "text-amber-700 bg-amber-50 border-amber-200" };
  }
  if (d.includes("finance") || d.includes("account")) {
    return { label: designation || "Finance & Accounts Executive", icon: Wallet, color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  }
  if (d.includes("travel") || d.includes("fleet") || d.includes("tour")) {
    return { label: designation || "Travel & Fleet Coordinator", icon: Plane, color: "text-indigo-700 bg-indigo-50 border-indigo-200" };
  }
  if (d.includes("tele") || d.includes("lead")) {
    return { label: designation || "Telecaller / Lead Executive", icon: Phone, color: "text-teal-700 bg-teal-50 border-teal-200" };
  }
  if (d.includes("front") || d.includes("reception")) {
    return { label: designation || "Front Desk Executive", icon: Headphones, color: "text-slate-700 bg-slate-100 border-slate-300" };
  }
  return {
    label: designation || role || "Staff Member",
    icon: Briefcase,
    color: "text-slate-700 bg-slate-100 border-slate-300",
  };
}

function HRPage() {
  const qc = useQueryClient();
  const currentUser = getUser() || { name: "Mohammad Iqbal", role: "super_admin", branch: "Guwahati HQ" };
  const isStaff = isStaffRole(currentUser);
  const isSuperAdmin = currentUser.role === "super_admin";
  const isBranchAdmin = currentUser.role === "branch_admin";

  const [selectedBranch, setSelectedBranch] = useState<string>(
    isBranchAdmin ? currentUser.branch || "Mumbai" : "All Branches"
  );
  const [activeTab, setActiveTab] = useState<"hierarchy" | "directory">("hierarchy");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog open states
  const [addBranchModalOpen, setAddBranchModalOpen] = useState(false);
  const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);
  const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [resetPassModalOpen, setResetPassModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // Form states
  const [branchForm, setBranchForm] = useState({
    name: "",
    city: "",
    region: "North",
    head: "",
  });

  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "Branch Head / Branch Manager",
    branch: "",
    password: "admin123",
  });

  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "Admissions Counsellor",
    customDesignation: "",
    branch: isBranchAdmin ? currentUser.branch || "Mumbai" : "Mumbai",
    reports_to: "",
    password: "staff123",
    create_login: true,
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff",
    designation: "",
    branch: "",
    reports_to: "",
    status: "Active",
    password: "",
  });

  const [newPassword, setNewPassword] = useState("staff123");

  // Query: All Branches (disabled for staff)
  const { data: allBranchesData } = useQuery({
    queryKey: ["all-branches"],
    enabled: !isStaff,
    queryFn: async () => {
      const res: any = await api.get<any[]>("/branches");
      return res.data ?? res ?? [];
    },
  });

  // Query: Staff Hierarchy (disabled for staff)
  const { data: hierarchyData, isLoading: hierarchyLoading } = useQuery({
    queryKey: ["staff-hierarchy"],
    enabled: !isStaff,
    queryFn: async () => {
      const res: any = await api.get<any[]>("/staff/hierarchy");
      return res.data ?? res ?? [];
    },
  });

  // Query: Branches & Appointed Admins (disabled for staff)
  const { data: branchesAdminsData } = useQuery({
    queryKey: ["branches-admins"],
    enabled: !isStaff,
    queryFn: async () => {
      const res: any = await api.get<any[]>("/branches/admins");
      return res.data ?? res ?? [];
    },
  });

  // Query: Employees (disabled for staff)
  const { data: employeesData, isLoading: empsLoading } = useQuery({
    queryKey: ["employees", selectedBranch],
    enabled: !isStaff,
    queryFn: async () => {
      const queryParams: any = { limit: 100 };
      if (selectedBranch && selectedBranch !== "All Branches") {
        queryParams.branch = selectedBranch;
      }
      const res: any = await api.get<any[]>("/employees", queryParams);
      return res.data ?? res ?? [];
    },
  });

  const branchesList: any[] = Array.isArray(allBranchesData) ? allBranchesData : [];
  const hierarchyList: any[] = Array.isArray(hierarchyData) ? hierarchyData : [];
  const branchAdminsList: any[] = Array.isArray(branchesAdminsData) ? branchesAdminsData : [];
  const allEmployees: any[] = Array.isArray(employeesData) ? employeesData : [];

  // Helper to open Add Staff Modal
  const openAddStaffModal = (defaultBranch?: string) => {
    const b = defaultBranch || (isBranchAdmin ? currentUser.branch || "Mumbai" : selectedBranch !== "All Branches" ? selectedBranch : (branchesList[0]?.name || "Mumbai"));
    const branchAdmin = branchAdminsList.find((br: any) => br.branch === b);
    const headName = branchAdmin?.head || (hierarchyList.find((h: any) => h.branch === b)?.admin?.name ?? "Branch Admin");

    setStaffForm({
      name: "",
      email: "",
      phone: "",
      designation: "Admissions Counsellor",
      customDesignation: "",
      branch: b,
      reports_to: `${headName} (Branch Admin · ${b})`,
      password: "staff123",
      create_login: true,
    });
    setAddStaffModalOpen(true);
  };

  const handleStaffBranchChange = (branchName: string) => {
    const branchAdmin = branchAdminsList.find((br: any) => br.branch === branchName);
    const headName = branchAdmin?.head || (hierarchyList.find((h: any) => h.branch === branchName)?.admin?.name ?? "Branch Admin");
    setStaffForm((prev) => ({
      ...prev,
      branch: branchName,
      reports_to: `${headName} (Branch Admin · ${branchName})`,
    }));
  };

  // Open Edit Modal
  const openEditModal = (emp: any) => {
    setSelectedEmployee(emp);
    const sysRole = emp.role === "super_admin" || emp.role === "branch_admin" ? emp.role : "staff";
    setEditForm({
      name: emp.name,
      email: emp.email || "",
      phone: emp.phone || "",
      role: sysRole,
      designation: emp.designation || emp.role || "Staff Member",
      branch: emp.branch,
      reports_to: emp.reports_to || "",
      status: emp.status || "Active",
      password: "",
    });
    setEditModalOpen(true);
  };

  // Open Reset Password Modal
  const openResetPasswordModal = (emp: any) => {
    setSelectedEmployee(emp);
    setNewPassword(emp.role === "branch_admin" ? "admin123" : "staff123");
    setResetPassModalOpen(true);
  };

  // ═══════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═══════════════════════════════════════════════════════════════

  // 1. Create Branch (Super Admin Only)
  const createBranchMutation = useMutation({
    mutationFn: async () => api.post("/branches", branchForm),
    onSuccess: (res: any) => {
      qc.invalidateQueries({ queryKey: ["all-branches"] });
      qc.invalidateQueries({ queryKey: ["branches-admins"] });
      qc.invalidateQueries({ queryKey: ["staff-hierarchy"] });
      setAddBranchModalOpen(false);
      toast.success(res?.message || `Branch "${branchForm.name}" created successfully!`);
    },
    onError: (e: any) => toast.error(e.message || "Failed to create branch"),
  });

  // 2. Appoint Branch Admin (Super Admin Only)
  const createAdminMutation = useMutation({
    mutationFn: async () =>
      api.post("/employees", {
        name: adminForm.name,
        email: adminForm.email,
        phone: adminForm.phone,
        branch: adminForm.branch,
        role: "branch_admin",
        designation: adminForm.designation.trim() || "Branch Head / Branch Manager",
        password: adminForm.password,
        create_login: true,
        status: "Active",
      }),
    onSuccess: (res: any) => {
      qc.invalidateQueries({ queryKey: ["all-branches"] });
      qc.invalidateQueries({ queryKey: ["branches-admins"] });
      qc.invalidateQueries({ queryKey: ["staff-hierarchy"] });
      qc.invalidateQueries({ queryKey: ["employees"] });
      setAddAdminModalOpen(false);
      toast.success(res?.message || `Branch Admin appointed for ${adminForm.branch}!`);
    },
    onError: (e: any) => toast.error(e.message || "Failed to appoint branch admin"),
  });

  // 3. Add Staff Member (Branch Admin & Super Admin)
  const createStaffMutation = useMutation({
    mutationFn: async () => {
      const finalDesignation =
        staffForm.designation === "custom"
          ? staffForm.customDesignation.trim() || "Staff Member"
          : staffForm.designation;

      return api.post("/employees", {
        name: staffForm.name,
        email: staffForm.email,
        phone: staffForm.phone,
        branch: staffForm.branch,
        role: "staff",
        designation: finalDesignation,
        reports_to: staffForm.reports_to,
        password: staffForm.password,
        create_login: staffForm.create_login,
        status: "Active",
      });
    },
    onSuccess: (res: any) => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      qc.invalidateQueries({ queryKey: ["staff-hierarchy"] });
      setAddStaffModalOpen(false);
      toast.success(res?.message || "Staff member added successfully!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to add staff member"),
  });

  // 4. Update Employee
  const updateEmployeeMutation = useMutation({
    mutationFn: async () => api.put(`/employees/${selectedEmployee.id}`, editForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      qc.invalidateQueries({ queryKey: ["staff-hierarchy"] });
      qc.invalidateQueries({ queryKey: ["branches-admins"] });
      setEditModalOpen(false);
      toast.success("Employee profile updated successfully!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to update employee"),
  });

  // 5. Reset Password
  const resetPasswordMutation = useMutation({
    mutationFn: async () =>
      api.put(`/employees/${selectedEmployee.id}`, {
        email: selectedEmployee.email,
        password: newPassword,
      }),
    onSuccess: () => {
      setResetPassModalOpen(false);
      toast.success(`Password reset to "${newPassword}" for ${selectedEmployee.name}!`);
    },
    onError: (e: any) => toast.error(e.message || "Failed to reset password"),
  });

  // 6. Delete Employee
  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: number) => api.del(`/employees/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      qc.invalidateQueries({ queryKey: ["staff-hierarchy"] });
      toast.success("Staff member deleted successfully");
    },
    onError: (e: any) => toast.error(e.message || "Failed to delete staff member"),
  });

  // Filtered branches for view
  const displayBranches = useMemo(() => {
    if (selectedBranch && selectedBranch !== "All Branches") {
      return hierarchyList.filter((h: any) => h.branch === selectedBranch);
    }
    return hierarchyList;
  }, [hierarchyList, selectedBranch]);

  // Overall Stats
  const totalStaffCount = allEmployees.filter((e: any) => e.role === "staff").length;
  const branchAdminCount = allEmployees.filter((e: any) => e.role === "branch_admin").length;
  const counselorCount = allEmployees.filter((e: any) => (e.designation || "").toLowerCase().includes("counsel")).length;
  const visaCount = allEmployees.filter((e: any) => (e.designation || "").toLowerCase().includes("visa")).length;
  const financeCount = allEmployees.filter((e: any) => (e.designation || "").toLowerCase().includes("finance") || (e.designation || "").toLowerCase().includes("account")).length;

  if (isStaff) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <Card className="max-w-md w-full p-6 sm:p-8 rounded-2xl shadow-xl border-slate-200 bg-white space-y-5">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto shadow-sm">
            <Lock className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <Badge className="bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-100 font-semibold px-3 py-1">
              Management & Admin Access Only
            </Badge>
            <h2 className="text-xl font-bold text-slate-900">
              Access Restricted
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>HR & Staff Management</strong> is reserved for Branch Admins and Headquarters Super Admin to manage branch personnel and staff hierarchy.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Logged in as:</span>
              <span className="font-bold text-slate-800">{currentUser.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">System Role:</span>
              <span className="font-semibold text-blue-700 capitalize">Staff ({currentUser.designation || "Staff Member"})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Branch:</span>
              <span className="font-semibold text-slate-700">{currentUser.branch || "Headquarters"}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              asChild
              className="w-full bg-[#E52E20] hover:bg-[#c92418] text-white font-semibold rounded-xl"
            >
              <Link to="/">
                Return to Dashboard
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Staff & Role Hierarchy"
        description="Clear separation between System Roles (Permissions) and Job Designations. Branch Admins manage staff in their branches."
        actions={
          <div className="flex items-center gap-2">
            {/* SUPER ADMIN PRIVILEGES ONLY: Add Branch and Add Branch Admin */}
            {isSuperAdmin && (
              <>
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-300 font-semibold hover:bg-slate-100 shadow-sm text-xs h-9"
                  onClick={() => {
                    setBranchForm({ name: "", city: "", region: "North", head: "" });
                    setAddBranchModalOpen(true);
                  }}
                >
                  <Building2 className="h-4 w-4 mr-1.5 text-blue-600" /> + Add New Branch
                </Button>

                <Button
                  variant="outline"
                  className="rounded-xl border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold shadow-sm text-xs h-9"
                  onClick={() => {
                    const defaultBranch = branchesList[0]?.name || "Mumbai";
                    setAdminForm({
                      name: "",
                      email: "",
                      phone: "",
                      designation: "Branch Head / Branch Manager",
                      branch: defaultBranch,
                      password: "admin123",
                    });
                    setAddAdminModalOpen(true);
                  }}
                >
                  <Crown className="h-4 w-4 mr-1.5 text-purple-600" /> + Add Branch Admin
                </Button>
              </>
            )}

            {/* BOTH SUPER ADMIN & BRANCH ADMIN: Add Staff Member */}
            <Button
              className="rounded-xl bg-[#E52E20] hover:bg-[#c92418] text-white shadow-sm font-semibold text-xs h-9"
              onClick={() => openAddStaffModal()}
            >
              <Plus className="h-4 w-4 mr-1.5" /> + Add Staff Member
            </Button>
          </div>
        }
      />

      {/* Role & Designation Separation Banner */}
      <div className="mb-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-purple-50/70 p-4 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Distinct System Roles & Designations Architecture
                <span className="rounded bg-indigo-100 text-indigo-800 text-[10px] px-2 py-0.5 font-bold uppercase">
                  RBAC Active
                </span>
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                <strong>System Roles:</strong> <code>Super Admin</code> (HQ) ➔ <code>Branch Admin</code> (Branch Head) ➔ <code>Staff</code>.
                <strong> Designations:</strong> Admissions Counsellor, Visa Officer, Finance Executive, Travel Coordinator, Front Desk Executive.
              </p>
            </div>
          </div>
          {isBranchAdmin ? (
            <div className="rounded-xl border border-purple-200 bg-purple-100/90 px-3 py-2 text-xs text-purple-900 font-semibold flex items-center gap-2">
              <Crown className="h-4 w-4 text-purple-700" />
              <span>You are managing <strong>{currentUser.branch} Branch</strong></span>
            </div>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-100/80 px-3 py-2 text-xs text-red-900 font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-red-600" />
              <span>Super Admin Master Control</span>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="rounded-2xl border-slate-200 bg-white shadow-soft">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-800">
              <Building2 className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">{branchesList.length || 14}</div>
              <div className="text-xs text-muted-foreground font-medium">Total Branches</div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-purple-100 bg-purple-50/50 shadow-soft">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-600 text-white">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black text-purple-950">{branchAdminCount}</div>
              <div className="text-xs text-purple-800 font-medium">Branch Admins (Heads)</div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-blue-100 bg-blue-50/50 shadow-soft">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black text-blue-950">{counselorCount}</div>
              <div className="text-xs text-blue-800 font-medium">Admissions Counsellors</div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-amber-100 bg-amber-50/50 shadow-soft">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-600 text-white">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black text-amber-950">{visaCount}</div>
              <div className="text-xs text-amber-800 font-medium">Visa & Filing Officers</div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-emerald-100 bg-emerald-50/50 shadow-soft">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black text-emerald-950">{financeCount}</div>
              <div className="text-xs text-emerald-800 font-medium">Finance & Accounts</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar: Branch Filters & View Switcher */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Branch Filter Tabs (For Super Admin) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1 shrink-0 mr-1">
            <Building2 className="h-3.5 w-3.5 text-slate-500" /> Branch:
          </span>
          {isSuperAdmin && (
            <button
              onClick={() => setSelectedBranch("All Branches")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shrink-0 ${
                selectedBranch === "All Branches"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              All Branches ({branchesList.length || 14})
            </button>
          )}

          {branchesList.map((b: any) => {
            const bName = b.name;
            const isSelected = selectedBranch === bName;
            const isClickable = isSuperAdmin || currentUser.branch === bName;
            if (!isSuperAdmin && currentUser.branch !== bName) return null;

            return (
              <button
                key={b.id || bName}
                disabled={!isClickable}
                onClick={() => setSelectedBranch(bName)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-purple-700 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>{bName}</span>
                {isSelected && <Crown className="h-3 w-3" />}
              </button>
            );
          })}
        </div>

        {/* View Switcher: Hierarchy Tree vs Flat Table */}
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="shrink-0">
          <TabsList className="rounded-xl bg-slate-100 p-1">
            <TabsTrigger value="hierarchy" className="rounded-lg text-xs font-bold">
              Branch Tree Hierarchy
            </TabsTrigger>
            <TabsTrigger value="directory" className="rounded-lg text-xs font-bold">
              Staff Directory ({allEmployees.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TAB 1: BRANCH-BY-BRANCH HIERARCHY TREE VIEW                     */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "hierarchy" && (
        <div className="space-y-6">
          {hierarchyLoading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-soft">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-400 mb-3" />
              <p className="text-sm font-semibold text-slate-600">Loading branch organograms...</p>
            </div>
          ) : displayBranches.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-soft">
              <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No Branch Found</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {isSuperAdmin ? "Create your first branch using the '+ Add New Branch' button above." : "No branches matching your filter."}
              </p>
            </div>
          ) : (
            displayBranches.map((branchGroup: any) => {
              const admin = branchGroup.admin || { name: "Branch Admin", role: "branch_admin", designation: "Branch Head / Branch Manager" };
              const staffMembers: any[] = branchGroup.staff || [];

              return (
                <div key={branchGroup.branch} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card space-y-5">
                  {/* Branch Header Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white font-bold">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-slate-900">{branchGroup.branch} Branch</h3>
                          <Badge variant="outline" className="rounded-md border-slate-200 text-xs font-semibold text-slate-600">
                            {branchGroup.city} · {branchGroup.region}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {staffMembers.length} Staff Member{staffMembers.length === 1 ? "" : "s"} reporting to Branch Admin
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl border-dashed border-slate-300 hover:border-[#E52E20] hover:text-[#E52E20] text-xs font-semibold"
                      onClick={() => openAddStaffModal(branchGroup.branch)}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1 text-[#E52E20]" /> Add Staff to {branchGroup.branch}
                    </Button>
                  </div>

                  {/* LEVEL 1: Branch Admin Card (Executive Head of Branch) */}
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-purple-900 mb-2 flex items-center gap-1.5">
                      <Crown className="h-3.5 w-3.5 text-purple-600" />
                      Branch Head (Admin)
                    </div>

                    <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50/80 via-white to-purple-50/40 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-purple-600 text-white font-black text-sm shadow">
                          {admin.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-black text-slate-900">{admin.name}</span>
                            {/* System Role Badge */}
                            <span className="rounded-full bg-purple-600 text-white text-[10.5px] px-2.5 py-0.5 font-bold flex items-center gap-1">
                              <Crown className="h-3 w-3" /> Branch Admin
                            </span>
                            {/* Designation Badge */}
                            <Badge variant="outline" className="rounded-full border-purple-300 bg-purple-100 text-purple-900 text-[10px] font-semibold">
                              {admin.designation || "Branch Head / Branch Manager"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5 text-purple-500" /> {admin.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5 text-purple-500" /> {admin.phone}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="text-purple-800 font-semibold">
                              Directly Supervises {staffMembers.length} staff
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Full Branch Authority
                        </span>
                        {admin.id && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-lg text-purple-700 hover:bg-purple-100 text-xs font-semibold"
                            onClick={() => openResetPasswordModal(admin)}
                          >
                            <Key className="h-3.5 w-3.5 mr-1" /> Reset Pass
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* LEVEL 2: Staff Under Branch Admin */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        Staff Reporting to {admin.name} ({staffMembers.length})
                      </div>
                    </div>

                    {staffMembers.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
                        <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">No staff added under {admin.name} yet.</p>
                        <Button
                          size="sm"
                          className="mt-3 rounded-xl bg-slate-900 text-white text-xs"
                          onClick={() => openAddStaffModal(branchGroup.branch)}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" /> Add First Staff Member
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {staffMembers.map((staff: any) => {
                          const desigInfo = getDesignationInfo(staff.designation, staff.role);
                          const DesigIcon = desigInfo.icon;

                          return (
                            <div
                              key={staff.id}
                              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft hover:shadow-card transition flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2.5">
                                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border">
                                      {staff.name
                                        .split(" ")
                                        .map((n: string) => n[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="text-sm font-bold text-slate-900">{staff.name}</div>
                                      <div className="text-[11px] text-slate-500">{staff.email}</div>
                                    </div>
                                  </div>

                                  {/* System Role Badge */}
                                  <Badge className="rounded-md border text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                                    Staff
                                  </Badge>
                                </div>

                                {/* Designation Pill */}
                                <div className="mt-2 mb-3">
                                  <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${desigInfo.color}`}>
                                    <DesigIcon className="h-3.5 w-3.5" />
                                    <span>{desigInfo.label}</span>
                                  </span>
                                </div>

                                <div className="space-y-1.5 my-2 rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-100">
                                  <div className="flex items-center justify-between text-slate-600">
                                    <span className="font-medium text-slate-500">Reports To:</span>
                                    <span className="font-semibold text-purple-900 truncate max-w-[150px]">
                                      {admin.name} (Admin)
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-slate-600">
                                    <span className="font-medium text-slate-500">Phone:</span>
                                    <span className="font-mono text-slate-700">{staff.phone || "—"}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-slate-600">
                                    <span className="font-medium text-slate-500">Status:</span>
                                    <Badge
                                      variant="outline"
                                      className={`text-[9.5px] font-bold ${
                                        staff.status === "Active"
                                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                          : "border-amber-200 bg-amber-50 text-amber-700"
                                      }`}
                                    >
                                      {staff.status || "Active"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                                  <Key className="h-3 w-3 text-emerald-600" /> ERP Login Active
                                </span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-slate-500 hover:text-slate-900"
                                    title="Edit Profile & Designation"
                                    onClick={() => openEditModal(staff)}
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-slate-500 hover:text-purple-600"
                                    title="Reset Password"
                                    onClick={() => openResetPasswordModal(staff)}
                                  >
                                    <Key className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                    title="Delete Staff"
                                    onClick={() => deleteEmployeeMutation.mutate(staff.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TAB 2: COMPLETE STAFF DIRECTORY (TABLE VIEW)                    */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "directory" && (
        <Card className="rounded-2xl shadow-card border-slate-200">
          <CardHeader className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold">All Employees & Staff Directory</CardTitle>
              <CardDescription className="text-xs">
                Comprehensive directory with separate System Roles, Job Designations, and Reporting Lines.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search name, designation, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-xs rounded-lg w-[200px] sm:w-[240px]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-muted-foreground border-b">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold">Staff Member</th>
                    <th className="px-5 py-3 text-left font-semibold">System Role</th>
                    <th className="px-5 py-3 text-left font-semibold">Designation (Job Title)</th>
                    <th className="px-5 py-3 text-left font-semibold">Branch</th>
                    <th className="px-5 py-3 text-left font-semibold">Reports To</th>
                    <th className="px-5 py-3 text-left font-semibold">Status</th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {empsLoading ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-xs text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin inline mr-1.5" /> Loading staff records...
                      </td>
                    </tr>
                  ) : allEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-xs text-muted-foreground">
                        No employees found matching filter.
                      </td>
                    </tr>
                  ) : (
                    allEmployees
                      .filter((emp: any) => {
                        const q = searchQuery.toLowerCase();
                        if (
                          q &&
                          !emp.name?.toLowerCase().includes(q) &&
                          !emp.role?.toLowerCase().includes(q) &&
                          !emp.designation?.toLowerCase().includes(q) &&
                          !emp.email?.toLowerCase().includes(q)
                        ) {
                          return false;
                        }
                        return true;
                      })
                      .map((t: any) => {
                        const desigInfo = getDesignationInfo(t.designation, t.role);
                        const DesigIcon = desigInfo.icon;
                        const sysRoleInfo = getSystemRoleInfo(t.role);
                        const isHQ = t.role === "super_admin";
                        const isBranchHead = t.role === "branch_admin";

                        return (
                          <tr key={t.id ?? t.name} className="hover:bg-slate-50/80 transition">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                                    isHQ
                                      ? "bg-[#E52E20] text-white"
                                      : isBranchHead
                                      ? "bg-purple-600 text-white"
                                      : "bg-slate-100 text-slate-800 border"
                                  }`}
                                >
                                  {t.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    {t.name}
                                    {isBranchHead && (
                                      <span title="Branch Head">
                                        <Crown className="h-3 w-3 text-purple-600 inline" />
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{t.email || "No email"}</div>
                                </div>
                              </div>
                            </td>

                            {/* System Role Column */}
                            <td className="px-5 py-3">
                              <Badge className={`rounded-md border text-[10.5px] font-bold px-2 py-0.5 ${sysRoleInfo.badge}`}>
                                {sysRoleInfo.label}
                              </Badge>
                            </td>

                            {/* Designation Column */}
                            <td className="px-5 py-3">
                              <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${desigInfo.color}`}>
                                <DesigIcon className="h-3.5 w-3.5 shrink-0" />
                                <span>{desigInfo.label}</span>
                              </span>
                            </td>

                            {/* Branch Column */}
                            <td className="px-5 py-3">
                              <span className="font-medium text-slate-800">{t.branch}</span>
                            </td>

                            {/* Reports To Column */}
                            <td className="px-5 py-3">
                              {t.reports_to ? (
                                <span className="text-xs font-medium text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                                  {t.reports_to}
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400">Head of UniQuesta (HQ)</span>
                              )}
                            </td>

                            {/* Status Column */}
                            <td className="px-5 py-3">
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-bold ${
                                  t.status === "Active"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                {t.status || "Active"}
                              </Badge>
                            </td>

                            {/* Actions Column */}
                            <td className="px-5 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-slate-500 hover:text-slate-900"
                                  title="Edit Profile & Designation"
                                  onClick={() => openEditModal(t)}
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-purple-600 hover:bg-purple-50"
                                  title="Reset Password"
                                  onClick={() => openResetPasswordModal(t)}
                                >
                                  <Key className="h-3.5 w-3.5" />
                                </Button>
                                {!isHQ && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                    title="Delete Member"
                                    onClick={() => deleteEmployeeMutation.mutate(t.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DIALOG 1: ADD NEW BRANCH (SUPER ADMIN ONLY)                             */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Dialog open={addBranchModalOpen} onOpenChange={setAddBranchModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Add New UniQuesta Branch
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Super Admin privilege: Register a new branch location for UniQuesta Abroad.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3.5 py-2">
            <div className="grid gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Branch Name *</Label>
              <Input
                value={branchForm.name}
                onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                placeholder="e.g. Pune, Kolkata, Chennai"
                className="h-9 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">City *</Label>
                <Input
                  value={branchForm.city}
                  onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
                  placeholder="e.g. Pune"
                  className="h-9 rounded-xl"
                />
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Region *</Label>
                <Select
                  value={branchForm.region}
                  onValueChange={(v) => setBranchForm({ ...branchForm, region: v })}
                >
                  <SelectTrigger className="h-9 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North">North India</SelectItem>
                    <SelectItem value="West">West India</SelectItem>
                    <SelectItem value="South">South India</SelectItem>
                    <SelectItem value="East">East India</SelectItem>
                    <SelectItem value="Central">Central India</SelectItem>
                    <SelectItem value="North-East">North-East India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Initial Branch Head (Optional)</Label>
              <Input
                value={branchForm.head}
                onChange={(e) => setBranchForm({ ...branchForm, head: e.target.value })}
                placeholder="e.g. Rajesh Sharma"
                className="h-9 rounded-xl"
              />
              <span className="text-[10.5px] text-muted-foreground">
                You can appoint a Branch Admin with full login credentials in the next step.
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setAddBranchModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => createBranchMutation.mutate()}
              disabled={!branchForm.name.trim() || !branchForm.city.trim() || createBranchMutation.isPending}
            >
              {createBranchMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              Create Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DIALOG 2: ADD BRANCH ADMIN (SUPER ADMIN ONLY)                           */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Dialog open={addAdminModalOpen} onOpenChange={setAddAdminModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-600" />
              Appoint Branch Admin (Branch Head)
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Super Admin privilege: Appoint the executive head of a branch with administrative authority.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3.5 py-2">
            <div className="grid gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Branch to Manage *</Label>
              <Select
                value={adminForm.branch}
                onValueChange={(v) => setAdminForm({ ...adminForm, branch: v })}
              >
                <SelectTrigger className="h-9 rounded-xl">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branchesList.map((b: any) => (
                    <SelectItem key={b.id || b.name} value={b.name}>
                      {b.name} ({b.city})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Admin Full Name *</Label>
              <Input
                value={adminForm.name}
                onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                placeholder="e.g. Karan Mehta"
                className="h-9 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">System Role</Label>
                <div className="h-9 rounded-xl bg-purple-50 border border-purple-200 px-3 flex items-center text-xs font-bold text-purple-900">
                  <Crown className="h-3.5 w-3.5 text-purple-700 mr-1.5" /> Branch Admin
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Designation (Job Title) *</Label>
                <Input
                  value={adminForm.designation}
                  onChange={(e) => setAdminForm({ ...adminForm, designation: e.target.value })}
                  placeholder="Branch Head / General Manager"
                  className="h-9 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Email (Login ID) *</Label>
                <Input
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  placeholder="admin.city@uniquesta.com"
                  className="h-9 rounded-xl"
                />
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Phone</Label>
                <Input
                  value={adminForm.phone}
                  onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                  placeholder="+91 98200 00000"
                  className="h-9 rounded-xl"
                />
              </div>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-3 space-y-1.5">
              <Label className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-purple-700" /> Initial Password
              </Label>
              <Input
                type="text"
                value={adminForm.password}
                onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                placeholder="admin123"
                className="h-8 text-xs font-mono rounded-lg bg-white"
              />
              <p className="text-[10px] text-purple-800">
                This Branch Admin will be able to log in at <code>/login</code> and manage this branch and its staff.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setAddAdminModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold"
              onClick={() => createAdminMutation.mutate()}
              disabled={!adminForm.name || !adminForm.email || !adminForm.branch || createAdminMutation.isPending}
            >
              {createAdminMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              Appoint Branch Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DIALOG 3: ADD STAFF MEMBER (BRANCH ADMIN & SUPER ADMIN)                 */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Dialog open={addStaffModalOpen} onOpenChange={setAddStaffModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-[#E52E20]" />
              Add Staff Member & Assign Designation
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add operational staff (Admissions, Visa, Finance, Travel, Front Desk) reporting to the Branch Admin.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3.5 py-2">
            <div className="grid gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Full Name *</Label>
              <Input
                value={staffForm.name}
                onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                placeholder="e.g. Meera Shah"
                className="h-9 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Branch *</Label>
                <Select
                  value={staffForm.branch}
                  disabled={isBranchAdmin}
                  onValueChange={handleStaffBranchChange}
                >
                  <SelectTrigger className="h-9 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branchesList.map((b: any) => (
                      <SelectItem key={b.id || b.name} value={b.name}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isBranchAdmin && (
                  <span className="text-[10px] text-purple-700 font-semibold">Locked to your assigned branch</span>
                )}
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">System Role</Label>
                <div className="h-9 rounded-xl bg-blue-50 border border-blue-200 px-3 flex items-center text-xs font-bold text-blue-900">
                  <Users className="h-3.5 w-3.5 text-blue-600 mr-1.5" /> Staff (Operational)
                </div>
              </div>
            </div>

            {/* Designation Selection */}
            <div className="grid gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Staff Designation (Job Title) *</Label>
              <Select
                value={staffForm.designation}
                onValueChange={(v) => setStaffForm({ ...staffForm, designation: v })}
              >
                <SelectTrigger className="h-9 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAFF_DESIGNATIONS.map((d) => {
                    const Icon = d.icon;
                    return (
                      <SelectItem key={d.value} value={d.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-slate-600" />
                          <span>{d.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                  <SelectItem value="custom">✍️ Custom Designation...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {staffForm.designation === "custom" && (
              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Specify Custom Designation *</Label>
                <Input
                  value={staffForm.customDesignation}
                  onChange={(e) => setStaffForm({ ...staffForm, customDesignation: e.target.value })}
                  placeholder="e.g. Senior Regional Counsellor"
                  className="h-9 rounded-xl"
                />
              </div>
            )}

            <div className="grid gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Reporting To (Branch Admin)</Label>
              <Input
                value={staffForm.reports_to}
                onChange={(e) => setStaffForm({ ...staffForm, reports_to: e.target.value })}
                placeholder="Branch Admin"
                className="h-9 rounded-xl bg-purple-50/50 border-purple-200 text-purple-900 font-semibold text-xs"
              />
              <span className="text-[10.5px] text-muted-foreground">
                Staff member directly answers to this Branch Head.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Email Address (Login ID) *</Label>
                <Input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  placeholder="name.role@uniquesta.com"
                  className="h-9 rounded-xl"
                />
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Phone Number</Label>
                <Input
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                  placeholder="+91 98200 11111"
                  className="h-9 rounded-xl"
                />
              </div>
            </div>

            {/* ERP Login Account Credentials */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-950">ERP Login Credentials</span>
                </div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={staffForm.create_login}
                    onChange={(e) => setStaffForm({ ...staffForm, create_login: e.target.checked })}
                    className="rounded text-[#E52E20]"
                  />
                  <span>Enable Login</span>
                </label>
              </div>

              {staffForm.create_login && (
                <div className="grid gap-1.5">
                  <Label className="text-[11px] font-semibold text-emerald-900">
                    Temporary Password
                  </Label>
                  <Input
                    type="text"
                    value={staffForm.password}
                    onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                    placeholder="staff123"
                    className="h-8 text-xs font-mono rounded-lg bg-white"
                  />
                  <p className="text-[10px] text-emerald-800">
                    Staff member will be able to log in at <code>/login</code> with their email and this password immediately.
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setAddStaffModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#E52E20] hover:bg-[#c92418] text-white font-semibold"
              onClick={() => createStaffMutation.mutate()}
              disabled={
                !staffForm.name ||
                !staffForm.email ||
                !staffForm.branch ||
                (staffForm.designation === "custom" && !staffForm.customDesignation.trim()) ||
                createStaffMutation.isPending
              }
            >
              {createStaffMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              Save & Create Staff Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DIALOG 4: EDIT STAFF MEMBER & DESIGNATION                               */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-purple-600" />
              Edit Employee Profile & Designation
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-3.5 py-2">
            <div className="grid gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Full Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="h-9 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">System Role</Label>
                {isSuperAdmin ? (
                  <Select
                    value={editForm.role}
                    onValueChange={(v) => setEditForm({ ...editForm, role: v })}
                  >
                    <SelectTrigger className="h-9 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Staff Member</SelectItem>
                      <SelectItem value="branch_admin">Branch Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-9 rounded-xl bg-slate-100 border px-3 flex items-center text-xs font-bold text-slate-700">
                    {editForm.role}
                  </div>
                )}
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Designation (Job Title)</Label>
                <Input
                  value={editForm.designation}
                  onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                  placeholder="e.g. Senior Counsellor"
                  className="h-9 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Branch</Label>
                {isSuperAdmin ? (
                  <Select
                    value={editForm.branch}
                    onValueChange={(v) => setEditForm({ ...editForm, branch: v })}
                  >
                    <SelectTrigger className="h-9 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {branchesList.map((b: any) => (
                        <SelectItem key={b.id || b.name} value={b.name}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-9 rounded-xl bg-slate-100 border px-3 flex items-center text-xs font-bold text-slate-700">
                    {editForm.branch}
                  </div>
                )}
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(v) => setEditForm({ ...editForm, status: v })}
                >
                  <SelectTrigger className="h-9 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Reports To</Label>
              <Input
                value={editForm.reports_to}
                onChange={(e) => setEditForm({ ...editForm, reports_to: e.target.value })}
                className="h-9 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Phone</Label>
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="h-9 rounded-xl"
                />
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Email</Label>
                <Input
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="h-9 rounded-xl"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold"
              onClick={() => updateEmployeeMutation.mutate()}
              disabled={updateEmployeeMutation.isPending}
            >
              {updateEmployeeMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DIALOG 5: RESET ERP PASSWORD                                            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Dialog open={resetPassModalOpen} onOpenChange={setResetPassModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Lock className="h-4 w-4 text-purple-600" />
              Reset ERP Password for {selectedEmployee?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Account Login: <strong>{selectedEmployee?.email}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-3">
            <div className="grid gap-1.5">
              <Label className="text-xs font-bold text-slate-700">New Password *</Label>
              <Input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="staff123"
                className="h-9 font-mono rounded-xl"
              />
              <span className="text-[11px] text-muted-foreground">
                This updates the password hash in the database immediately.
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPassModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#E52E20] hover:bg-[#c92418] text-white font-semibold"
              onClick={() => resetPasswordMutation.mutate()}
              disabled={!newPassword || resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
