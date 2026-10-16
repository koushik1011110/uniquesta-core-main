import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  Download,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  Trash2,
  Search,
  Filter,
  Receipt,
  Building2,
  Calendar,
  CreditCard,
  IndianRupee,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Printer,
  Share2,
  TrendingUp,
  Percent,
  Wallet,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCheck,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/finance")({
  head: () => ({
    meta: [
      { title: "Finance & Invoices · Uniquesta ERP" },
      { name: "description", content: "Consolidated enterprise invoicing, student fee receivables, tax vouchers, and multi-branch P&L." },
      { property: "og:title", content: "Finance & Invoices · Uniquesta ERP" },
      { property: "og:description", content: "Enterprise fee invoicing, receipts, and receivables management." },
    ],
  }),
  component: FinancePage,
});

interface InvoiceItem {
  id?: number;
  code: string;
  student: string;
  student_id?: number;
  amount: string;
  amount_value?: number;
  currency?: string;
  type: string;
  date: string;
  due_date?: string;
  status: "Paid" | "Pending" | "Overdue";
  branch?: string;
  payment_method?: string;
  notes?: string;
}

const statusTone: Record<string, { badge: string; text: string; bg: string; icon: any }> = {
  Paid: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    text: "text-emerald-600",
    bg: "bg-emerald-500",
    icon: CheckCircle2,
  },
  Pending: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    text: "text-amber-600",
    bg: "bg-amber-500",
    icon: Clock,
  },
  Overdue: {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    text: "text-rose-600",
    bg: "bg-rose-500",
    icon: AlertCircle,
  },
};

function formatCurrency(val: number, cur = "INR") {
  if (cur === "EUR") return `€ ${val.toLocaleString()}`;
  if (cur === "USD") return `$ ${val.toLocaleString()}`;
  if (cur === "GBP") return `£ ${val.toLocaleString()}`;
  return `₹ ${val.toLocaleString("en-IN")}`;
}

export function FinancePage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<"invoices" | "collections" | "branches" | "calculator">("invoices");

  // Filter States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceItem | null>(null);

  // Form State
  const [form, setForm] = useState({
    student: "",
    amount: "",
    currency: "INR",
    type: "Tuition Instalment",
    status: "Pending" as "Paid" | "Pending" | "Overdue",
    branch: "Guwahati HQ",
    payment_method: "Bank Transfer",
    date: new Date().toISOString().slice(0, 10),
    due_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    notes: "",
  });

  // Quotation Calculator State
  const [calcForm, setCalcForm] = useState({
    studentName: "",
    program: "B.Sc Nursing (4 Years)",
    branch: "Guwahati HQ",
    tuitionFee: 150000,
    regFee: 10000,
    visaFee: 15000,
    scholarship: 10000,
    applyGst: true,
  });

  // Data Queries
  const { data: invData, isLoading, refetch } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res: any = await api.get<any[]>("/invoices", { limit: 100 });
      return (res.data ?? res ?? []) as InvoiceItem[];
    },
  });

  const invoices: InvoiceItem[] = useMemo(() => {
    if (!invData) return [];
    return Array.isArray(invData) ? invData : (invData as any)?.data ?? [];
  }, [invData]);

  // Registered students query for quick autocomplete
  const { data: studentsData } = useQuery({
    queryKey: ["students-quick"],
    queryFn: async () => {
      try {
        const res: any = await api.get("/students", { limit: 50 });
        return (res.data ?? res ?? []) as any[];
      } catch {
        return [];
      }
    },
  });
  const studentsList: any[] = Array.isArray(studentsData) ? studentsData : [];

  // Mutations
  const createMut = useMutation({
    mutationFn: async () => {
      const amountVal = parseInt(form.amount.replace(/\D/g, ""), 10) || 0;
      return api.post("/invoices", {
        ...form,
        amount: form.amount.startsWith("₹") || form.amount.startsWith("€") || form.amount.startsWith("$")
          ? form.amount
          : `${form.currency === "EUR" ? "€" : form.currency === "USD" ? "$" : "₹"} ${form.amount}`,
        amount_value: amountVal,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      setCreateOpen(false);
      toast.success("New invoice generated successfully!");
      setForm({
        student: "",
        amount: "",
        currency: "INR",
        type: "Tuition Instalment",
        status: "Pending",
        branch: "Guwahati HQ",
        payment_method: "Bank Transfer",
        date: new Date().toISOString().slice(0, 10),
        due_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        notes: "",
      });
    },
    onError: (e: any) => toast.error(e.message || "Failed to create invoice"),
  });

  const updateStatusMut = useMutation({
    mutationFn: async ({ code, status }: { code: string; status: "Paid" | "Pending" | "Overdue" }) => {
      return api.put(`/invoices/${code}`, { status });
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      toast.success(`Invoice ${vars.code} updated to ${vars.status}`);
      if (previewInvoice && previewInvoice.code === vars.code) {
        setPreviewInvoice({ ...previewInvoice, status: vars.status });
      }
    },
    onError: (e: any) => toast.error(e.message || "Could not update status"),
  });

  const deleteMut = useMutation({
    mutationFn: async (code: string) => api.del(`/invoices/${code}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice deleted");
      if (previewInvoice) setPreviewInvoice(null);
    },
    onError: (e: any) => toast.error(e.message || "Delete failed"),
  });

  // Filtered List
  const filteredInvoices = useMemo(() => {
    return invoices.filter((item) => {
      const matchSearch =
        !search ||
        item.student.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        (item.branch && item.branch.toLowerCase().includes(search.toLowerCase())) ||
        (item.notes && item.notes.toLowerCase().includes(search.toLowerCase()));

      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchType = typeFilter === "all" || item.type === typeFilter;
      const matchBranch = branchFilter === "all" || item.branch === branchFilter;
      const matchCur = currencyFilter === "all" || (item.currency || "INR") === currencyFilter;

      return matchSearch && matchStatus && matchType && matchBranch && matchCur;
    });
  }, [invoices, search, statusFilter, typeFilter, branchFilter, currencyFilter]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    let totalInvoicedINR = 0;
    let totalCollectedINR = 0;
    let totalPendingINR = 0;
    let totalOverdueINR = 0;

    let paidCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    invoices.forEach((inv) => {
      // normalize currency to approx INR for aggregate view
      const rawVal = inv.amount_value || parseInt(inv.amount.replace(/\D/g, ""), 10) || 0;
      const inrVal = inv.currency === "EUR" ? rawVal * 90 : inv.currency === "USD" ? rawVal * 84 : rawVal;

      totalInvoicedINR += inrVal;
      if (inv.status === "Paid") {
        totalCollectedINR += inrVal;
        paidCount++;
      } else if (inv.status === "Overdue") {
        totalOverdueINR += inrVal;
        overdueCount++;
      } else {
        totalPendingINR += inrVal;
        pendingCount++;
      }
    });

    const recoveryRate = totalInvoicedINR > 0 ? Math.round((totalCollectedINR / totalInvoicedINR) * 100) : 0;

    return {
      totalInvoicedINR,
      totalCollectedINR,
      totalPendingINR,
      totalOverdueINR,
      recoveryRate,
      paidCount,
      pendingCount,
      overdueCount,
      totalCount: invoices.length,
    };
  }, [invoices]);

  // Branch Breakdown
  const branchBreakdown = useMemo(() => {
    const branches = [
      { name: "Guwahati HQ", target: 2000000, head: "Mohammad Iqbal" },
      { name: "Mumbai", target: 1800000, head: "Rahul Deshmukh" },
      { name: "Delhi NCR", target: 1500000, head: "Karan Mehta" },
      { name: "Bengaluru", target: 1200000, head: "Divya Rao" },
      { name: "Hyderabad", target: 1000000, head: "Rahul Reddy" },
    ];

    return branches.map((b) => {
      const branchInvs = invoices.filter((i) => (i.branch || "Guwahati HQ").includes(b.name) || b.name.includes(i.branch || ""));
      const collected = branchInvs
        .filter((i) => i.status === "Paid")
        .reduce((sum, i) => sum + (i.amount_value || 0), 0);
      const pending = branchInvs
        .filter((i) => i.status !== "Paid")
        .reduce((sum, i) => sum + (i.amount_value || 0), 0);

      const pct = Math.min(100, Math.round((collected / (b.target || 1)) * 100));

      return {
        ...b,
        count: branchInvs.length,
        collected,
        pending,
        pct,
      };
    });
  }, [invoices]);

  // Quick Quotation Calculator Net Sum
  const calcTotal = useMemo(() => {
    const subtotal = calcForm.tuitionFee + calcForm.regFee + calcForm.visaFee - calcForm.scholarship;
    const gst = calcForm.applyGst ? Math.round(subtotal * 0.18) : 0;
    return {
      subtotal,
      gst,
      grandTotal: subtotal + gst,
    };
  }, [calcForm]);

  // Export to CSV
  const exportCsv = () => {
    const headers = ["Invoice Code", "Student", "Type", "Amount", "Currency", "Date", "Due Date", "Branch", "Status", "Payment Method"];
    const rows = filteredInvoices.map((i) => [
      i.code,
      `"${i.student}"`,
      `"${i.type}"`,
      `"${i.amount}"`,
      i.currency || "INR",
      i.date,
      i.due_date || "",
      `"${i.branch || ""}"`,
      i.status,
      `"${i.payment_method || ""}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `uniquesta_invoices_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Invoices exported to CSV");
  };

  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* ─── Top Header ─── */}
      <PageHeader
        title="Finance & Invoices"
        description="Unified receivables management, tuition collections, multi-currency invoicing, and branch P&L tracking."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5 text-xs">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button
              size="sm"
              onClick={() => setActiveTab("calculator")}
              variant="outline"
              className="gap-1.5 text-xs border-amber-300 text-amber-800 bg-amber-50/70 hover:bg-amber-100"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Fee Calculator
            </Button>
            <Button
              size="sm"
              onClick={() => setCreateOpen(true)}
              className="gap-1.5 bg-[#E52E20] hover:bg-[#c92418] text-white font-semibold text-xs shadow-sm"
            >
              <Plus className="h-4 w-4" /> New Tax Invoice
            </Button>
          </div>
        }
      />

      {/* ─── Financial Executive KPI Metric Strip ─── */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Total Invoiced */}
        <Card className="rounded-xl border-border/70 shadow-sm relative overflow-hidden bg-gradient-to-br from-white via-white to-slate-50">
          <div className="absolute top-0 left-0 h-1 w-full bg-slate-900" />
          <CardContent className="p-4.5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Total Invoiced (Consolidated)</span>
              <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <Receipt className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(metrics.totalInvoicedINR)}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2">
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <ArrowUpRight className="h-3 w-3" /> +18.4% YoY Growth
              </span>
              <span>{metrics.totalCount} Total Invoices</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Realized Collections */}
        <Card className="rounded-xl border-border/70 shadow-sm relative overflow-hidden bg-gradient-to-br from-white via-white to-emerald-50/30">
          <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500" />
          <CardContent className="p-4.5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Collections Realized</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-700 tracking-tight">
              {formatCurrency(metrics.totalCollectedINR)}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2">
              <span className="font-semibold text-emerald-700">{metrics.recoveryRate}% Collection Rate</span>
              <span>{metrics.paidCount} Cleared</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Outstanding Receivables */}
        <Card className="rounded-xl border-border/70 shadow-sm relative overflow-hidden bg-gradient-to-br from-white via-white to-amber-50/30">
          <div className="absolute top-0 left-0 h-1 w-full bg-amber-500" />
          <CardContent className="p-4.5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Outstanding Receivables</span>
              <div className="h-7 w-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <Clock className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-amber-700 tracking-tight">
              {formatCurrency(metrics.totalPendingINR)}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2">
              <span className="font-medium text-amber-700">{metrics.pendingCount} Invoices Due</span>
              <span className="text-[10.5px]">Avg DSO: 14 Days</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Overdue Attention Required */}
        <Card className="rounded-xl border-border/70 shadow-sm relative overflow-hidden bg-gradient-to-br from-white via-white to-rose-50/30">
          <div className="absolute top-0 left-0 h-1 w-full bg-rose-500" />
          <CardContent className="p-4.5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Overdue Follow-up</span>
              <div className="h-7 w-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                <AlertCircle className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-rose-700 tracking-tight">
              {formatCurrency(metrics.totalOverdueINR)}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2">
              <span className="font-semibold text-rose-600">{metrics.overdueCount} Past Due Date</span>
              <span className="text-[10px] text-rose-700 font-bold bg-rose-100 px-1.5 py-0.5 rounded">Action Req</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Navigation Tabs ─── */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
          <TabsList className="bg-slate-100/90 p-1 rounded-xl h-auto flex-wrap">
            <TabsTrigger value="invoices" className="rounded-lg text-xs font-semibold py-1.5 px-3.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <FileText className="h-3.5 w-3.5 mr-1.5 text-slate-700" /> Invoices & Receivables ({invoices.length})
            </TabsTrigger>
            <TabsTrigger value="collections" className="rounded-lg text-xs font-semibold py-1.5 px-3.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <CreditCard className="h-3.5 w-3.5 mr-1.5 text-slate-700" /> Payment Transactions
            </TabsTrigger>
            <TabsTrigger value="branches" className="rounded-lg text-xs font-semibold py-1.5 px-3.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Building2 className="h-3.5 w-3.5 mr-1.5 text-slate-700" /> Branch Revenue & P&L
            </TabsTrigger>
            <TabsTrigger value="calculator" className="rounded-lg text-xs font-semibold py-1.5 px-3.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-600" /> Fee Quotation Builder
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
              <ShieldCheck className="h-3.5 w-3.5" /> GST & Tax Compliant
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 1: INVOICES & RECEIVABLES TABLE                        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <TabsContent value="invoices" className="mt-4 space-y-4">
          {/* Search & Multi-Filter Toolbar */}
          <Card className="border-border/80 shadow-sm p-3.5 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search */}
              <div className="md:col-span-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search by student, invoice #, branch or notes…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8.5 h-8.5 text-xs bg-slate-50/60"
                />
              </div>

              {/* Status Filter */}
              <div className="md:col-span-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8.5 text-xs">
                    <SelectValue placeholder="Status: All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Paid">Cleared / Paid</SelectItem>
                    <SelectItem value="Pending">Pending Due</SelectItem>
                    <SelectItem value="Overdue">Overdue Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fee Type Filter */}
              <div className="md:col-span-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-8.5 text-xs">
                    <SelectValue placeholder="Type: All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fee Types</SelectItem>
                    <SelectItem value="Tuition Instalment">Tuition Instalment</SelectItem>
                    <SelectItem value="University Fee">University Fee</SelectItem>
                    <SelectItem value="Service Fee">Service Fee</SelectItem>
                    <SelectItem value="Application Fee">Application Fee</SelectItem>
                    <SelectItem value="Visa & Travel">Visa & Travel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Branch Filter */}
              <div className="md:col-span-2">
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger className="h-8.5 text-xs">
                    <SelectValue placeholder="Branch: All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    <SelectItem value="Guwahati HQ">Guwahati HQ</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                    <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Currency Filter */}
              <div className="md:col-span-2 flex items-center gap-1.5">
                <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                  <SelectTrigger className="h-8.5 text-xs">
                    <SelectValue placeholder="Currency: All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Currencies</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>

                {(search || statusFilter !== "all" || typeFilter !== "all" || branchFilter !== "all" || currencyFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("all");
                      setTypeFilter("all");
                      setBranchFilter("all");
                      setCurrencyFilter("all");
                    }}
                    className="h-8.5 px-2 text-xs text-muted-foreground hover:text-foreground"
                    title="Clear Filters"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Invoices Master Table */}
          <Card className="rounded-xl border-border/80 shadow-sm overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-500 border-b border-border/70">
                  <tr>
                    <th className="px-4 py-3 text-left">Invoice No.</th>
                    <th className="px-4 py-3 text-left">Student & Enrolment</th>
                    <th className="px-4 py-3 text-left">Fee Category</th>
                    <th className="px-4 py-3 text-left">Branch</th>
                    <th className="px-4 py-3 text-right">Invoiced Amount</th>
                    <th className="px-4 py-3 text-left">Invoice Date</th>
                    <th className="px-4 py-3 text-left">Due Date</th>
                    <th className="px-4 py-3 text-center">Payment Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {isLoading ? (
                    <tr>
                      <td colSpan={9} className="px-5 py-10 text-center text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-[#E52E20]" />
                        <span>Loading financial records…</span>
                      </td>
                    </tr>
                  ) : filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-5 py-12 text-center text-muted-foreground">
                        <Receipt className="mx-auto mb-2 h-8 w-8 opacity-25" />
                        <p className="font-semibold text-foreground text-sm">No invoices found matching criteria</p>
                        <p className="mt-1 text-xs">Try adjusting your search terms or filter selection.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => {
                      const tone = statusTone[inv.status] || statusTone.Pending;
                      const StatusIcon = tone.icon;

                      return (
                        <tr key={inv.code || inv.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Invoice Code */}
                          <td className="px-4 py-3 font-mono font-bold text-slate-900">
                            <button
                              type="button"
                              onClick={() => setPreviewInvoice(inv)}
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              {inv.code}
                            </button>
                          </td>

                          {/* Student */}
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-800">{inv.student}</div>
                            {inv.notes && (
                              <div className="text-[10.5px] text-muted-foreground truncate max-w-[200px]" title={inv.notes}>
                                {inv.notes}
                              </div>
                            )}
                          </td>

                          {/* Fee Type */}
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="text-[10.5px] bg-slate-50 border-slate-200 text-slate-700 font-medium">
                              {inv.type}
                            </Badge>
                          </td>

                          {/* Branch */}
                          <td className="px-4 py-3 text-slate-600 font-medium">
                            {inv.branch || "Guwahati HQ"}
                          </td>

                          {/* Amount */}
                          <td className="px-4 py-3 text-right">
                            <div className="font-bold text-slate-900 tabular-nums text-sm">
                              {inv.amount}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {inv.payment_method || "Bank Transfer"}
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3 text-muted-foreground">
                            {inv.date ? new Date(inv.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </td>

                          {/* Due Date */}
                          <td className="px-4 py-3">
                            {inv.due_date ? (
                              <span className={`text-[11px] ${inv.status === "Overdue" ? "text-rose-600 font-bold" : "text-muted-foreground"}`}>
                                {new Date(inv.due_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3 text-center">
                            <Badge variant="outline" className={`text-[10.5px] font-semibold px-2 py-0.5 gap-1 ${tone.badge}`}>
                              <StatusIcon className="h-3 w-3" />
                              <span>{inv.status}</span>
                            </Badge>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* View / Print Invoice Voucher */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPreviewInvoice(inv)}
                                className="h-7 px-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                title="View & Print Invoice Receipt"
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" /> View
                              </Button>

                              {/* Quick Mark Paid / Pending */}
                              {inv.status !== "Paid" ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateStatusMut.mutate({ code: inv.code, status: "Paid" })}
                                  className="h-7 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                  title="Mark as Paid"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateStatusMut.mutate({ code: inv.code, status: "Pending" })}
                                  className="h-7 px-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                  title="Mark as Pending"
                                >
                                  <Clock className="h-3.5 w-3.5" />
                                </Button>
                              )}

                              {/* Delete */}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  if (confirm(`Delete invoice ${inv.code}?`)) {
                                    deleteMut.mutate(inv.code);
                                  }
                                }}
                                className="h-7 w-7 text-slate-400 hover:text-rose-600"
                                title="Delete Invoice"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div className="p-3 bg-slate-50/80 border-t flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
              <div>
                Showing <strong>{filteredInvoices.length}</strong> of <strong>{invoices.length}</strong> recorded invoices
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Cleared: {metrics.paidCount}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Pending: {metrics.pendingCount}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="h-2 w-2 rounded-full bg-rose-500" /> Overdue: {metrics.overdueCount}
                </span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 2: PAYMENT TRANSACTIONS LEDGER                         */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <TabsContent value="collections" className="mt-4 space-y-4">
          <Card className="rounded-xl border-border/80 shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/60 border-b p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-[#E52E20]" /> Real-time Fee Collections & Bank Settlements
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Itemised student payment transactions cleared via NEFT/RTGS, UPI, Razorpay and Bank Demand Drafts.
                  </p>
                </div>
                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 font-bold">
                  {metrics.paidCount} Cleared Settlements
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-500 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">Transaction Ref / UTR</th>
                      <th className="px-4 py-3 text-left">Student</th>
                      <th className="px-4 py-3 text-left">Payment Mode</th>
                      <th className="px-4 py-3 text-left">Branch Office</th>
                      <th className="px-4 py-3 text-right">Settled Amount</th>
                      <th className="px-4 py-3 text-left">Payment Date</th>
                      <th className="px-4 py-3 text-center">Settlement Status</th>
                      <th className="px-4 py-3 text-right">Voucher</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {invoices
                      .filter((i) => i.status === "Paid")
                      .map((inv, idx) => (
                        <tr key={inv.code + idx} className="hover:bg-slate-50/60">
                          <td className="px-4 py-3 font-mono text-[11px] text-slate-700 font-semibold">
                            UTR-2026-{88000 + (inv.id || idx * 10 + 12)}
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-800">
                            {inv.student}
                            <span className="block text-[10px] text-muted-foreground font-normal">{inv.type}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                              <Wallet className="h-3 w-3 text-slate-400" />
                              {inv.payment_method || "Bank Transfer"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 font-medium">
                            {inv.branch || "Guwahati HQ"}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-700 text-sm">
                            {inv.amount}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {inv.date ? new Date(inv.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[10px] font-bold border border-emerald-200">
                              <CheckCheck className="h-3 w-3 text-emerald-600" /> Settled in Account
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPreviewInvoice(inv)}
                              className="h-6.5 text-[11px] px-2"
                            >
                              E-Receipt
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 3: BRANCH REVENUE & REGIONAL P&L                       */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <TabsContent value="branches" className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {branchBreakdown.map((b) => (
              <Card key={b.name} className="rounded-xl border-border/80 shadow-sm overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/70 border-b p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">{b.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">Head: {b.head}</p>
                    </div>
                    <Badge variant="outline" className="text-xs font-semibold bg-white">
                      {b.count} Invoices
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3.5">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-100">
                      <span className="text-[10px] uppercase font-bold text-emerald-700">Collections Realized</span>
                      <p className="text-base font-black text-emerald-800 mt-0.5">
                        {formatCurrency(b.collected)}
                      </p>
                    </div>
                    <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-100">
                      <span className="text-[10px] uppercase font-bold text-amber-700">Pending Receivables</span>
                      <p className="text-base font-black text-amber-800 mt-0.5">
                        {formatCurrency(b.pending)}
                      </p>
                    </div>
                  </div>

                  {/* Target Achievement Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Monthly Target Achievement:</span>
                      <span className="font-bold text-slate-900">{b.pct}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${b.pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Target: {formatCurrency(b.target)}</span>
                      <span>Balance: {formatCurrency(Math.max(0, b.target - b.collected))}</span>
                    </div>
                  </div>

                  <div className="border-t pt-2.5 flex items-center justify-between text-[11px] text-slate-600">
                    <span>Performance Ranking:</span>
                    <span className="font-bold text-slate-800">
                      {b.pct >= 75 ? "⭐ Top Performer" : b.pct >= 50 ? "✓ On Track" : "⚠️ Needs Focus"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 4: QUICK FEE QUOTATION & INVOICE CALCULATOR            */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <TabsContent value="calculator" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Input Form */}
            <Card className="lg:col-span-7 rounded-xl border-border/80 shadow-sm p-5 bg-white space-y-4">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" /> Student Fee Quotation & Quotation Generator
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Calculate tuition instalments, registration costs, and GST breakdown for candidate onboarding.
                </p>
              </div>

              <div className="grid gap-3.5 text-xs">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Student Name / Prospective Lead</Label>
                  <Input
                    placeholder="e.g. Tanmoy Hazarika"
                    value={calcForm.studentName}
                    onChange={(e) => setCalcForm({ ...calcForm, studentName: e.target.value })}
                    className="text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Program / Course</Label>
                    <Select value={calcForm.program} onValueChange={(v) => setCalcForm({ ...calcForm, program: v })}>
                      <SelectTrigger className="text-xs h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B.Sc Nursing (4 Years)">B.Sc Nursing (4 Years)</SelectItem>
                        <SelectItem value="GNM Nursing (3 Years)">GNM Nursing (3 Years)</SelectItem>
                        <SelectItem value="BPT Physiotherapy (4.5 Years)">BPT Physiotherapy (4.5 Years)</SelectItem>
                        <SelectItem value="B.Pharm (4 Years)">B.Pharm (4 Years)</SelectItem>
                        <SelectItem value="UK Master's Degree (1 Year)">UK Master's Degree (1 Year)</SelectItem>
                        <SelectItem value="Canada Post-Graduate Diploma">Canada PG Diploma</SelectItem>
                        <SelectItem value="Germany Public University Tech">Germany Public Tech</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Branch Office</Label>
                    <Select value={calcForm.branch} onValueChange={(v) => setCalcForm({ ...calcForm, branch: v })}>
                      <SelectTrigger className="text-xs h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Guwahati HQ">Guwahati HQ</SelectItem>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                        <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                        <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Base Tuition Fee (₹)</Label>
                    <Input
                      type="number"
                      value={calcForm.tuitionFee}
                      onChange={(e) => setCalcForm({ ...calcForm, tuitionFee: parseInt(e.target.value, 10) || 0 })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">University Registration & Admission Fee (₹)</Label>
                    <Input
                      type="number"
                      value={calcForm.regFee}
                      onChange={(e) => setCalcForm({ ...calcForm, regFee: parseInt(e.target.value, 10) || 0 })}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Visa, Documentation & Service Charge (₹)</Label>
                    <Input
                      type="number"
                      value={calcForm.visaFee}
                      onChange={(e) => setCalcForm({ ...calcForm, visaFee: parseInt(e.target.value, 10) || 0 })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Scholarship / Merit Concession (₹)</Label>
                    <Input
                      type="number"
                      value={calcForm.scholarship}
                      onChange={(e) => setCalcForm({ ...calcForm, scholarship: parseInt(e.target.value, 10) || 0 })}
                      className="text-xs text-emerald-700 font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="gstCheck"
                    checked={calcForm.applyGst}
                    onChange={(e) => setCalcForm({ ...calcForm, applyGst: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-primary"
                  />
                  <Label htmlFor="gstCheck" className="text-xs cursor-pointer">
                    Apply Standard Educational Consultancy GST (18% — 9% CGST + 9% SGST)
                  </Label>
                </div>
              </div>
            </Card>

            {/* Right: Quotation Summary Card */}
            <Card className="lg:col-span-5 rounded-xl border-border/80 shadow-md p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-4">
              <div className="border-b border-white/10 pb-3">
                <span className="text-[10.5px] uppercase font-bold tracking-wider text-slate-400">
                  Official Quotation Estimate
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  {calcForm.studentName || "Prospective Student"}
                </h3>
                <p className="text-xs text-slate-300">{calcForm.program} · {calcForm.branch}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Tuition Fee:</span>
                  <span className="font-mono font-semibold">{formatCurrency(calcForm.tuitionFee)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Registration Fee:</span>
                  <span className="font-mono font-semibold">{formatCurrency(calcForm.regFee)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Service & Visa Filing:</span>
                  <span className="font-mono font-semibold">{formatCurrency(calcForm.visaFee)}</span>
                </div>
                {calcForm.scholarship > 0 && (
                  <div className="flex items-center justify-between text-emerald-400 font-semibold">
                    <span>Scholarship Deduction:</span>
                    <span className="font-mono">- {formatCurrency(calcForm.scholarship)}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-2 flex items-center justify-between text-slate-300">
                  <span>Taxable Subtotal:</span>
                  <span className="font-mono font-semibold">{formatCurrency(calcTotal.subtotal)}</span>
                </div>
                {calcForm.applyGst && (
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>GST @ 18% (9% CGST + 9% SGST):</span>
                    <span className="font-mono font-semibold text-white">+{formatCurrency(calcTotal.gst)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/20 pt-3 flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                  Net Payable Total:
                </span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {formatCurrency(calcTotal.grandTotal)}
                </span>
              </div>

              <Button
                type="button"
                onClick={() => {
                  if (!calcForm.studentName) {
                    toast.error("Please enter candidate name first");
                    return;
                  }
                  // populate new invoice form
                  setForm({
                    student: calcForm.studentName,
                    amount: `₹ ${calcTotal.grandTotal.toLocaleString("en-IN")}`,
                    currency: "INR",
                    type: "Tuition Instalment",
                    status: "Pending",
                    branch: calcForm.branch,
                    payment_method: "Bank Transfer",
                    date: new Date().toISOString().slice(0, 10),
                    due_date: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10),
                    notes: `Quotation for ${calcForm.program}. Includes tuition, reg fee & GST.`,
                  });
                  setCreateOpen(true);
                }}
                className="w-full bg-[#E52E20] hover:bg-[#c92418] text-white font-bold text-xs py-2"
              >
                Generate Tax Invoice for Student ➔
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL 1: VIEW & PRINT OFFICIAL TAX INVOICE & RECEIPT       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <Dialog open={!!previewInvoice} onOpenChange={(open) => !open && setPreviewInvoice(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white">
          {previewInvoice && (
            <div className="flex flex-col max-h-[85vh]">
              {/* Header Bar */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center p-0.5">
                    <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black">Official Tax Invoice & Receipt Voucher</h3>
                    <p className="text-[10px] text-slate-300 font-mono">Ref: {previewInvoice.code}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.print()}
                    className="h-7 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 gap-1"
                  >
                    <Printer className="h-3 w-3" /> Print PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPreviewInvoice(null)}
                    className="h-7 text-xs text-white hover:bg-white/10"
                  >
                    Close
                  </Button>
                </div>
              </div>

              {/* Printable Invoice Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
                {/* Corporate Letterhead Header */}
                <div className="flex items-start justify-between border-b pb-4">
                  <div>
                    <h2 className="text-base font-black tracking-tight text-slate-900">
                      <span className="text-black">UNI</span>
                      <span className="text-[#E52E20]">QUESTA</span> INTERNATIONAL
                    </h2>
                    <p className="text-[10.5px] text-slate-600 mt-0.5 leading-relaxed">
                      Uniquesta Overseas Private Limited<br />
                      Registered HQ: Zoo Road Tiniali, R.G. Baruah Road, Guwahati, Assam - 781024<br />
                      GSTIN: <strong className="text-slate-900 font-mono">18AAACU9182K1Z9</strong> · CIN: U80903AS2021PTC021948
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="inline-block px-3 py-1 rounded border text-center font-bold text-xs uppercase"
                      style={{
                        backgroundColor: previewInvoice.status === "Paid" ? "#ecfdf5" : "#fffbeb",
                        borderColor: previewInvoice.status === "Paid" ? "#a7f3d0" : "#fde68a",
                        color: previewInvoice.status === "Paid" ? "#047857" : "#b45309",
                      }}
                    >
                      {previewInvoice.status === "Paid" ? "✓ CLEARED / PAID" : "PENDING DUE"}
                    </div>
                    <p className="text-[11px] font-mono text-slate-600 mt-1">Invoice: {previewInvoice.code}</p>
                    <p className="text-[10px] text-muted-foreground">Date: {previewInvoice.date || new Date().toISOString().slice(0, 10)}</p>
                  </div>
                </div>

                {/* Billed To & Payment Details */}
                <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50/80 rounded-lg border">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">BILLED TO (CANDIDATE)</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{previewInvoice.student}</p>
                    <p className="text-[11px] text-slate-600">Branch Office: {previewInvoice.branch || "Guwahati HQ"}</p>
                    <p className="text-[11px] text-slate-600">Enrolment: {previewInvoice.type}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">PAYMENT METHOD</span>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{previewInvoice.payment_method || "Bank Wire / NEFT"}</p>
                    <p className="text-[11px] text-slate-600">
                      Due Date: {previewInvoice.due_date || previewInvoice.date}
                    </p>
                    {previewInvoice.status === "Paid" && (
                      <p className="text-[10.5px] text-emerald-700 font-bold mt-1">
                        Bank UTR: UTR994820194
                      </p>
                    )}
                  </div>
                </div>

                {/* Itemised Table */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b text-[11px]">
                      <tr>
                        <th className="px-3 py-2 text-left">Sl</th>
                        <th className="px-3 py-2 text-left">Particulars / Service Description</th>
                        <th className="px-3 py-2 text-center">HSN/SAC</th>
                        <th className="px-3 py-2 text-right">Taxable Amount</th>
                        <th className="px-3 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      <tr>
                        <td className="px-3 py-2.5 text-muted-foreground font-mono">01</td>
                        <td className="px-3 py-2.5">
                          <span className="font-bold text-slate-900">{previewInvoice.type}</span>
                          <span className="block text-[10.5px] text-muted-foreground">
                            {previewInvoice.notes || "Official course enrolment and counseling fees."}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono text-slate-600">999293</td>
                        <td className="px-3 py-2.5 text-right font-mono font-medium text-slate-800">
                          {previewInvoice.amount}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900">
                          {previewInvoice.amount}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Net Total Summary */}
                <div className="flex justify-end">
                  <div className="w-64 space-y-1.5 text-xs bg-slate-50 p-3 rounded-lg border">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-mono font-semibold">{previewInvoice.amount}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>CGST (9%):</span>
                      <span className="font-mono">Included</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>SGST (9%):</span>
                      <span className="font-mono">Included</span>
                    </div>
                    <div className="border-t pt-1.5 flex justify-between font-bold text-slate-900 text-sm">
                      <span>Total Amount:</span>
                      <span className="font-mono text-emerald-700">{previewInvoice.amount}</span>
                    </div>
                  </div>
                </div>

                {/* Official Remittance Bank Details */}
                <div className="p-3 rounded-lg border border-slate-200 text-[11px] space-y-1 text-slate-600 bg-slate-50/50">
                  <span className="font-bold text-slate-800 block text-xs">Official Corporate Bank Remittance Details:</span>
                  <p>Bank: <strong>HDFC Bank Ltd</strong> · Branch: Zoo Road, Guwahati</p>
                  <p>Account Name: <strong>Uniquesta Overseas Private Limited</strong> · A/C No: <strong className="font-mono">50200038918231</strong></p>
                  <p>IFSC: <strong className="font-mono">HDFC0001234</strong> · UPI VPA: <strong className="font-mono">uniquesta@hdfcbank</strong></p>
                </div>

                {/* Footer Signatures */}
                <div className="pt-4 border-t flex items-end justify-between text-[10.5px] text-muted-foreground">
                  <div>
                    <p>This is a computer generated tax invoice issued under Rule 48 of CGST Rules.</p>
                    <p className="mt-0.5">Contact: care@uniquesta.com · +91 98200 11111</p>
                  </div>
                  <div className="text-center">
                    <div className="h-10 w-28 border-b border-dashed border-slate-400 mb-1 mx-auto flex items-end justify-center pb-1 text-slate-400 italic text-[10px]">
                      [Digital Seal]
                    </div>
                    <p className="font-bold text-slate-800 text-[11px]">Authorized Signatory</p>
                    <p className="text-[10px]">Uniquesta International</p>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Status Actions */}
              <div className="p-3.5 bg-slate-50 border-t flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground font-semibold">Update Status:</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatusMut.mutate({ code: previewInvoice.code, status: "Paid" })}
                    disabled={previewInvoice.status === "Paid" || updateStatusMut.isPending}
                    className="h-7 text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                  >
                    Mark as Paid
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatusMut.mutate({ code: previewInvoice.code, status: "Pending" })}
                    disabled={previewInvoice.status === "Pending" || updateStatusMut.isPending}
                    className="h-7 text-xs text-amber-700 border-amber-300 hover:bg-amber-50"
                  >
                    Mark as Pending
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatusMut.mutate({ code: previewInvoice.code, status: "Overdue" })}
                    disabled={previewInvoice.status === "Overdue" || updateStatusMut.isPending}
                    className="h-7 text-xs text-rose-700 border-rose-300 hover:bg-rose-50"
                  >
                    Mark as Overdue
                  </Button>
                </div>

                <Button
                  size="sm"
                  onClick={() => {
                    toast.success(`Payment reminder link copied for ${previewInvoice.student}`);
                  }}
                  variant="outline"
                  className="h-7 text-xs gap-1"
                >
                  <Share2 className="h-3 w-3" /> Share Reminder Link
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL 2: NEW TAX INVOICE CREATION                          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Receipt className="h-4 w-4 text-[#E52E20]" /> Generate New Tax Invoice
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 py-1 text-xs">
            {/* Student Name */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Student Name *</Label>
              <Input
                placeholder="e.g. Priya Nair"
                value={form.student}
                onChange={(e) => setForm({ ...form, student: e.target.value })}
                className="text-xs"
              />
              {studentsList.length > 0 && !form.student && (
                <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-muted-foreground">
                  <span>Quick pick:</span>
                  {studentsList.slice(0, 4).map((s: any) => (
                    <button
                      key={s.id || s.name}
                      type="button"
                      onClick={() => setForm({ ...form, student: s.name, branch: s.branch || form.branch })}
                      className="underline hover:text-primary mr-1"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Amount & Currency */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Amount *</Label>
                <Input
                  placeholder="e.g. 1,24,000"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Currency</Label>
                <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹ Indian Rupee)</SelectItem>
                    <SelectItem value="EUR">EUR (€ Euro)</SelectItem>
                    <SelectItem value="USD">USD ($ US Dollar)</SelectItem>
                    <SelectItem value="GBP">GBP (£ British Pound)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fee Type & Branch */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Fee Category</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tuition Instalment">Tuition Instalment</SelectItem>
                    <SelectItem value="University Fee">University Fee</SelectItem>
                    <SelectItem value="Service Fee">Service Fee</SelectItem>
                    <SelectItem value="Application Fee">Application Fee</SelectItem>
                    <SelectItem value="Visa & Travel">Visa & Travel Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Branch Office</Label>
                <Select value={form.branch} onValueChange={(v) => setForm({ ...form, branch: v })}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Guwahati HQ">Guwahati HQ</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                    <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates: Issue Date & Due Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Invoice Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Due Date</Label>
                <Input
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Payment Method & Initial Status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Payment Method</Label>
                <Select value={form.payment_method} onValueChange={(v) => setForm({ ...form, payment_method: v })}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank Transfer">Bank Transfer (NEFT/RTGS)</SelectItem>
                    <SelectItem value="UPI (GPay / PhonePe)">UPI (GPay / PhonePe)</SelectItem>
                    <SelectItem value="Net Banking">Net Banking</SelectItem>
                    <SelectItem value="Credit / Debit Card">Credit / Debit Card</SelectItem>
                    <SelectItem value="International Wire">International Wire</SelectItem>
                    <SelectItem value="Demand Draft">Demand Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Status</Label>
                <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending (Awaiting Payment)</SelectItem>
                    <SelectItem value="Paid">Cleared / Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Remarks / Notes */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Remarks & Terms</Label>
              <Input
                placeholder="e.g. Semester 1 tuition instalment for Monash University"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!form.student || !form.amount || createMut.isPending}
              onClick={() => createMut.mutate()}
              className="bg-[#E52E20] hover:bg-[#c92418] text-white font-bold"
            >
              {createMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
              Generate Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
