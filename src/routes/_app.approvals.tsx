import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  X,
  Clock,
  CornerUpLeft,
  Forward,
  Paperclip,
  Receipt,
  Building2,
  Calendar,
  IndianRupee,
  FileText,
  MessageSquare,
  CheckCircle2,
  CircleDashed,
  ShieldCheck,
  Download,
  User,
  Search,
  Plus,
  Send,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCheck,
  AlertCircle,
  BellRing,
  RefreshCw,
  ExternalLink,
  Lock,
  Printer,
  ChevronRight,
  SlidersHorizontal,
  Wallet,
  CheckSquare,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/_app/approvals")({
  head: () => ({
    meta: [
      { title: "Expense Approval Workflow · Uniquesta" },
      { name: "description", content: "Email-style staged expense reimbursement approvals from staff to Director and CEO with custom messages." },
    ],
  }),
  component: ApprovalsPage,
});

type StepStatus = "approved" | "current" | "upcoming" | "released" | "rejected" | "pending";

interface ApprovalStep {
  id?: number;
  approval_id?: number;
  name: string;
  role: string;
  initials: string;
  status: StepStatus;
  time: string;
  comment?: string;
  step_order?: number;
}

interface ApprovalItem {
  id: number;
  code: string;
  title: string;
  amount: string;
  amount_value?: number;
  category: string;
  submitted_by: string;
  submitted_date: string;
  period?: string;
  branch: string;
  attachments?: number;
  status: string;
  current_stage: number;
  steps?: ApprovalStep[];
}

// -------------------------------------------------------------
// HELPER: Determine if this application is currently this user's turn
// -------------------------------------------------------------
function isMyTurn(item: ApprovalItem, currentUser: any): boolean {
  if (!item?.steps || !currentUser) return false;
  const activeStep = item.steps.find((s) => s.status === "current");
  if (!activeStep) return false;

  const roleLower = (currentUser.role || "").toLowerCase();
  const emailLower = (currentUser.email || "").toLowerCase();
  const stepRoleLower = activeStep.role.toLowerCase();
  const stepNameLower = activeStep.name.toLowerCase();

  if (emailLower.includes("ceo") || roleLower === "super_admin") {
    return stepRoleLower.includes("ceo") || stepNameLower.includes("iqbal");
  }
  if (roleLower === "director" || emailLower.includes("director")) {
    return stepRoleLower.includes("director") || stepNameLower.includes("vivek");
  }
  if (roleLower === "branch_admin") {
    return stepRoleLower.includes("branch manager") || stepRoleLower.includes("branch admin") || stepRoleLower.includes("branch head");
  }
  if (roleLower === "finance") {
    return stepRoleLower.includes("finance");
  }
  return false;
}

// -------------------------------------------------------------
// HELPER: Check if this user previously reviewed/approved this application
// -------------------------------------------------------------
function hasUserAlreadyApproved(item: ApprovalItem, currentUser: any): boolean {
  if (!item?.steps || !currentUser) return false;
  const roleLower = (currentUser.role || "").toLowerCase();
  const emailLower = (currentUser.email || "").toLowerCase();

  return item.steps.some((s) => {
    if (s.status !== "approved") return false;
    const sRole = s.role.toLowerCase();
    const sName = s.name.toLowerCase();

    if (roleLower === "director" || emailLower.includes("director")) {
      return sRole.includes("director") || sName.includes("vivek");
    }
    if (roleLower === "super_admin" || emailLower.includes("ceo") || emailLower === "admin@uniquesta.com") {
      return sRole.includes("ceo") || sName.includes("iqbal");
    }
    if (roleLower === "branch_admin") {
      return sRole.includes("branch manager") || sRole.includes("branch admin") || sRole.includes("branch head");
    }
    if (roleLower === "finance") {
      return sRole.includes("finance");
    }
    return false;
  });
}

// -------------------------------------------------------------
// HELPER: Visibility Rule
// "jab tak uska turn naa aaa jaye usko wo application show bhi nahi hona sahie faltu mai"
// -------------------------------------------------------------
function canUserSeeApplication(item: ApprovalItem, currentUser: any): boolean {
  if (!item || !currentUser) return false;
  const nameLower = (currentUser.name || "").toLowerCase();
  const emailLower = (currentUser.email || "").toLowerCase();

  // 1. If user is the submitter, they can track their application
  if (
    item.submitted_by.toLowerCase().includes(nameLower) ||
    (emailLower && item.submitted_by.toLowerCase() === emailLower)
  ) {
    return true;
  }

  // 2. If it is currently their active turn to review
  if (isMyTurn(item, currentUser)) {
    return true;
  }

  // 3. If they already approved it in a prior stage
  if (hasUserAlreadyApproved(item, currentUser)) {
    return true;
  }

  // Otherwise, it hasn't reached their stage yet -> strictly hide it!
  return false;
}

export function ApprovalsPage() {
  const qc = useQueryClient();
  const currentUser = getUser() ?? {
    name: "Mohammad Iqbal",
    email: "admin@uniquesta.com",
    role: "super_admin",
    branch: "Guwahati HQ",
  };

  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"turn" | "passed" | "my_submissions" | "all">("turn");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [actionType, setActionType] = useState<"approve" | "send_back" | "reject">("approve");
  const [passMessage, setPassMessage] = useState("");

  // Audit Checklist items
  const [checklist, setChecklist] = useState({
    billsValid: true,
    budgetWithin: true,
    policyCompliant: true,
  });

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);

  // New Claim Form
  const [createForm, setCreateForm] = useState({
    title: "",
    amount: "",
    category: "Travel & Meals",
    branch: currentUser.branch || "Mumbai",
    submitted_by: currentUser.name,
    period: "26 Jul – 28 Jul 2026",
    notes: "",
    attachments: 3,
  });

  // Fetch branches with appointed heads from database
  const { data: branchesData } = useQuery({
    queryKey: ["branches-admins"],
    queryFn: async () => {
      try {
        const res: any = await api.get("/branches/admins");
        return (res.data ?? res ?? []) as any[];
      } catch {
        return [];
      }
    },
  });

  // Fetch all staff members from database
  const { data: allEmployeesData } = useQuery({
    queryKey: ["all-employees"],
    queryFn: async () => {
      try {
        const res: any = await api.get("/employees?limit=200");
        return (res.data ?? res ?? []) as any[];
      } catch {
        return [];
      }
    },
  });

  // Fetch approvals list from API
  const { data: apiData, isLoading, refetch } = useQuery({
    queryKey: ["approvals"],
    queryFn: async () => {
      try {
        const res: any = await api.get("/approvals");
        return (res.data ?? res ?? []) as ApprovalItem[];
      } catch {
        return [] as ApprovalItem[];
      }
    },
    refetchInterval: 4000,
  });

  const rawApprovals: ApprovalItem[] = apiData || [];

  // 1. Filter out all applications that haven't reached this user's turn
  const visibleApprovals = useMemo(() => {
    return rawApprovals.filter((a) => canUserSeeApplication(a, currentUser));
  }, [rawApprovals, currentUser]);

  // 2. Filter by search, category, branch, and selected tab
  const filteredApprovals = useMemo(() => {
    return visibleApprovals.filter((a) => {
      const matchSearch =
        !search ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.code.toLowerCase().includes(search.toLowerCase()) ||
        a.submitted_by.toLowerCase().includes(search.toLowerCase()) ||
        a.branch.toLowerCase().includes(search.toLowerCase());

      const matchCat = categoryFilter === "all" || a.category === categoryFilter;
      const matchBr = branchFilter === "all" || a.branch.includes(branchFilter);

      if (!matchSearch || !matchCat || !matchBr) return false;

      if (filterTab === "turn") return isMyTurn(a, currentUser);
      if (filterTab === "passed") return hasUserAlreadyApproved(a, currentUser);
      if (filterTab === "my_submissions") {
        return (
          a.submitted_by.toLowerCase().includes(currentUser.name.toLowerCase()) ||
          (currentUser.email && a.submitted_by.toLowerCase() === currentUser.email.toLowerCase())
        );
      }
      return true;
    });
  }, [visibleApprovals, search, categoryFilter, branchFilter, filterTab, currentUser]);

  // Determine active item
  const selectedItem = useMemo(() => {
    if (!filteredApprovals.length) {
      return visibleApprovals.length ? visibleApprovals[0] : null;
    }
    if (selectedCode) {
      const found = filteredApprovals.find((a) => a.code === selectedCode || String(a.id) === selectedCode);
      if (found) return found;
    }
    return filteredApprovals[0];
  }, [filteredApprovals, visibleApprovals, selectedCode]);

  // Statistics
  const actionNeededItems = visibleApprovals.filter((a) => isMyTurn(a, currentUser));
  const actionNeededCount = actionNeededItems.length;
  const actionNeededTotal = actionNeededItems.reduce((acc, i) => acc + (i.amount_value || 0), 0);

  const passedItems = visibleApprovals.filter((a) => hasUserAlreadyApproved(a, currentUser));
  const passedCount = passedItems.length;
  const passedTotal = passedItems.reduce((acc, i) => acc + (i.amount_value || 0), 0);

  const mySubmissionsCount = visibleApprovals.filter((a) =>
    a.submitted_by.toLowerCase().includes(currentUser.name.toLowerCase())
  ).length;

  const totalPipelineAmount = rawApprovals.reduce((acc, i) => acc + (i.amount_value || 0), 0);

  const myTurnNow = selectedItem ? isMyTurn(selectedItem, currentUser) : false;
  const alreadyApprovedByMe = selectedItem ? hasUserAlreadyApproved(selectedItem, currentUser) : false;

  // Mutation: Pass / Approve / Reject
  const passMut = useMutation({
    mutationFn: async ({ action, message }: { action: "approve" | "send_back" | "reject"; message: string }) => {
      if (!selectedItem) throw new Error("No approval selected");
      if (!isMyTurn(selectedItem, currentUser)) {
        throw new Error("It is not your turn to act on this application.");
      }
      return api.post(`/approvals/${selectedItem.code}/pass`, {
        action,
        message,
        approver_name: currentUser.name,
        approver_role:
          currentUser.role === "super_admin"
            ? "CEO · Executive Sign-off"
            : currentUser.role === "director"
            ? "Director · Operations"
            : currentUser.role === "branch_admin"
            ? "Branch Manager"
            : "Finance · AP Lead",
        user_email: currentUser.email,
      });
    },
    onSuccess: (res: any) => {
      qc.invalidateQueries({ queryKey: ["approvals"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(res?.message || "Expense application updated and forwarded!");
      setPassMessage("");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to pass approval");
    },
  });

  // Mutation: Create new reimbursement
  const createMut = useMutation({
    mutationFn: async () => {
      return api.post("/approvals", {
        title: createForm.title,
        amount: createForm.amount.startsWith("₹") ? createForm.amount : `₹ ${createForm.amount}`,
        category: createForm.category,
        branch: createForm.branch,
        period: createForm.period,
        submitted_by: createForm.submitted_by || currentUser.name,
        attachments: createForm.attachments,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["approvals"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      setCreateOpen(false);
      toast.success("Reimbursement application submitted! Forwarded to Branch Manager.");
      setCreateForm({
        title: "",
        amount: "",
        category: "Travel & Meals",
        branch: currentUser.branch || "Mumbai",
        submitted_by: currentUser.name,
        period: "26 Jul – 28 Jul 2026",
        notes: "",
        attachments: 3,
      });
    },
    onError: (err: any) => {
      toast.error(err.message || "Could not submit application");
    },
  });

  // Dynamic quick preset chips based on active role
  const presetChips = useMemo(() => {
    const roleLower = (currentUser.role || "").toLowerCase();
    if (roleLower === "director") {
      return [
        "Approved from operations, client visit verified. Forwarding to CEO Mohammad Iqbal for final sanction.",
        "Operational sanction granted. Budget is within Q3 allocation.",
        "High-ROI client meeting agenda validated. Forwarded to CEO for release.",
      ];
    }
    if (roleLower === "super_admin" || currentUser.email.includes("ceo") || currentUser.email.includes("admin")) {
      return [
        "Final CEO sign-off granted. Authorized for immediate payout release.",
        "Budget sanctioned from executive reserves. Proceed with NEFT payment.",
        "Approved against university outreach budget. Release payment.",
      ];
    }
    if (roleLower === "finance") {
      return [
        "Itemised GST bills verified. Compliant with company per-diem policy. Forwarded to Director.",
        "Tax invoices verified against travel schedule. Passed for operational review.",
        "All calculations validated. Forwarded for executive sanction.",
      ];
    }
    return [
      "Verified against branch travel plan. Endorsed for finance verification.",
      "Branch budget sanctioned. Forwarded to Finance AP Lead.",
    ];
  }, [currentUser]);



  const steps = selectedItem?.steps || [];
  const currentStepIndex = steps.findIndex((s) => s.status === "current");
  const activeStep = steps[currentStepIndex];
  const nextStep = steps[currentStepIndex + 1];



  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* ─── Top Header ─── */}
      <PageHeader
        title="Expense Approval Workflow"
        description="Sequential multi-tier authorization chain. Applications strictly route desk-by-desk with verified digital audit remarks."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5 text-xs">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
            {selectedItem && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVoucherModalOpen(true)}
                className="gap-1.5 text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Printer className="h-3.5 w-3.5" /> Print Claim Voucher
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => setCreateOpen(true)}
              className="gap-1.5 bg-[#E52E20] hover:bg-[#c92418] text-white font-semibold text-xs shadow-sm"
            >
              <Plus className="h-4 w-4" /> New Expense Claim
            </Button>
          </div>
        }
      />

      {/* ─── Executive Approvals KPI Metric Strip ─── */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Action Required */}
        <Card className="rounded-xl border-border/70 shadow-sm relative overflow-hidden bg-gradient-to-br from-white via-white to-red-50/30">
          <div className={`absolute top-0 left-0 h-1 w-full ${actionNeededCount > 0 ? "bg-[#E52E20]" : "bg-slate-300"}`} />
          <CardContent className="p-4.5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Awaiting My Action</span>
              <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${actionNeededCount > 0 ? "bg-red-100 text-[#E52E20]" : "bg-slate-100 text-slate-500"}`}>
                <BellRing className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{actionNeededCount} Claims</span>
              {actionNeededCount > 0 && (
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#E52E20] animate-ping" />
              )}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2">
              <span className="font-semibold text-[#E52E20]">
                {actionNeededCount > 0 ? `₹ ${actionNeededTotal.toLocaleString("en-IN")} Pending Sign-off` : "All Clear"}
              </span>
              <span>Action Desk</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Sanctioned By Me */}
        <Card className="rounded-xl border-border/70 shadow-sm relative overflow-hidden bg-gradient-to-br from-white via-white to-emerald-50/30">
          <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500" />
          <CardContent className="p-4.5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Passed & Endorsed by Me</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-700 tracking-tight">
              {passedCount} Approved
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2">
              <span className="font-semibold text-emerald-700">₹ {passedTotal.toLocaleString("en-IN")} Endorsed</span>
              <span>Audit Verified</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Total Claims in Pipeline */}
        <Card className="rounded-xl border-border/70 shadow-sm relative overflow-hidden bg-gradient-to-br from-white via-white to-slate-50">
          <div className="absolute top-0 left-0 h-1 w-full bg-slate-900" />
          <CardContent className="p-4.5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Total Active Pipeline</span>
              <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <Receipt className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
              ₹ {totalPipelineAmount.toLocaleString("en-IN")}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2">
              <span>{rawApprovals.length} Claims Company-wide</span>
              <span>5 Stages</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Turnaround SLA */}
        <Card className="rounded-xl border-border/70 shadow-sm relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/30">
          <div className="absolute top-0 left-0 h-1 w-full bg-blue-500" />
          <CardContent className="p-4.5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Compliance & Turnaround SLA</span>
              <div className="h-7 w-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-blue-700 tracking-tight">
              &lt; 24h Avg
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2">
              <span className="font-semibold text-blue-700">100% Policy Compliant</span>
              <span>ISO-9001 Trail</span>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Strict Turn Privacy Banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-3 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span className="text-foreground">
            <strong>Turn-Based Privacy Active:</strong> Applications strictly appear in this portal when it arrives at your desk. Applications still in preceding stages are hidden to prevent email clutter.
          </span>
        </div>
        <span className="text-[11px] font-semibold bg-white border px-2.5 py-0.5 rounded shadow-sm text-foreground">
          {actionNeededCount} Action Required · {passedCount} Reviewed & Passed
        </span>
      </div>

      {/* ─── EMAIL-STYLE SPLIT LAYOUT ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* LEFT COLUMN: EMAIL INBOX & APPLICATION LIST (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <Card className="shadow-sm border-border/80 overflow-hidden bg-white">
            {/* Search & Inbox Filter Tabs */}
            <div className="p-3 border-b bg-slate-50/70 space-y-2.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search in visible claims…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8 text-xs bg-white"
                />
              </div>

              {/* Inbox Folder Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto text-[11px] no-scrollbar">
                <button
                  type="button"
                  onClick={() => setFilterTab("turn")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition whitespace-nowrap ${
                    filterTab === "turn"
                      ? "bg-[#E52E20] text-white shadow-sm"
                      : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                  }`}
                >
                  <BellRing className="h-3 w-3" /> Awaiting My Turn ({actionNeededCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab("passed")}
                  className={`px-2.5 py-1 rounded-md font-medium transition whitespace-nowrap ${
                    filterTab === "passed" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Passed By Me ({passedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab("my_submissions")}
                  className={`px-2.5 py-1 rounded-md font-medium transition whitespace-nowrap ${
                    filterTab === "my_submissions" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  My Claims ({mySubmissionsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab("all")}
                  className={`px-2.5 py-1 rounded-md font-medium transition whitespace-nowrap ${
                    filterTab === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  All Visible ({visibleApprovals.length})
                </button>
              </div>

              {/* Category Filter Dropdown */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-7 text-[10.5px] rounded border border-slate-200 bg-white px-2 text-slate-700"
                >
                  <option value="all">All Categories</option>
                  <option value="Travel & Meals">Travel & Meals</option>
                  <option value="Marketing & Events">Marketing & Events</option>
                  <option value="Client Fair Advance">Client Fair</option>
                  <option value="Office Supplies">Office Supplies</option>
                </select>

                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="h-7 text-[10.5px] rounded border border-slate-200 bg-white px-2 text-slate-700"
                >
                  <option value="all">All Branches</option>
                  <option value="Guwahati">Guwahati HQ</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>
            </div>

            {/* List of Applications */}
            <div className="divide-y divide-border/60 max-h-[680px] overflow-y-auto">
              {filteredApprovals.length === 0 ? (
                <div className="py-12 px-4 text-center text-xs text-muted-foreground">
                  <Receipt className="mx-auto mb-2 h-8 w-8 opacity-25" />
                  <p className="font-semibold text-foreground">No applications in this view</p>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    {filterTab === "turn"
                      ? "All clear! There are currently no applications waiting for your action. You will be alerted the moment an expense is forwarded to your desk."
                      : "No matching applications found."}
                  </p>
                </div>
              ) : (
                filteredApprovals.map((item) => {
                  const isSelected = selectedItem?.code === item.code;
                  const needsAction = isMyTurn(item, currentUser);
                  const lastStepWithComment = [...(item.steps || [])].reverse().find((s) => s.comment);

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCode(item.code)}
                      className={`p-3.5 transition cursor-pointer text-left relative ${
                        isSelected
                          ? "bg-primary/[0.08] border-l-4 border-l-primary"
                          : "hover:bg-muted/40 border-l-4 border-l-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="h-7 w-7 text-[11px] font-bold bg-primary/10 text-primary shrink-0">
                            <AvatarFallback>
                              {item.submitted_by
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">{item.submitted_by}</p>
                            <p className="text-[10.5px] text-muted-foreground truncate">{item.branch}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-foreground">{item.amount}</span>
                          <p className="text-[10px] text-muted-foreground font-mono">{item.code}</p>
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className={`text-xs font-semibold line-clamp-1 ${isSelected ? "text-primary" : "text-foreground"}`}>
                          {item.title}
                        </p>
                      </div>

                      {/* Last message snippet */}
                      {lastStepWithComment?.comment && (
                        <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1 italic bg-muted/30 px-2 py-0.5 rounded border border-border/40">
                          💬 "{lastStepWithComment.comment}"
                        </p>
                      )}

                      <div className="mt-2.5 flex items-center justify-between gap-1 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-[9.5px] font-semibold py-0.5 ${
                            item.status.includes("CEO")
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : item.status.includes("Director")
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : item.status.includes("Approved")
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {item.status}
                        </Badge>

                        {needsAction ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-[#E52E20] font-bold px-2 py-0.5 text-[9.5px] animate-pulse border border-red-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E52E20]" /> Your Turn
                          </span>
                        ) : alreadyApprovedByMe ? (
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <Check className="h-3 w-3" /> Passed
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: APPLICATION DETAILS, STEPPER & ACTION DESK (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {selectedItem ? (
            <>
              {/* 1. Claim Header Card */}
              <Card className="border-border/80 shadow-sm overflow-hidden bg-white">
                <div className="p-5 border-b bg-gradient-to-r from-slate-50 via-white to-slate-50">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-primary/10 text-primary border border-primary/20 font-bold hover:bg-primary/10">
                          {selectedItem.category}
                        </Badge>
                        <span className="font-mono text-xs font-semibold text-muted-foreground bg-slate-100 px-2 py-0.5 rounded">
                          {selectedItem.code}
                        </span>
                        <Badge variant="outline" className="text-[11px] font-semibold border-amber-300 bg-amber-50 text-amber-800">
                          {selectedItem.status}
                        </Badge>
                      </div>

                      <h2 className="text-xl font-black text-slate-900 pt-1">{selectedItem.title}</h2>

                      <p className="text-xs text-muted-foreground">
                        Submitted by <span className="font-semibold text-slate-800">{selectedItem.submitted_by}</span> ({selectedItem.branch}) · {selectedItem.submitted_date}
                      </p>
                    </div>

                    <div className="text-right bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm min-w-[170px]">
                      <span className="text-[10.5px] uppercase font-bold text-muted-foreground tracking-wider block">
                        Claimed Amount
                      </span>
                      <span className="text-2xl font-black text-emerald-700 tracking-tight flex items-center justify-end gap-0.5">
                        {selectedItem.amount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50/50 text-xs border-b">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Period / Dates</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedItem.period || "18 Jul – 21 Jul 2026"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Cost Centre / Branch</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedItem.branch}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Current Authority</span>
                    <p className="font-semibold text-primary mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {activeStep ? `${activeStep.name} (${activeStep.role})` : "Final Payout"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Audit Compliance</span>
                    <p className="font-semibold text-emerald-600 mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> ISO-9001 Compliant
                    </p>
                  </div>
                </div>

                {/* 2. Visual Staged Stepper */}
                <div className="p-4 bg-white border-b">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCheck className="h-4 w-4 text-primary" /> Staged Approval Sequence (Stage {selectedItem.current_stage || 1} of 5)
                    </h3>
                    {myTurnNow && (
                      <span className="text-[11px] font-bold text-[#E52E20] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> It is your turn to review & pass
                      </span>
                    )}
                  </div>

                  {/* Horizontal visual stepper */}
                  <div className="grid grid-cols-6 gap-2">
                    {steps.map((st, idx) => {
                      const isDone = st.status === "approved" || st.status === "released";
                      const isActive = st.status === "current";

                      return (
                        <div
                          key={st.name + idx}
                          className={`flex flex-col items-center text-center p-2 rounded-lg border transition ${
                            isActive
                              ? "bg-primary/10 border-primary ring-2 ring-primary/20 shadow-sm"
                              : isDone
                              ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                              : "bg-slate-50 border-slate-200 text-slate-400"
                          }`}
                        >
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 shadow-sm ${
                              isActive
                                ? "bg-primary text-primary-foreground animate-pulse"
                                : isDone
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {isDone ? <Check className="h-4 w-4" /> : idx + 1}
                          </div>
                          <span className="text-[11px] font-bold truncate max-w-full leading-tight">
                            {idx === 0 ? "Submitter" : idx === 1 ? "Branch Head" : idx === 2 ? "Finance" : idx === 3 ? "Director" : idx === 4 ? "CEO" : "Payout"}
                          </span>
                          <span className="text-[9.5px] truncate max-w-full text-slate-500 mt-0.5">
                            {st.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>



                {/* 4. EMAIL DISCUSSION THREAD (REMARKS & MESSAGES) */}
                <div className="p-5 space-y-4 bg-white">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="h-4 w-4 text-primary" /> Approval Discussion & Remarks Thread
                    </h3>
                    <span className="text-[11px] text-muted-foreground">Sequential Reviewer Messages</span>
                  </div>

                  <div className="space-y-3">
                    {steps
                      .filter((st) => st.status === "approved" || (st.status === "current" && st.comment) || st.status === "rejected")
                      .map((st, idx) => (
                        <div
                          key={st.name + idx}
                          className="rounded-xl border border-border/80 bg-white p-4 shadow-sm space-y-2.5 transition hover:border-primary/40"
                        >
                          {/* Card header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-9 w-9 text-xs font-bold bg-primary/10 text-primary border">
                                <AvatarFallback>{st.initials || st.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-foreground">{st.name}</span>
                                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-muted font-normal text-muted-foreground">
                                    {st.role}
                                  </Badge>
                                </div>
                                <p className="text-[10.5px] text-muted-foreground mt-0.5 flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {st.time}
                                </p>
                              </div>
                            </div>

                            <Badge
                              className={`text-[10px] font-semibold ${
                                st.status === "approved"
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-300"
                                  : st.status === "rejected"
                                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {idx === 0 ? "Claim Submitted" : "Passed & Endorsed"}
                            </Badge>
                          </div>

                          {/* Message body */}
                          <div className="pl-11">
                            <div className="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-800 border border-slate-200/80 font-normal">
                              {st.comment || "Approved without additional comments."}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* 5. TURN-RESTRICTED ACTION COMPOSER */}
                  {myTurnNow ? (
                    <Card className="border-2 border-primary/30 bg-white rounded-xl shadow-md overflow-hidden mt-6">
                      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-4 py-3 border-b flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Forward className="h-4 w-4 text-primary" />
                          <span className="text-xs font-bold text-foreground">
                            Pass & Forward to Next Approval Authority
                          </span>
                        </div>
                        {nextStep && (
                          <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                            Next in line: {nextStep.name} ({nextStep.role})
                          </span>
                        )}
                      </div>

                      <CardContent className="p-4 space-y-3.5">
                        <div className="p-2.5 rounded-lg text-xs flex items-center justify-between gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>
                              Active Desk: <strong>{currentUser.name}</strong> ({currentUser.role?.replace(/_/g, " ").toUpperCase()}). Complete verification & forward.
                            </span>
                          </span>
                          <span className="text-[10.5px] font-mono uppercase bg-white px-2 py-0.5 rounded border">
                            Stage {selectedItem.current_stage}
                          </span>
                        </div>

                        {/* Internal Audit Checklist */}
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                          <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                            <CheckSquare className="h-3.5 w-3.5 text-primary" /> Pre-Flight Audit Checklist
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11.5px]">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                              <input
                                type="checkbox"
                                checked={checklist.billsValid}
                                onChange={(e) => setChecklist({ ...checklist, billsValid: e.target.checked })}
                                className="h-3.5 w-3.5 rounded text-primary"
                              />
                              <span>Claim particulars verified</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                              <input
                                type="checkbox"
                                checked={checklist.budgetWithin}
                                onChange={(e) => setChecklist({ ...checklist, budgetWithin: e.target.checked })}
                                className="h-3.5 w-3.5 rounded text-primary"
                              />
                              <span>Within cost centre budget</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                              <input
                                type="checkbox"
                                checked={checklist.policyCompliant}
                                onChange={(e) => setChecklist({ ...checklist, policyCompliant: e.target.checked })}
                                className="h-3.5 w-3.5 rounded text-primary"
                              />
                              <span>Per-diem policy verified</span>
                            </label>
                          </div>
                        </div>

                        {/* Quick preset chips */}
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-amber-500" /> 1-Click Approval Remarks:
                          </Label>
                          <div className="flex flex-wrap gap-1.5">
                            {presetChips.map((chip, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setPassMessage(chip)}
                                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-1 rounded-md border border-slate-200 transition text-left"
                              >
                                + {chip.slice(0, 42)}…
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Message Textarea */}
                        <div className="space-y-1">
                          <Label htmlFor="passMsg" className="text-xs font-semibold text-foreground">
                            Your Approval Remarks / Audit Note:
                          </Label>
                          <Textarea
                            id="passMsg"
                            rows={3}
                            value={passMessage}
                            onChange={(e) => setPassMessage(e.target.value)}
                            placeholder="Write message to pass with this application..."
                            className="text-xs leading-relaxed resize-none"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => passMut.mutate({ action: "send_back", message: passMessage })}
                              disabled={passMut.isPending}
                              className="gap-1.5 text-xs text-amber-700 border-amber-300 hover:bg-amber-50"
                            >
                              <CornerUpLeft className="h-3.5 w-3.5" /> Send Back with Remarks
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => passMut.mutate({ action: "reject", message: passMessage })}
                              disabled={passMut.isPending}
                              className="gap-1.5 text-xs text-red-700 border-red-300 hover:bg-red-50"
                            >
                              <X className="h-3.5 w-3.5" /> Reject Claim
                            </Button>
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            onClick={() => passMut.mutate({ action: "approve", message: passMessage })}
                            disabled={passMut.isPending}
                            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm px-4"
                          >
                            <Send className="h-3.5 w-3.5" />
                            {passMut.isPending
                              ? "Passing..."
                              : selectedItem.current_stage >= 4
                              ? "Authorize Final CEO Sign-off & Payout ➔"
                              : `Pass & Forward to ${nextStep ? nextStep.name : "Next Stage"} ➔`}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    /* LOCKED STATE: When it is NOT this user's turn */
                    <Card className="border border-slate-200 bg-slate-50/80 rounded-xl p-5 text-center mt-6">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
                          <Lock className="h-5 w-5" />
                        </div>
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
                          Action Locked · Not Your Turn
                        </h4>
                        <p className="text-xs text-muted-foreground max-w-md">
                          {alreadyApprovedByMe ? (
                            <span>
                              You have already reviewed and forwarded this application from your desk. You can monitor the sequential audit thread above as subsequent authorities complete their review.
                            </span>
                          ) : (
                            <span>
                              This application is currently awaiting review by{" "}
                              <strong className="text-foreground">{activeStep?.name} ({activeStep?.role})</strong>. Each authority can only respond when the application arrives at their portal.
                            </span>
                          )}
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center text-muted-foreground bg-white">
              <Receipt className="mx-auto mb-3 h-10 w-10 opacity-30" />
              <p className="text-sm font-semibold">No expense applications currently awaiting your action.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Applications will automatically land in your portal when passed to your desk by the preceding reviewer.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL 1: PRINT CLAIM VOUCHER MODAL                         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <Dialog open={voucherModalOpen} onOpenChange={setVoucherModalOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white">
          {selectedItem && (
            <div className="flex flex-col max-h-[85vh]">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center p-0.5">
                    <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Official Expense Reimbursement Voucher</h3>
                    <p className="text-[10px] text-slate-300 font-mono">Claim ID: {selectedItem.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => window.print()} className="h-7 text-xs bg-white text-slate-900 gap-1 font-bold">
                    <Printer className="h-3 w-3" /> Print Voucher
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setVoucherModalOpen(false)} className="h-7 text-xs text-white">
                    Close
                  </Button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800">
                <div className="border-b pb-3">
                  <h2 className="text-base font-black text-slate-900">UNIQUESTA OVERSEAS PRIVATE LIMITED</h2>
                  <p className="text-[10.5px] text-slate-600">Employee Expense Reimbursement & Internal Audit Sanction Voucher</p>
                </div>

                <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Claimant Details</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedItem.submitted_by}</p>
                    <p className="text-slate-600">{selectedItem.branch}</p>
                    <p className="text-slate-600">Date: {selectedItem.submitted_date}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Sanctioned Amount</span>
                    <p className="text-xl font-black text-emerald-700 mt-0.5">{selectedItem.amount}</p>
                    <p className="text-slate-600">Category: {selectedItem.category}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Sequential Verification & Audit Trail:</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-100 font-bold text-slate-600 border-b">
                        <tr>
                          <th className="px-3 py-2 text-left">Level</th>
                          <th className="px-3 py-2 text-left">Authority</th>
                          <th className="px-3 py-2 text-left">Status</th>
                          <th className="px-3 py-2 text-left">Timestamp</th>
                          <th className="px-3 py-2 text-left">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {steps.map((st, i) => (
                          <tr key={i}>
                            <td className="px-3 py-2 font-mono">Stage {i + 1}</td>
                            <td className="px-3 py-2 font-bold">{st.name} ({st.role})</td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${st.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                                {st.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-slate-500">{st.time}</td>
                            <td className="px-3 py-2 text-slate-700">{st.comment || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-6 border-t flex justify-between text-[11px] text-slate-600">
                  <div className="text-center">
                    <div className="h-10 border-b border-dashed w-32 mx-auto mb-1" />
                    <span>Claimant Signature</span>
                  </div>
                  <div className="text-center">
                    <div className="h-10 border-b border-dashed w-32 mx-auto mb-1" />
                    <span>Finance Officer</span>
                  </div>
                  <div className="text-center">
                    <div className="h-10 border-b border-dashed w-32 mx-auto mb-1" />
                    <span>Executive Director / CEO</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>



      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL 3: NEW REIMBURSEMENT CLAIM                           */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Receipt className="h-4 w-4 text-[#E52E20]" /> New Reimbursement Claim
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-3.5 py-1 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Purpose / Title *</Label>
              <Input
                placeholder="e.g. Pune University Fair — Travel & Accommodation"
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Total Amount (₹) *</Label>
                <Input
                  placeholder="e.g. 34,500"
                  value={createForm.amount}
                  onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })}
                  className="text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Category</Label>
                <select
                  value={createForm.category}
                  onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm"
                >
                  <option value="Travel & Meals">Travel & Meals</option>
                  <option value="Marketing & Events">Marketing & Events</option>
                  <option value="Client Fair Advance">Client Fair Advance</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Student Pickup Fleet">Student Pickup Fleet</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Branch *</Label>
                <select
                  value={createForm.branch}
                  onChange={(e) => {
                    const newBranch = e.target.value;
                    const branchStaff = (allEmployeesData || []).filter((emp: any) => emp.branch === newBranch || emp.branch?.includes(newBranch));
                    setCreateForm({
                      ...createForm,
                      branch: newBranch,
                      submitted_by: branchStaff.length ? branchStaff[0].name : currentUser.name,
                    });
                  }}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm font-medium"
                >
                  {(branchesData && branchesData.length > 0
                    ? branchesData
                    : [
                        { branch: "Mumbai", head: "Rahul Deshmukh" },
                        { branch: "Delhi NCR", head: "Karan Mehta" },
                        { branch: "Bengaluru", head: "Divya Rao" },
                        { branch: "Hyderabad", head: "Rahul Reddy" },
                        { branch: "Guwahati HQ", head: "Mohammad Iqbal" },
                      ]
                  ).map((b: any) => (
                    <option key={b.branch} value={b.branch}>
                      {b.branch} (Head: {b.head})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Claim Submitter (Staff) *</Label>
                <select
                  value={createForm.submitted_by}
                  onChange={(e) => setCreateForm({ ...createForm, submitted_by: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm font-medium"
                >
                  <option value={currentUser.name}>Logged-in: {currentUser.name} ({currentUser.role?.replace(/_/g, " ")})</option>
                  {(allEmployeesData || [])
                    .filter((emp: any) => emp.branch === createForm.branch || emp.branch?.includes(createForm.branch))
                    .map((emp: any) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name} · {emp.role}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Period / Date</Label>
                <Input
                  value={createForm.period}
                  onChange={(e) => setCreateForm({ ...createForm, period: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Assigned Branch Head</Label>
                <div className="h-9 px-3 py-2 bg-slate-100 rounded-md border text-slate-700 text-xs font-semibold flex items-center truncate">
                  👑 {((branchesData || []).find((b: any) => b.branch === createForm.branch)?.head) || (createForm.branch.includes("Delhi") ? "Karan Mehta" : createForm.branch.includes("Bengaluru") ? "Divya Rao" : createForm.branch.includes("Hyderabad") ? "Rahul Reddy" : "Rahul Deshmukh")}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Submission Notes</Label>
              <Textarea
                rows={2}
                placeholder="Client meet agenda, project purpose and details."
                value={createForm.notes}
                onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                className="text-xs resize-none"
              />
            </div>

            <div className="rounded-lg bg-blue-50 p-2.5 text-[11px] text-blue-700 border border-blue-200">
              ℹ️ On submission, this claim will automatically route to <strong>{((branchesData || []).find((b: any) => b.branch === createForm.branch)?.head) || "Branch Head"}</strong> for initial branch sanction, then <strong>Anjali Kapoor (Finance)</strong>, <strong>Vivek Ramanathan (Director)</strong>, and <strong>Mohammad Iqbal (CEO)</strong>.
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!createForm.title || !createForm.amount || createMut.isPending}
              onClick={() => createMut.mutate()}
              className="bg-[#E52E20] hover:bg-[#c92418] text-white font-bold"
            >
              {createMut.isPending ? "Submitting..." : "Submit Claim ➔"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
