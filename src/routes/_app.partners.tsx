import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import {
  Handshake,
  DollarSign,
  TrendingUp,
  Percent,
  Building2,
  Users,
  Search,
  Plus,
  Sliders,
  Edit2,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Loader2,
  ArrowRight,
  Calculator,
  Crown,
  ShieldAlert,
  Lock,
  Award,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { api } from "@/lib/api";
import { getUser, isStaffRole } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/partners")({
  head: () => ({
    meta: [
      { title: "Partner Profit Sharing (B2B & B2C) · Uniquesta ERP" },
      {
        name: "description",
        content: "Admin management for B2B agency commission splits and B2C direct student referral profit sharing.",
      },
      { property: "og:title", content: "Partner Profit Sharing · Uniquesta ERP" },
      { property: "og:description", content: "Configure B2B and B2C partner profit sharing margins." },
    ],
  }),
  component: PartnerProfitManagementPage,
});

function PartnerProfitManagementPage() {
  const qc = useQueryClient();
  const user = getUser();
  const isStaff = isStaffRole(user);
  const location = useRouterState({ select: (r) => r.location });

  // ----------------------------------------------------
  // Active Tab state synced with URL ?tab=b2b | ?tab=b2c
  // ----------------------------------------------------
  const [activeTab, setActiveTab] = useState<"b2b" | "b2c">(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("tab");
      if (p === "b2c") return "b2c";
    }
    return "b2b";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("tab");
      if (p === "b2c" && activeTab !== "b2c") setActiveTab("b2c");
      else if (p === "b2b" && activeTab !== "b2b") setActiveTab("b2b");
    }
  }, [location.searchStr]);

  const switchTab = (tab: "b2b" | "b2c") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url.toString());
    }
  };

  // ----------------------------------------------------
  // B2B States
  // ----------------------------------------------------
  const [searchB2b, setSearchB2b] = useState("");
  const [selectedBranchB2b, setSelectedBranchB2b] = useState("All Branches");
  const [selectedTierB2b, setSelectedTierB2b] = useState("All Tiers");

  const [b2bProfitModalOpen, setB2bProfitModalOpen] = useState(false);
  const [b2bAddModalOpen, setB2bAddModalOpen] = useState(false);
  const [b2bEditModalOpen, setB2bEditModalOpen] = useState(false);
  const [b2bPayoutModalOpen, setB2bPayoutModalOpen] = useState(false);
  const [selectedB2bPartner, setSelectedB2bPartner] = useState<any>(null);

  const [b2bProfitForm, setB2bProfitForm] = useState({
    partner_share_pct: 25,
    profit_share_type: "percentage",
    flat_rate_amount: 25000,
    tier: "Silver Partner (25%)",
  });

  const [b2bAddForm, setB2bAddForm] = useState({
    name: "",
    company_name: "",
    email: "",
    phone: "",
    city: "",
    branch: "Mumbai",
    profit_share_type: "percentage",
    partner_share_pct: 25,
    flat_rate_amount: 25000,
    tier: "Silver Partner (25%)",
    status: "Active",
    notes: "",
  });

  const [b2bEditForm, setB2bEditForm] = useState({
    name: "",
    company_name: "",
    email: "",
    phone: "",
    city: "",
    branch: "Mumbai",
    status: "Active",
    notes: "",
  });

  const [b2bPayoutAmount, setB2bPayoutAmount] = useState<number>(0);
  const [b2bPayoutNotes, setB2bPayoutNotes] = useState("");

  // ----------------------------------------------------
  // B2C States
  // ----------------------------------------------------
  const [searchB2c, setSearchB2c] = useState("");
  const [selectedBranchB2c, setSelectedBranchB2c] = useState("All Branches");
  const [selectedTypeB2c, setSelectedTypeB2c] = useState("All Types");

  const [b2cRewardModalOpen, setB2cRewardModalOpen] = useState(false);
  const [b2cAddModalOpen, setB2cAddModalOpen] = useState(false);
  const [b2cEditModalOpen, setB2cEditModalOpen] = useState(false);
  const [b2cPayoutModalOpen, setB2cPayoutModalOpen] = useState(false);
  const [selectedB2cPartner, setSelectedB2cPartner] = useState<any>(null);

  const [b2cRewardForm, setB2cRewardForm] = useState({
    reward_amount: 15000,
    reward_pct: 10,
    reward_type: "flat_rate",
    tier: "Silver Ambassador",
  });

  const [b2cAddForm, setB2cAddForm] = useState({
    name: "",
    ambassador_type: "Student Ambassador",
    email: "",
    phone: "",
    city: "",
    branch: "Guwahati HQ",
    reward_type: "flat_rate",
    reward_amount: 15000,
    reward_pct: 10,
    tier: "Silver Ambassador",
    status: "Active",
    payout_mode: "UPI (e.g. name@oksbi)",
    notes: "",
  });

  const [b2cEditForm, setB2cEditForm] = useState({
    name: "",
    ambassador_type: "Student Ambassador",
    email: "",
    phone: "",
    city: "",
    branch: "Guwahati HQ",
    payout_mode: "UPI / Bank NEFT",
    status: "Active",
    notes: "",
  });

  const [b2cPayoutAmount, setB2cPayoutAmount] = useState<number>(0);
  const [b2cPayoutNotes, setB2cPayoutNotes] = useState("");

  // ----------------------------------------------------
  // Queries
  // ----------------------------------------------------
  const { data: b2bRes, isLoading: b2bLoading } = useQuery({
    queryKey: ["b2b-partners", selectedBranchB2b, selectedTierB2b],
    enabled: !isStaff,
    queryFn: async () => {
      const q: any = { limit: 100 };
      if (selectedBranchB2b && selectedBranchB2b !== "All Branches") q.branch = selectedBranchB2b;
      if (selectedTierB2b && selectedTierB2b !== "All Tiers") q.tier = selectedTierB2b;
      return api.get<any>("/b2b-partners", q);
    },
  });

  const { data: b2cRes, isLoading: b2cLoading } = useQuery({
    queryKey: ["b2c-partners", selectedBranchB2c, selectedTypeB2c],
    enabled: !isStaff,
    queryFn: async () => {
      const q: any = { limit: 100 };
      if (selectedBranchB2c && selectedBranchB2c !== "All Branches") q.branch = selectedBranchB2c;
      if (selectedTypeB2c && selectedTypeB2c !== "All Types") q.tier = selectedTypeB2c;
      return api.get<any>("/b2c-partners", q);
    },
  });

  const b2bPartners: any[] = Array.isArray(b2bRes?.data) ? b2bRes.data : [];
  const b2bStats = (b2bRes as any)?.stats || {
    totalPartners: b2bPartners.length || 4,
    totalRevenue: 2550000,
    partnerEarnings: 785500,
    adminEarnings: 1764500,
    payoutBalance: 162500,
  };

  const b2cPartners: any[] = Array.isArray(b2cRes?.data) ? b2cRes.data : [];
  const b2cStats = (b2cRes as any)?.stats || {
    totalPartners: b2cPartners.length || 4,
    totalReferrals: 23,
    successfulAdmissions: 15,
    totalEarnings: 230000,
    payoutBalance: 55000,
  };

  // ----------------------------------------------------
  // B2B Mutations
  // ----------------------------------------------------
  const updateB2bProfitShare = useMutation({
    mutationFn: async () => api.put(`/b2b-partners/${selectedB2bPartner.id}/profit-share`, b2bProfitForm),
    onSuccess: (res: any) => {
      qc.invalidateQueries({ queryKey: ["b2b-partners"] });
      setB2bProfitModalOpen(false);
      toast.success(res?.message || "B2B profit share updated successfully!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to update profit share"),
  });

  const createB2bPartner = useMutation({
    mutationFn: async () => api.post("/b2b-partners", b2bAddForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["b2b-partners"] });
      setB2bAddModalOpen(false);
      toast.success("New B2B Partner added successfully!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to create partner"),
  });

  const updateB2bPartner = useMutation({
    mutationFn: async () => api.put(`/b2b-partners/${selectedB2bPartner.id}`, b2bEditForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["b2b-partners"] });
      setB2bEditModalOpen(false);
      toast.success("B2B Partner details updated!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to update partner"),
  });

  const deleteB2bPartner = useMutation({
    mutationFn: async (id: number) => api.del(`/b2b-partners/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["b2b-partners"] });
      toast.success("B2B Partner removed");
    },
    onError: (e: any) => toast.error(e.message || "Failed to delete partner"),
  });

  const releaseB2bPayout = useMutation({
    mutationFn: async () => {
      const remainingBalance = Math.max(0, (selectedB2bPartner.payout_balance || 0) - b2bPayoutAmount);
      return api.put(`/b2b-partners/${selectedB2bPartner.id}`, { payout_balance: remainingBalance });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["b2b-partners"] });
      setB2bPayoutModalOpen(false);
      toast.success(`B2B Payout of ₹ ${b2bPayoutAmount.toLocaleString("en-IN")} recorded!`);
    },
    onError: (e: any) => toast.error(e.message || "Failed to record payout"),
  });

  // ----------------------------------------------------
  // B2C Mutations
  // ----------------------------------------------------
  const updateB2cReward = useMutation({
    mutationFn: async () => api.put(`/b2c-partners/${selectedB2cPartner.id}/profit-share`, b2cRewardForm),
    onSuccess: (res: any) => {
      qc.invalidateQueries({ queryKey: ["b2c-partners"] });
      setB2cRewardModalOpen(false);
      toast.success(res?.message || "B2C referral reward model updated!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to update reward model"),
  });

  const createB2cPartner = useMutation({
    mutationFn: async () => api.post("/b2c-partners", b2cAddForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["b2c-partners"] });
      setB2cAddModalOpen(false);
      toast.success("New B2C Ambassador registered successfully!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to register B2C ambassador"),
  });

  const updateB2cPartner = useMutation({
    mutationFn: async () => api.put(`/b2c-partners/${selectedB2cPartner.id}`, b2cEditForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["b2c-partners"] });
      setB2cEditModalOpen(false);
      toast.success("B2C Ambassador updated!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to update ambassador"),
  });

  const deleteB2cPartner = useMutation({
    mutationFn: async (id: number) => api.del(`/b2c-partners/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["b2c-partners"] });
      toast.success("B2C Ambassador deleted");
    },
    onError: (e: any) => toast.error(e.message || "Failed to delete"),
  });

  const releaseB2cPayout = useMutation({
    mutationFn: async () => {
      const remainingBalance = Math.max(0, (selectedB2cPartner.payout_balance || 0) - b2cPayoutAmount);
      return api.put(`/b2c-partners/${selectedB2cPartner.id}`, { payout_balance: remainingBalance });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["b2c-partners"] });
      setB2cPayoutModalOpen(false);
      toast.success(`Referral incentive of ₹ ${b2cPayoutAmount.toLocaleString("en-IN")} recorded!`);
    },
    onError: (e: any) => toast.error(e.message || "Failed to record payout"),
  });

  // Filtered lists
  const filteredB2b = useMemo(() => {
    return b2bPartners.filter((p: any) => {
      const q = searchB2b.toLowerCase();
      if (q && !p.company_name?.toLowerCase().includes(q) && !p.name?.toLowerCase().includes(q) && !p.city?.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [b2bPartners, searchB2b]);

  const filteredB2c = useMemo(() => {
    return b2cPartners.filter((p: any) => {
      const q = searchB2c.toLowerCase();
      if (q && !p.name?.toLowerCase().includes(q) && !p.ambassador_type?.toLowerCase().includes(q) && !p.city?.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [b2cPartners, searchB2c]);

  // Modal openers
  const openB2bProfit = (partner: any) => {
    setSelectedB2bPartner(partner);
    setB2bProfitForm({
      partner_share_pct: parseFloat(partner.partner_share_pct) || 25,
      profit_share_type: partner.profit_share_type || "percentage",
      flat_rate_amount: partner.flat_rate_amount || 25000,
      tier: partner.tier || `${partner.partner_share_pct}% Partner Share`,
    });
    setB2bProfitModalOpen(true);
  };

  const openB2bEdit = (partner: any) => {
    setSelectedB2bPartner(partner);
    setB2bEditForm({
      name: partner.name,
      company_name: partner.company_name,
      email: partner.email,
      phone: partner.phone,
      city: partner.city,
      branch: partner.branch,
      status: partner.status || "Active",
      notes: partner.notes || "",
    });
    setB2bEditModalOpen(true);
  };

  const openB2bPayout = (partner: any) => {
    setSelectedB2bPartner(partner);
    setB2bPayoutAmount(parseInt(partner.payout_balance, 10) || 10000);
    setB2bPayoutNotes(`Profit payout for student admissions via ${partner.company_name}`);
    setB2bPayoutModalOpen(true);
  };

  const openB2cReward = (partner: any) => {
    setSelectedB2cPartner(partner);
    setB2cRewardForm({
      reward_amount: partner.reward_amount || 15000,
      reward_pct: partner.reward_pct || 10,
      reward_type: partner.reward_type || "flat_rate",
      tier: partner.tier || "Silver Ambassador",
    });
    setB2cRewardModalOpen(true);
  };

  const openB2cEdit = (partner: any) => {
    setSelectedB2cPartner(partner);
    setB2cEditForm({
      name: partner.name,
      ambassador_type: partner.ambassador_type || "Student Ambassador",
      email: partner.email,
      phone: partner.phone,
      city: partner.city,
      branch: partner.branch || "Guwahati HQ",
      payout_mode: partner.payout_mode || "UPI / Bank NEFT",
      status: partner.status || "Active",
      notes: partner.notes || "",
    });
    setB2cEditModalOpen(true);
  };

  const openB2cPayout = (partner: any) => {
    setSelectedB2cPartner(partner);
    setB2cPayoutAmount(parseInt(partner.payout_balance, 10) || 15000);
    setB2cPayoutNotes(`Referral reward payout for student referral via ${partner.name}`);
    setB2cPayoutModalOpen(true);
  };

  // ----------------------------------------------------
  // Staff Role Protection
  // ----------------------------------------------------
  if (isStaff) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
        <Card className="max-w-md w-full p-6 sm:p-8 rounded-2xl shadow-xl border-slate-200 bg-white space-y-5">
          <div className="h-16 w-16 rounded-2xl bg-red-50 text-[#E52E20] flex items-center justify-center mx-auto shadow-inner border border-red-100">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-bold px-3 py-1 text-xs">
              Management Restricted Area
            </Badge>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Access Restricted</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              The <strong>Partner Profit Sharing & Margins</strong> module contains confidential company commission structures, B2B percentage splits, and B2C referral incentives.
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Logged in as:</span>
              <span className="font-bold text-slate-900">{user?.name || "Staff Member"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Role:</span>
              <span className="font-mono text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {(user?.role || "Staff").toUpperCase().replace(/_/g, " ")}
              </span>
            </div>
          </div>
          <Button asChild className="w-full rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-bold text-xs h-10 shadow-sm">
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={activeTab === "b2b" ? "B2B Partner Profit Sharing & Margins" : "B2C Student & Ambassador Profit Sharing"}
        description={
          activeTab === "b2b"
            ? "Admin Control: Configure how much profit share each B2B sub-agent receives on student admissions and university commissions."
            : "Admin Control: Configure direct student ambassador incentives, alumni referral bonuses & customer profit-share margins."
        }
        actions={
          <div className="flex items-center gap-2">
            {activeTab === "b2b" ? (
              <Button
                className="rounded-xl bg-[#E52E20] hover:bg-[#c92418] text-white shadow-sm font-semibold"
                onClick={() => setB2bAddModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add B2B Partner
              </Button>
            ) : (
              <Button
                className="rounded-xl bg-[#E52E20] hover:bg-[#c92418] text-white shadow-sm font-semibold"
                onClick={() => setB2cAddModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add B2C Ambassador
              </Button>
            )}
          </div>
        }
      />

      {/* ─── Top Level B2B vs B2C Switcher ─── */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
        <div className="inline-flex items-center rounded-2xl bg-slate-100 p-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => switchTab("b2b")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "b2b"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Handshake className={`h-4 w-4 ${activeTab === "b2b" ? "text-[#E52E20]" : "text-slate-400"}`} />
            <span>B2B Partner Profit Sharing</span>
            <Badge variant="outline" className="ml-1 text-[10px] font-mono px-1.5 py-0 border-slate-300">
              {b2bPartners.length}
            </Badge>
          </button>
          <button
            type="button"
            onClick={() => switchTab("b2c")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "b2c"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className={`h-4 w-4 ${activeTab === "b2c" ? "text-emerald-600" : "text-slate-400"}`} />
            <span>B2C Partner Profit Sharing</span>
            <Badge variant="outline" className="ml-1 text-[10px] font-mono px-1.5 py-0 border-slate-300">
              {b2cPartners.length}
            </Badge>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {activeTab === "b2b" ? (
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-slate-400" /> Managing Corporate Sub-Agents & Consultancies
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-emerald-600" /> Managing Direct Student Ambassadors & Alumni Referrals
            </span>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          VIEW 1: B2B PARTNER PROFIT SHARING
         ════════════════════════════════════════════════════════════════ */}
      {activeTab === "b2b" && (
        <div className="space-y-6">
          {/* Admin Profit Distribution Rule Card */}
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/90 via-white to-slate-50 p-5 shadow-soft">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white font-bold shadow-sm">
                  <Percent className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-slate-900">
                      B2B Middleman Commission Split Active
                    </h2>
                    <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                      Admin Margin Controlled
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    UniQuesta retains 100% of global university commissions. Admin configures the profit share percentage (e.g. <strong>25% – 35%</strong>) paid out to regional sub-agents, while UniQuesta retains the primary gross margin (<strong>65% – 75%</strong>).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm self-start lg:self-auto">
                <div className="text-right">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Avg. UniQuesta Retained</div>
                  <div className="text-lg font-black text-[#E52E20]">72% Net Cut</div>
                </div>
                <div className="h-9 w-px bg-slate-200" />
                <div className="text-left">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Avg. Partner Share</div>
                  <div className="text-lg font-black text-emerald-700">28% Payout</div>
                </div>
              </div>
            </div>
          </div>

          {/* B2B KPI Stats Row */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-2xl border-slate-200 bg-white shadow-soft">
              <CardContent className="flex items-center gap-3.5 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-800">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">{b2bStats.totalPartners || b2bPartners.length}</div>
                  <div className="text-xs text-muted-foreground font-medium">Active B2B Partners</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-blue-100 bg-blue-50/50 shadow-soft">
              <CardContent className="flex items-center gap-3.5 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-blue-950">₹ {Number(b2bStats.totalRevenue || 2550000).toLocaleString("en-IN")}</div>
                  <div className="text-xs text-blue-800 font-medium">Total B2B Revenue</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-emerald-100 bg-emerald-50/50 shadow-soft">
              <CardContent className="flex items-center gap-3.5 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
                  <Percent className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-emerald-950">₹ {Number(b2bStats.partnerEarnings || 785500).toLocaleString("en-IN")}</div>
                  <div className="text-xs text-emerald-800 font-medium">Partner Margin Distributed</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-amber-100 bg-amber-50/50 shadow-soft">
              <CardContent className="flex items-center gap-3.5 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-600 text-white">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-amber-950">₹ {Number(b2bStats.payoutBalance || 162500).toLocaleString("en-IN")}</div>
                  <div className="text-xs text-amber-800 font-medium">Pending Payout Balance</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* B2B Filter Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-3.5 border border-slate-200">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search B2B agency, company, contact…"
                className="pl-9 h-9 text-xs rounded-xl"
                value={searchB2b}
                onChange={(e) => setSearchB2b(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedBranchB2b} onValueChange={setSelectedBranchB2b}>
                <SelectTrigger className="h-9 w-36 text-xs rounded-xl">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Branches">All Branches</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                  <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                  <SelectItem value="Guwahati HQ">Guwahati HQ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* B2B Partners Cards Grid */}
          {b2bLoading ? (
            <div className="py-20 text-center text-xs text-slate-500">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#E52E20] mb-2" />
              Loading B2B partners and profit margins…
            </div>
          ) : filteredB2b.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed rounded-3xl border-slate-200 bg-white">
              <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No B2B partners found</p>
              <Button size="sm" className="mt-3 bg-[#E52E20] text-white" onClick={() => setB2bAddModalOpen(true)}>
                Add First B2B Partner
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredB2b.map((p: any) => {
                const partnerPct = parseFloat(p.partner_share_pct) || 25;
                const adminPct = 100 - partnerPct;
                return (
                  <Card key={p.id} className="rounded-2xl border-slate-200 bg-white shadow-soft transition hover:shadow-elevated p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-900 text-white font-bold shadow-sm">
                          <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-black text-slate-900">{p.company_name}</h3>
                            <Badge variant="outline" className="font-mono text-[10px] font-bold text-slate-600">
                              {p.code}
                            </Badge>
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-[10.5px] font-bold">
                              {p.tier || `${partnerPct}% Share`}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                            <span className="font-semibold text-slate-800">Contact: {p.name}</span>
                            <span>•</span>
                            <span>{p.email}</span>
                            <span>•</span>
                            <span>{p.phone}</span>
                            <span>•</span>
                            <span className="text-[#E52E20] font-semibold">{p.city} ({p.branch})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start lg:self-auto">
                        <Button
                          size="sm"
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                          onClick={() => openB2bProfit(p)}
                        >
                          <Sliders className="h-3.5 w-3.5 mr-1.5" /> Set Profit Share
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                          onClick={() => openB2bPayout(p)}
                        >
                          <CreditCard className="h-3.5 w-3.5 mr-1" /> Payout
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400" onClick={() => openB2bEdit(p)}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteB2bPartner.mutate(p.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Split bar & numbers */}
                    <div className="mt-4 pt-4 border-t border-slate-100 grid gap-4 lg:grid-cols-12 items-center">
                      <div className="lg:col-span-6 rounded-2xl bg-slate-50 border border-slate-200/80 p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-emerald-700">Partner Profit Share: {partnerPct}%</span>
                          <span className="text-[#E52E20]">UniQuesta Retained: {adminPct}%</span>
                        </div>
                        <div className="h-3.5 w-full rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
                          <div style={{ width: `${partnerPct}%` }} className="h-full bg-emerald-500" />
                          <div style={{ width: `${adminPct}%` }} className="h-full bg-[#E52E20]" />
                        </div>
                        <div className="text-[11px] text-slate-500 flex justify-between">
                          <span>Referred: <strong>{p.total_students || 0} Students</strong></span>
                          <span>Flat Rate: ₹ {(p.flat_rate_amount || 25000).toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      <div className="lg:col-span-6 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Revenue</div>
                          <div className="font-black text-slate-900 mt-0.5">₹ {Number(p.total_revenue || 0).toLocaleString("en-IN")}</div>
                        </div>
                        <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                          <div className="text-[10px] text-emerald-700 font-semibold uppercase">Partner Share</div>
                          <div className="font-black text-emerald-900 mt-0.5">₹ {Number(p.partner_earnings || 0).toLocaleString("en-IN")}</div>
                        </div>
                        <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
                          <div className="text-[10px] text-amber-700 font-semibold uppercase">Pending Balance</div>
                          <div className="font-black text-amber-900 mt-0.5">₹ {Number(p.payout_balance || 0).toLocaleString("en-IN")}</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          VIEW 2: B2C STUDENT & AMBASSADOR PROFIT SHARING
         ════════════════════════════════════════════════════════════════ */}
      {activeTab === "b2c" && (
        <div className="space-y-6">
          {/* B2C Model Banner */}
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/90 via-white to-slate-50 p-5 shadow-soft">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white font-bold shadow-sm">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-slate-900">
                      B2C Direct Student & Ambassador Profit Sharing
                    </h2>
                    <Badge className="bg-blue-600 text-white text-[10px] font-bold">
                      Direct Consumer Model
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    Reward verified student ambassadors, alumni peer referrers, and campus influencers. 
                    When a referred student completes admissions, the ambassador receives an instant flat cash incentive (e.g. <strong>₹ 15,000 – ₹ 25,000</strong>) or revenue margin share (<strong>10% – 15%</strong>) credited via direct UPI or Bank NEFT.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm self-start lg:self-auto">
                <div className="text-right">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Avg. Ambassador Payout</div>
                  <div className="text-lg font-black text-blue-700">₹ 15,000 / Student</div>
                </div>
                <div className="h-9 w-px bg-slate-200" />
                <div className="text-left">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">UniQuesta Retained</div>
                  <div className="text-lg font-black text-emerald-700">85% – 90% Gross Cut</div>
                </div>
              </div>
            </div>
          </div>

          {/* B2C KPI Stats Row */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-2xl border-slate-200 bg-white shadow-soft">
              <CardContent className="flex items-center gap-3.5 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-50 text-purple-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">{b2cStats.totalPartners || b2cPartners.length}</div>
                  <div className="text-xs text-muted-foreground font-medium">Active B2C Ambassadors</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-blue-100 bg-blue-50/50 shadow-soft">
              <CardContent className="flex items-center gap-3.5 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-blue-950">{b2cStats.totalReferrals || 23} Leads</div>
                  <div className="text-xs text-blue-800 font-medium">Referred Students</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-emerald-100 bg-emerald-50/50 shadow-soft">
              <CardContent className="flex items-center gap-3.5 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-emerald-950">₹ {Number(b2cStats.totalEarnings || 230000).toLocaleString("en-IN")}</div>
                  <div className="text-xs text-emerald-800 font-medium">Ambassador Rewards Distributed</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-amber-100 bg-amber-50/50 shadow-soft">
              <CardContent className="flex items-center gap-3.5 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-600 text-white">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-amber-950">₹ {Number(b2cStats.payoutBalance || 55000).toLocaleString("en-IN")}</div>
                  <div className="text-xs text-amber-800 font-medium">Pending Payout Balance</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* B2C Filter Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-3.5 border border-slate-200">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search B2C ambassador, contact, campus…"
                className="pl-9 h-9 text-xs rounded-xl"
                value={searchB2c}
                onChange={(e) => setSearchB2c(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedTypeB2c} onValueChange={setSelectedTypeB2c}>
                <SelectTrigger className="h-9 w-44 text-xs rounded-xl">
                  <SelectValue placeholder="Ambassador Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Types</SelectItem>
                  <SelectItem value="Student Ambassador">Student Ambassador</SelectItem>
                  <SelectItem value="Campus Influencer">Campus Influencer</SelectItem>
                  <SelectItem value="Freelance Counselor">Freelance Counselor</SelectItem>
                  <SelectItem value="Alumni Ambassador">Alumni Ambassador</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedBranchB2c} onValueChange={setSelectedBranchB2c}>
                <SelectTrigger className="h-9 w-36 text-xs rounded-xl">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Branches">All Branches</SelectItem>
                  <SelectItem value="Guwahati HQ">Guwahati HQ</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                  <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* B2C Ambassadors Cards Grid */}
          {b2cLoading ? (
            <div className="py-20 text-center text-xs text-slate-500">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#E52E20] mb-2" />
              Loading B2C ambassadors and referral margins…
            </div>
          ) : filteredB2c.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed rounded-3xl border-slate-200 bg-white">
              <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No B2C ambassadors found</p>
              <Button size="sm" className="mt-3 bg-[#E52E20] text-white" onClick={() => setB2cAddModalOpen(true)}>
                Add First B2C Ambassador
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredB2c.map((p: any) => {
                const rewardAmount = p.reward_amount || 15000;
                const rewardPct = p.reward_pct || 10;
                const isFlat = p.reward_type !== "percentage";
                return (
                  <Card key={p.id} className="rounded-2xl border-slate-200 bg-white shadow-soft transition hover:shadow-elevated p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-sm shadow-sm">
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-black text-slate-900">{p.name}</h3>
                            <Badge variant="outline" className="font-mono text-[10px] font-bold text-slate-600">
                              {p.code}
                            </Badge>
                            <Badge className="bg-blue-50 text-blue-800 border-blue-200 text-[10.5px] font-bold">
                              {p.ambassador_type || "Student Ambassador"}
                            </Badge>
                            <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10.5px] font-bold">
                              {p.tier || "Silver Ambassador"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                            <span>{p.email}</span>
                            <span>•</span>
                            <span>{p.phone}</span>
                            <span>•</span>
                            <span className="text-slate-800 font-semibold">{p.city} ({p.branch})</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-mono font-medium">Payout Mode: {p.payout_mode || "UPI"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start lg:self-auto">
                        <Button
                          size="sm"
                          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                          onClick={() => openB2cReward(p)}
                        >
                          <Sliders className="h-3.5 w-3.5 mr-1.5" /> Set Referral Reward
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                          onClick={() => openB2cPayout(p)}
                        >
                          <CreditCard className="h-3.5 w-3.5 mr-1" /> Payout
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400" onClick={() => openB2cEdit(p)}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteB2cPartner.mutate(p.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Performance & Financials */}
                    <div className="mt-4 pt-4 border-t border-slate-100 grid gap-4 lg:grid-cols-12 items-center">
                      <div className="lg:col-span-6 rounded-2xl bg-blue-50/50 border border-blue-100 p-3 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                          <span className="text-blue-800">
                            Reward Model: {isFlat ? `₹ ${rewardAmount.toLocaleString("en-IN")} Fixed / Admission` : `${rewardPct}% Commission Split`}
                          </span>
                          <span className="text-emerald-700 font-semibold">
                            {p.successful_admissions || 0} Admissions Enrolled
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {p.notes || "Active B2C student ambassador for university referral program."}
                        </p>
                      </div>

                      <div className="lg:col-span-6 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Referrals</div>
                          <div className="font-black text-slate-900 mt-0.5">{p.total_referrals || 0} Students</div>
                        </div>
                        <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                          <div className="text-[10px] text-emerald-700 font-semibold uppercase">Total Earned</div>
                          <div className="font-black text-emerald-900 mt-0.5">₹ {Number(p.total_earnings || 0).toLocaleString("en-IN")}</div>
                        </div>
                        <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
                          <div className="text-[10px] text-amber-700 font-semibold uppercase">Pending Balance</div>
                          <div className="font-black text-amber-900 mt-0.5">₹ {Number(p.payout_balance || 0).toLocaleString("en-IN")}</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODALS: B2B MODALS
         ════════════════════════════════════════════════════════════════ */}
      {/* Configure B2B Profit Share Modal */}
      <Dialog open={b2bProfitModalOpen} onOpenChange={setB2bProfitModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Configure B2B Profit Share</DialogTitle>
            <DialogDescription className="text-xs">
              Adjust the commission percentage or flat rate split for {selectedB2bPartner?.company_name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span>Partner Profit Share:</span>
                <span className="text-emerald-600 text-sm font-black">{b2bProfitForm.partner_share_pct}%</span>
              </div>
              <Slider
                value={[b2bProfitForm.partner_share_pct]}
                min={10}
                max={60}
                step={5}
                onValueChange={(val) => setB2bProfitForm({ ...b2bProfitForm, partner_share_pct: val[0] })}
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Min 10%</span>
                <span>Default 25%</span>
                <span>Max 60%</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 border text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Partner Receives:</span>
                <span className="font-bold text-emerald-600">{b2bProfitForm.partner_share_pct}% of Commission</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">UniQuesta Retains:</span>
                <span className="font-bold text-[#E52E20]">{100 - b2bProfitForm.partner_share_pct}% Net Margin</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tier Category</Label>
              <Select value={b2bProfitForm.tier} onValueChange={(v) => setB2bProfitForm({ ...b2bProfitForm, tier: v })}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Associate Partner (20%)">Associate Partner (20%)</SelectItem>
                  <SelectItem value="Silver Partner (25%)">Silver Partner (25%)</SelectItem>
                  <SelectItem value="Gold Partner (30%)">Gold Partner (30%)</SelectItem>
                  <SelectItem value="Platinum Partner (35%)">Platinum Partner (35%)</SelectItem>
                  <SelectItem value="Equal Split (50%)">Equal Split (50%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setB2bProfitModalOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => updateB2bProfitShare.mutate()}>
              Save Split Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add B2B Partner Modal */}
      <Dialog open={b2bAddModalOpen} onOpenChange={setB2bAddModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add New B2B Partner</DialogTitle>
            <DialogDescription className="text-xs">
              Register an educational consultancy, sub-agent or coaching partner with profit sharing terms.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2 text-xs">
            <div className="grid gap-1">
              <Label className="text-xs font-semibold">Company / Agency Name *</Label>
              <Input
                placeholder="e.g. Apex Global Overseas Education"
                value={b2bAddForm.company_name}
                onChange={(e) => setB2bAddForm({ ...b2bAddForm, company_name: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">Contact Person *</Label>
                <Input
                  placeholder="e.g. Rahul Deshmukh"
                  value={b2bAddForm.name}
                  onChange={(e) => setB2bAddForm({ ...b2bAddForm, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">Email *</Label>
                <Input
                  placeholder="contact@agency.com"
                  value={b2bAddForm.email}
                  onChange={(e) => setB2bAddForm({ ...b2bAddForm, email: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">Phone *</Label>
                <Input
                  placeholder="+91 98200 12345"
                  value={b2bAddForm.phone}
                  onChange={(e) => setB2bAddForm({ ...b2bAddForm, phone: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">City *</Label>
                <Input
                  placeholder="e.g. Mumbai"
                  value={b2bAddForm.city}
                  onChange={(e) => setB2bAddForm({ ...b2bAddForm, city: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">Assigned Branch</Label>
                <Select value={b2bAddForm.branch} onValueChange={(v) => setB2bAddForm({ ...b2bAddForm, branch: v })}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                    <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                    <SelectItem value="Guwahati HQ">Guwahati HQ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">Profit Share Percentage</Label>
                <Input
                  type="number"
                  placeholder="e.g. 25"
                  value={b2bAddForm.partner_share_pct}
                  onChange={(e) => setB2bAddForm({ ...b2bAddForm, partner_share_pct: Number(e.target.value) })}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setB2bAddModalOpen(false)}>Cancel</Button>
            <Button
              size="sm"
              className="bg-[#E52E20] text-white"
              disabled={!b2bAddForm.company_name || !b2bAddForm.name || !b2bAddForm.email || createB2bPartner.isPending}
              onClick={() => createB2bPartner.mutate()}
            >
              {createB2bPartner.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Save B2B Partner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit B2B Partner Modal */}
      <Dialog open={b2bEditModalOpen} onOpenChange={setB2bEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Edit B2B Partner Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2 text-xs">
            <div className="grid gap-1">
              <Label className="text-xs font-semibold">Company Name</Label>
              <Input
                value={b2bEditForm.company_name}
                onChange={(e) => setB2bEditForm({ ...b2bEditForm, company_name: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
            <div className="grid gap-1">
              <Label className="text-xs font-semibold">Contact Person</Label>
              <Input
                value={b2bEditForm.name}
                onChange={(e) => setB2bEditForm({ ...b2bEditForm, name: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">Email</Label>
                <Input
                  value={b2bEditForm.email}
                  onChange={(e) => setB2bEditForm({ ...b2bEditForm, email: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">Phone</Label>
                <Input
                  value={b2bEditForm.phone}
                  onChange={(e) => setB2bEditForm({ ...b2bEditForm, phone: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setB2bEditModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => updateB2bPartner.mutate()} disabled={updateB2bPartner.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record B2B Payout Modal */}
      <Dialog open={b2bPayoutModalOpen} onOpenChange={setB2bPayoutModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Release B2B Partner Payout</DialogTitle>
            <DialogDescription className="text-xs">
              Record a commission profit payout to {selectedB2bPartner?.company_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-xl bg-slate-50 p-3 flex justify-between border">
              <span className="text-slate-500">Current Payout Balance:</span>
              <span className="font-bold text-amber-700">₹ {Number(selectedB2bPartner?.payout_balance || 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold">Payout Amount (₹) *</Label>
              <Input
                type="number"
                value={b2bPayoutAmount}
                onChange={(e) => setB2bPayoutAmount(Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold">Notes / UTR Reference</Label>
              <Input
                value={b2bPayoutNotes}
                onChange={(e) => setB2bPayoutNotes(e.target.value)}
                placeholder="NEFT transaction or cheque number…"
                className="h-9 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setB2bPayoutModalOpen(false)}>Cancel</Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              onClick={() => releaseB2bPayout.mutate()}
              disabled={b2bPayoutAmount <= 0 || releaseB2bPayout.isPending}
            >
              {releaseB2bPayout.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Confirm Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════
          MODALS: B2C MODALS
         ════════════════════════════════════════════════════════════════ */}
      {/* Configure B2C Reward Modal */}
      <Dialog open={b2cRewardModalOpen} onOpenChange={setB2cRewardModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Configure B2C Referral Reward</DialogTitle>
            <DialogDescription className="text-xs">
              Set the per-student incentive or profit share for {selectedB2cPartner?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Reward Structure Type</Label>
              <Select
                value={b2cRewardForm.reward_type}
                onValueChange={(v) => setB2cRewardForm({ ...b2cRewardForm, reward_type: v })}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat_rate">Flat Cash Reward (Per Enrolled Student)</SelectItem>
                  <SelectItem value="percentage">Percentage Profit Share (% of Commission)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {b2cRewardForm.reward_type === "flat_rate" ? (
              <div className="space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Fixed Reward Amount:</span>
                  <span className="text-blue-600 text-sm font-black">₹ {b2cRewardForm.reward_amount.toLocaleString("en-IN")}</span>
                </div>
                <Slider
                  value={[b2cRewardForm.reward_amount]}
                  min={5000}
                  max={50000}
                  step={2500}
                  onValueChange={(val) => setB2cRewardForm({ ...b2cRewardForm, reward_amount: val[0] })}
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>₹ 5,000</span>
                  <span>Standard ₹ 15,000</span>
                  <span>₹ 50,000</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Commission Share Percentage:</span>
                  <span className="text-emerald-600 text-sm font-black">{b2cRewardForm.reward_pct}%</span>
                </div>
                <Slider
                  value={[b2cRewardForm.reward_pct]}
                  min={5}
                  max={25}
                  step={1}
                  onValueChange={(val) => setB2cRewardForm({ ...b2cRewardForm, reward_pct: val[0] })}
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>5%</span>
                  <span>Standard 10%</span>
                  <span>25%</span>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Ambassador Tier</Label>
              <Select value={b2cRewardForm.tier} onValueChange={(v) => setB2cRewardForm({ ...b2cRewardForm, tier: v })}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Associate Ambassador">Associate Ambassador</SelectItem>
                  <SelectItem value="Silver Ambassador">Silver Ambassador</SelectItem>
                  <SelectItem value="Gold Ambassador">Gold Ambassador</SelectItem>
                  <SelectItem value="Platinum Ambassador">Platinum Ambassador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setB2cRewardModalOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold" onClick={() => updateB2cReward.mutate()}>
              Save Reward Model
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add B2C Ambassador Modal */}
      <Dialog open={b2cAddModalOpen} onOpenChange={setB2cAddModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add B2C Student Ambassador</DialogTitle>
            <DialogDescription className="text-xs">
              Register a student ambassador, alumni peer, or campus influencer for referral profit sharing.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">Full Name *</Label>
                <Input
                  placeholder="e.g. Aarav Sharma"
                  value={b2cAddForm.name}
                  onChange={(e) => setB2cAddForm({ ...b2cAddForm, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">Ambassador Category</Label>
                <Select
                  value={b2cAddForm.ambassador_type}
                  onValueChange={(v) => setB2cAddForm({ ...b2cAddForm, ambassador_type: v })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student Ambassador">Student Ambassador</SelectItem>
                    <SelectItem value="Campus Influencer">Campus Influencer</SelectItem>
                    <SelectItem value="Freelance Counselor">Freelance Counselor</SelectItem>
                    <SelectItem value="Alumni Ambassador">Alumni Ambassador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">Email *</Label>
                <Input
                  placeholder="aarav@gmail.com"
                  value={b2cAddForm.email}
                  onChange={(e) => setB2cAddForm({ ...b2cAddForm, email: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">Phone *</Label>
                <Input
                  placeholder="+91 98640 12345"
                  value={b2cAddForm.phone}
                  onChange={(e) => setB2cAddForm({ ...b2cAddForm, phone: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">City *</Label>
                <Input
                  placeholder="e.g. Guwahati"
                  value={b2cAddForm.city}
                  onChange={(e) => setB2cAddForm({ ...b2cAddForm, city: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">Branch</Label>
                <Select
                  value={b2cAddForm.branch}
                  onValueChange={(v) => setB2cAddForm({ ...b2cAddForm, branch: v })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Guwahati HQ">Guwahati HQ</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                    <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">Reward Amount (₹)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 15000"
                  value={b2cAddForm.reward_amount}
                  onChange={(e) => setB2cAddForm({ ...b2cAddForm, reward_amount: Number(e.target.value) })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">Payout Account / UPI Mode</Label>
                <Input
                  placeholder="e.g. UPI (aarav@oksbi)"
                  value={b2cAddForm.payout_mode}
                  onChange={(e) => setB2cAddForm({ ...b2cAddForm, payout_mode: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid gap-1">
              <Label className="text-xs font-semibold">Notes / College Details</Label>
              <Input
                placeholder="e.g. 3rd year student at University of Toronto / Cotton University"
                value={b2cAddForm.notes}
                onChange={(e) => setB2cAddForm({ ...b2cAddForm, notes: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setB2cAddModalOpen(false)}>Cancel</Button>
            <Button
              size="sm"
              className="bg-[#E52E20] text-white"
              disabled={!b2cAddForm.name || !b2cAddForm.email || !b2cAddForm.city || createB2cPartner.isPending}
              onClick={() => createB2cPartner.mutate()}
            >
              {createB2cPartner.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Save Ambassador
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit B2C Ambassador Modal */}
      <Dialog open={b2cEditModalOpen} onOpenChange={setB2cEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Edit Ambassador Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2 text-xs">
            <div className="grid gap-1">
              <Label className="text-xs font-semibold">Full Name</Label>
              <Input
                value={b2cEditForm.name}
                onChange={(e) => setB2cEditForm({ ...b2cEditForm, name: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">Email</Label>
                <Input
                  value={b2cEditForm.email}
                  onChange={(e) => setB2cEditForm({ ...b2cEditForm, email: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs font-semibold">Phone</Label>
                <Input
                  value={b2cEditForm.phone}
                  onChange={(e) => setB2cEditForm({ ...b2cEditForm, phone: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs font-semibold">Payout Account / UPI</Label>
              <Input
                value={b2cEditForm.payout_mode}
                onChange={(e) => setB2cEditForm({ ...b2cEditForm, payout_mode: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setB2cEditModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => updateB2cPartner.mutate()} disabled={updateB2cPartner.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record B2C Payout Modal */}
      <Dialog open={b2cPayoutModalOpen} onOpenChange={setB2cPayoutModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Release B2C Referral Payout</DialogTitle>
            <DialogDescription className="text-xs">
              Record a referral incentive payout to {selectedB2cPartner?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-xl bg-slate-50 p-3 flex justify-between border">
              <span className="text-slate-500">Pending Referral Balance:</span>
              <span className="font-bold text-amber-700">₹ {Number(selectedB2cPartner?.payout_balance || 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold">Payout Amount (₹) *</Label>
              <Input
                type="number"
                value={b2cPayoutAmount}
                onChange={(e) => setB2cPayoutAmount(Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold">Payout Destination</Label>
              <div className="rounded-lg bg-emerald-50/70 p-2 text-emerald-800 font-mono text-[11px] border border-emerald-100">
                Mode: {selectedB2cPartner?.payout_mode || "UPI (Direct Transfer)"}
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold">Transaction Reference / Notes</Label>
              <Input
                value={b2cPayoutNotes}
                onChange={(e) => setB2cPayoutNotes(e.target.value)}
                placeholder="UPI Ref ID or Bank NEFT UTR…"
                className="h-9 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setB2cPayoutModalOpen(false)}>Cancel</Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              onClick={() => releaseB2cPayout.mutate()}
              disabled={b2cPayoutAmount <= 0 || releaseB2cPayout.isPending}
            >
              {releaseB2cPayout.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Confirm Referral Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
