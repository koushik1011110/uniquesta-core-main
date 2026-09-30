import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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
} from "lucide-react";
import { Link } from "@tanstack/react-router";
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
      { title: "Partner Profit Sharing & Margins · Uniquesta ERP" },
      {
        name: "description",
        content: "Admin management for B2B partner commission splits and profit sharing margins.",
      },
      { property: "og:title", content: "Partner Profit Sharing & Margins · Uniquesta ERP" },
      { property: "og:description", content: "Configure partner profit margins and commission share." },
    ],
  }),
  component: PartnerProfitManagementPage,
});

function PartnerProfitManagementPage() {
  const qc = useQueryClient();
  const user = getUser();
  const isStaff = isStaffRole(user);

  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedTier, setSelectedTier] = useState("All Tiers");

  // Modals
  const [profitModalOpen, setProfitModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  // Profit Share Form state
  const [profitForm, setProfitForm] = useState({
    partner_share_pct: 25,
    profit_share_type: "percentage",
    flat_rate_amount: 25000,
    tier: "Silver Partner (25%)",
  });

  // Add Partner Form state
  const [addForm, setAddForm] = useState({
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

  // Edit Partner Form state
  const [editForm, setEditForm] = useState({
    name: "",
    company_name: "",
    email: "",
    phone: "",
    city: "",
    branch: "Mumbai",
    status: "Active",
    notes: "",
  });

  // Payout Form
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [payoutNotes, setPayoutNotes] = useState("");

  // Fetch partners (disabled for staff)
  const { data: partnersRes, isLoading } = useQuery({
    queryKey: ["b2b-partners", selectedBranch, selectedTier],
    enabled: !isStaff,
    queryFn: async () => {
      const q: any = { limit: 100 };
      if (selectedBranch && selectedBranch !== "All Branches") q.branch = selectedBranch;
      if (selectedTier && selectedTier !== "All Tiers") q.tier = selectedTier;
      const res: any = await api.get<any>("/b2b-partners", q);
      return res;
    },
  });

  const partners: any[] = Array.isArray(partnersRes?.data) ? partnersRes.data : [];
  const stats = partnersRes?.stats || {
    totalPartners: partners.length || 5,
    totalRevenue: 2225000,
    partnerEarnings: 656250,
    adminEarnings: 1568750,
    payoutBalance: 162500,
  };

  // Profit Share Preset Tiers
  const PRESET_TIERS = [
    { label: "Associate (20%)", pct: 20 },
    { label: "Silver (25%)", pct: 25 },
    { label: "Gold (30%)", pct: 30 },
    { label: "Platinum (35%)", pct: 35 },
    { label: "Equal 50-50 (50%)", pct: 50 },
  ];

  // Open Profit Share Config Modal
  const openProfitModal = (partner: any) => {
    setSelectedPartner(partner);
    setProfitForm({
      partner_share_pct: parseFloat(partner.partner_share_pct) || 25,
      profit_share_type: partner.profit_share_type || "percentage",
      flat_rate_amount: partner.flat_rate_amount || 25000,
      tier: partner.tier || `${partner.partner_share_pct}% Partner Share`,
    });
    setProfitModalOpen(true);
  };

  // Open Edit Partner Modal
  const openEditModal = (partner: any) => {
    setSelectedPartner(partner);
    setEditForm({
      name: partner.name,
      company_name: partner.company_name,
      email: partner.email,
      phone: partner.phone,
      city: partner.city,
      branch: partner.branch,
      status: partner.status || "Active",
      notes: partner.notes || "",
    });
    setEditModalOpen(true);
  };

  // Open Payout Modal
  const openPayoutModal = (partner: any) => {
    setSelectedPartner(partner);
    setPayoutAmount(parseInt(partner.payout_balance, 10) || 10000);
    setPayoutNotes(`Profit payout for student admissions via ${partner.company_name}`);
    setPayoutModalOpen(true);
  };

  // Update Profit Share Mutation
  const updateProfitShare = useMutation({
    mutationFn: async () => {
      return api.put(`/b2b-partners/${selectedPartner.id}/profit-share`, profitForm);
    },
    onSuccess: (res: any) => {
      qc.invalidateQueries({ queryKey: ["b2b-partners"] });
      setProfitModalOpen(false);
      toast.success(
        res?.message || `Profit share updated to ${profitForm.partner_share_pct}% for ${selectedPartner.company_name}!`
      );
    },
    onError: (e: any) => toast.error(e.message || "Failed to update profit share"),
  });

  // Create Partner Mutation
  const createPartner = useMutation({
    mutationFn: async () => api.post("/b2b-partners", addForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["b2b-partners"] });
      setAddModalOpen(false);
      toast.success("New B2B Partner added successfully with profit share configuration!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to create partner"),
  });

  // Edit Partner Mutation
  const updatePartner = useMutation({
    mutationFn: async () => api.put(`/b2b-partners/${selectedPartner.id}`, editForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["b2b-partners"] });
      setEditModalOpen(false);
      toast.success("Partner details updated!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to update partner"),
  });

  // Delete Partner Mutation
  const deletePartner = useMutation({
    mutationFn: async (id: number) => api.del(`/b2b-partners/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["b2b-partners"] });
      toast.success("Partner removed");
    },
    onError: (e: any) => toast.error(e.message || "Failed to delete partner"),
  });

  // Release Payout Mutation
  const releasePayout = useMutation({
    mutationFn: async () => {
      const remainingBalance = Math.max(0, (selectedPartner.payout_balance || 0) - payoutAmount);
      return api.put(`/b2b-partners/${selectedPartner.id}`, {
        payout_balance: remainingBalance,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["b2b-partners"] });
      setPayoutModalOpen(false);
      toast.success(`Payout of ₹ ${payoutAmount.toLocaleString("en-IN")} recorded successfully!`);
    },
    onError: (e: any) => toast.error(e.message || "Failed to record payout"),
  });

  // Filtered partners list
  const filteredPartners = useMemo(() => {
    return partners.filter((p: any) => {
      const q = search.toLowerCase();
      if (
        q &&
        !p.company_name?.toLowerCase().includes(q) &&
        !p.name?.toLowerCase().includes(q) &&
        !p.city?.toLowerCase().includes(q) &&
        !p.code?.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [partners, search]);

  const totalRev = parseInt(stats.totalRevenue, 10) || 2225000;
  const partnerEarn = parseInt(stats.partnerEarnings, 10) || 656250;
  const adminEarn = parseInt(stats.adminEarnings, 10) || 1568750;
  const adminMarginPct = totalRev > 0 ? Math.round((adminEarn / totalRev) * 100) : 70;

  if (isStaff) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <Card className="max-w-md w-full p-6 sm:p-8 rounded-2xl shadow-xl border-slate-200 bg-white space-y-5">
          <div className="h-16 w-16 rounded-2xl bg-red-50 text-[#E52E20] flex items-center justify-center mx-auto shadow-inner border border-red-100">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-bold px-3 py-1 text-xs">
              Management Restricted Area
            </Badge>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Access Restricted
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              The <strong>Partner Profit Sharing & Margins</strong> module contains confidential company commission structures, B2B percentage splits, and revenue distributions.
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
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Permission:</span>
              <span className="font-semibold text-red-600">Restricted (Admins & Management Only)</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button asChild className="w-full rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-bold text-xs h-10 shadow-sm">
              <Link to="/">Return to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="w-full rounded-xl border-slate-200 text-slate-700 font-medium text-xs h-10">
              <Link to="/leads">Go to Student Leads ➔</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Partner Profit Sharing & Margins"
        description="Admin Control: Configure how much profit share each B2B sub-agent receives on student admissions and university commissions."
        actions={
          <Button
            className="rounded-xl bg-[#E52E20] hover:bg-[#c92418] text-white shadow-sm font-semibold"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1.5" /> Add B2B Partner
          </Button>
        }
      />

      {/* Admin Profit Distribution Rule Card */}
      <div className="mb-6 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/90 via-white to-slate-50 p-5 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white font-bold shadow-sm">
              <Percent className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">
                  Middleman Profit Sharing Model Active
                </h2>
                <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                  Admin Margin Controlled
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                As the master admissions & travel partner, UniQuesta receives 100% of the university commission or service margin.
                Admin decides each partner&apos;s profit share (e.g. <strong>25% – 35%</strong>), while UniQuesta automatically retains the rest (<strong>65% – 75%</strong>).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm self-start lg:self-auto">
            <div className="text-right">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Avg. UniQuesta Retained Margin</div>
              <div className="text-lg font-black text-[#E52E20]">{adminMarginPct}% Net Cut</div>
            </div>
            <div className="h-9 w-px bg-slate-200" />
            <div className="text-left">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Avg. Partner Profit Share</div>
              <div className="text-lg font-black text-emerald-700">{100 - adminMarginPct}% Payout</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-slate-200 bg-white shadow-soft">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-800">
              <Handshake className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">{stats.totalPartners || partners.length}</div>
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
              <div className="text-xl font-black text-blue-950">₹ {totalRev.toLocaleString("en-IN")}</div>
              <div className="text-xs text-blue-800 font-medium">Total Partner Revenue</div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-emerald-100 bg-emerald-50/50 shadow-soft">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black text-emerald-950">₹ {partnerEarn.toLocaleString("en-IN")}</div>
              <div className="text-xs text-emerald-800 font-medium">Partner Profit Distributed</div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-red-100 bg-red-50/50 shadow-soft">
          <CardContent className="flex items-center gap-3.5 p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E52E20] text-white">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black text-red-950">₹ {adminEarn.toLocaleString("en-IN")}</div>
              <div className="text-xs text-red-800 font-medium">UniQuesta Retained Margin</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search partner, company, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 text-xs rounded-xl w-[220px] sm:w-[260px]"
            />
          </div>

          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="h-9 text-xs rounded-xl w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["All Branches", "Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Guwahati HQ"].map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTier} onValueChange={setSelectedTier}>
            <SelectTrigger className="h-9 text-xs rounded-xl w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["All Tiers", "Gold", "Silver", "Platinum", "Associate"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredPartners.length}</strong> partners
        </div>
      </div>

      {/* Partners List / Table */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#E52E20]" />
            <span>Loading B2B partners and profit margins...</span>
          </div>
        ) : filteredPartners.length === 0 ? (
          <Card className="p-8 text-center rounded-2xl border-dashed">
            <p className="text-sm text-slate-500">No B2B partners found matching your filters.</p>
          </Card>
        ) : (
          filteredPartners.map((p: any) => {
            const partnerPct = parseFloat(p.partner_share_pct) || 25;
            const adminPct = 100 - partnerPct;
            const pEarned = parseInt(p.partner_earnings, 10) || 0;
            const aEarned = parseInt(p.admin_earnings, 10) || 0;
            const pRev = parseInt(p.total_revenue, 10) || 0;
            const pBal = parseInt(p.payout_balance, 10) || 0;

            return (
              <Card
                key={p.id}
                className="rounded-3xl border border-slate-200/90 bg-white shadow-soft hover:shadow-card transition overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Partner Basic Info */}
                    <div className="flex items-start gap-3.5">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-900 text-white font-black text-sm shadow">
                        {p.company_name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-black text-slate-900">{p.company_name}</h3>
                          <Badge variant="outline" className="rounded-md border-slate-200 text-[10px] font-mono font-bold text-slate-600">
                            {p.code}
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-[10.5px] font-bold">
                            {p.tier || `${partnerPct}% Share`}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                          <span className="font-semibold text-slate-800 flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-slate-400" /> Contact: {p.name}
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-slate-400" /> {p.email}
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 text-slate-400" /> {p.phone}
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" /> {p.city} ({p.branch})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Action Buttons */}
                    <div className="flex items-center gap-2 self-start lg:self-auto">
                      <Button
                        size="sm"
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                        onClick={() => openProfitModal(p)}
                      >
                        <Sliders className="h-3.5 w-3.5 mr-1.5" /> Set Profit Share
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                        onClick={() => openPayoutModal(p)}
                      >
                        <CreditCard className="h-3.5 w-3.5 mr-1" /> Payout
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-slate-400 hover:text-slate-900"
                        onClick={() => openEditModal(p)}
                        title="Edit Details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => deletePartner.mutate(p.id)}
                        title="Delete Partner"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Profit Share Split Bar & Financial Summary */}
                  <div className="mt-4 pt-4 border-t border-slate-100 grid gap-4 lg:grid-cols-12 items-center">
                    {/* Visual Profit Split Slider Bar (6 cols) */}
                    <div className="lg:col-span-6 rounded-2xl bg-slate-50 border border-slate-200/80 p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-emerald-700 flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                          Partner Profit Share: {partnerPct}%
                        </span>
                        <span className="text-[#E52E20] flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-[#E52E20] inline-block" />
                          UniQuesta Admin Margin: {adminPct}%
                        </span>
                      </div>

                      {/* Split Bar */}
                      <div className="h-3.5 w-full rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
                        <div
                          style={{ width: `${partnerPct}%` }}
                          className="h-full bg-emerald-500 transition-all duration-300"
                          title={`Partner gets ${partnerPct}%`}
                        />
                        <div
                          style={{ width: `${adminPct}%` }}
                          className="h-full bg-[#E52E20] transition-all duration-300"
                          title={`UniQuesta keeps ${adminPct}%`}
                        />
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Referred: <strong>{p.total_students || 0} Students</strong></span>
                        <button
                          onClick={() => openProfitModal(p)}
                          className="text-[#E52E20] hover:underline font-bold text-[11px] flex items-center gap-0.5"
                        >
                          Change Margin <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Financial Figures (6 cols) */}
                    <div className="lg:col-span-6 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                        <div className="text-[10.5px] font-bold text-slate-500 uppercase">Total Revenue</div>
                        <div className="text-sm font-black text-slate-900 mt-0.5">
                          ₹ {pRev.toLocaleString("en-IN")}
                        </div>
                      </div>

                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5">
                        <div className="text-[10.5px] font-bold text-emerald-800 uppercase">Partner Earned</div>
                        <div className="text-sm font-black text-emerald-700 mt-0.5">
                          ₹ {pEarned.toLocaleString("en-IN")}
                        </div>
                      </div>

                      <div className="rounded-xl border border-red-200 bg-red-50/70 p-2.5">
                        <div className="text-[10.5px] font-bold text-red-800 uppercase">UniQuesta Cut</div>
                        <div className="text-sm font-black text-[#E52E20] mt-0.5">
                          ₹ {aEarned.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 1: CONFIGURE PROFIT SHARE FOR PARTNER                             */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={profitModalOpen} onOpenChange={setProfitModalOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Sliders className="h-5 w-5 text-emerald-600" />
              Configure Profit Share Margin
            </DialogTitle>
            <DialogDescription className="text-xs">
              Set the profit percentage for <strong>{selectedPartner?.company_name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Live Visual Split Card */}
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-emerald-800 uppercase">Partner Receives</div>
                  <div className="text-2xl font-black text-emerald-700">
                    {profitForm.partner_share_pct}%
                  </div>
                </div>
                <div className="h-8 w-px bg-emerald-200" />
                <div className="text-right">
                  <div className="text-[11px] font-bold text-red-800 uppercase">UniQuesta Retains</div>
                  <div className="text-2xl font-black text-[#E52E20]">
                    {100 - profitForm.partner_share_pct}%
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div className="pt-2">
                <Slider
                  value={[profitForm.partner_share_pct]}
                  min={5}
                  max={80}
                  step={1}
                  onValueChange={(val) => {
                    const p = val[0];
                    setProfitForm({
                      ...profitForm,
                      partner_share_pct: p,
                      tier: `${p}% Partner Profit Share`,
                    });
                  }}
                  className="py-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>5% (Min)</span>
                  <span>50% (Equal)</span>
                  <span>80% (Max)</span>
                </div>
              </div>
            </div>

            {/* Quick Preset Tier Buttons */}
            <div>
              <Label className="text-xs font-bold text-slate-700 block mb-2">
                Quick Preset Tiers:
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_TIERS.map((tier) => (
                  <button
                    key={tier.pct}
                    type="button"
                    onClick={() =>
                      setProfitForm({
                        ...profitForm,
                        partner_share_pct: tier.pct,
                        tier: tier.label,
                      })
                    }
                    className={`rounded-xl px-2.5 py-1 text-xs font-bold border transition ${
                      profitForm.partner_share_pct === tier.pct
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Profit Simulation Calculator */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Calculator className="h-4 w-4 text-[#E52E20]" /> Live Payout Simulation:
              </div>
              <p className="text-slate-600 text-[11.5px] leading-relaxed">
                If university pays a <strong>₹ 1,00,000</strong> commission for an enrolled student:
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200 font-semibold">
                <span className="text-emerald-700">
                  Partner Profit: ₹ {((100000 * profitForm.partner_share_pct) / 100).toLocaleString("en-IN")} ({profitForm.partner_share_pct}%)
                </span>
                <span className="text-[#E52E20]">
                  UniQuesta Cut: ₹ {((100000 * (100 - profitForm.partner_share_pct)) / 100).toLocaleString("en-IN")} ({100 - profitForm.partner_share_pct}%)
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProfitModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              onClick={() => updateProfitShare.mutate()}
              disabled={updateProfitShare.isPending}
            >
              {updateProfitShare.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              Save Profit Share Margin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 2: ADD NEW B2B PARTNER                                            */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#E52E20]" /> Add New B2B Partner
            </DialogTitle>
            <DialogDescription className="text-xs">
              Register educational agent or partner consultancy and set their profit share.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3.5 py-2">
            <div className="grid gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Company / Agency Name *</Label>
              <Input
                value={addForm.company_name}
                onChange={(e) => setAddForm({ ...addForm, company_name: e.target.value })}
                placeholder="e.g. Apex Global Education Consultants"
                className="h-9 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Contact Person Name *</Label>
                <Input
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="e.g. Sanjay Barua"
                  className="h-9 rounded-xl"
                />
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">City *</Label>
                <Input
                  value={addForm.city}
                  onChange={(e) => setAddForm({ ...addForm, city: e.target.value })}
                  placeholder="e.g. Mumbai"
                  className="h-9 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Email Address *</Label>
                <Input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="contact@agency.com"
                  className="h-9 rounded-xl"
                />
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Phone Number *</Label>
                <Input
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  placeholder="+91 98200 00000"
                  className="h-9 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Affiliated Branch *</Label>
                <Select
                  value={addForm.branch}
                  onValueChange={(v) => setAddForm({ ...addForm, branch: v })}
                >
                  <SelectTrigger className="h-9 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Guwahati HQ"].map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs font-bold text-slate-700">Partner Profit Share % *</Label>
                <Input
                  type="number"
                  min={5}
                  max={80}
                  value={addForm.partner_share_pct}
                  onChange={(e) => {
                    const p = parseFloat(e.target.value) || 25;
                    setAddForm({
                      ...addForm,
                      partner_share_pct: p,
                      tier: `${p}% Partner Share`,
                    });
                  }}
                  className="h-9 rounded-xl font-bold text-emerald-700"
                />
              </div>
            </div>

            {/* Note */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">UniQuesta Margin:</span> Automatically retains{" "}
              <strong>{100 - addForm.partner_share_pct}%</strong> on every admission.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#E52E20] hover:bg-[#c92418] text-white font-bold"
              onClick={() => createPartner.mutate()}
              disabled={!addForm.company_name || !addForm.name || !addForm.email || createPartner.isPending}
            >
              {createPartner.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              Save B2B Partner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 3: EDIT PARTNER PROFILE                                           */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-slate-700" /> Edit Partner Information
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Company Name</Label>
              <Input
                value={editForm.company_name}
                onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                className="h-9 rounded-xl"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Contact Person</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
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
                <Label className="text-xs font-bold text-slate-700">City</Label>
                <Input
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  className="h-9 rounded-xl"
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Notes / Agreement</Label>
              <Input
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                className="h-9 rounded-xl"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-slate-900 text-white font-bold"
              onClick={() => updatePartner.mutate()}
              disabled={updatePartner.isPending}
            >
              {updatePartner.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 4: RECORD PAYOUT TO PARTNER                                       */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={payoutModalOpen} onOpenChange={setPayoutModalOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-600" /> Record Profit Payout
            </DialogTitle>
            <DialogDescription className="text-xs">
              Release partner commission payout to <strong>{selectedPartner?.company_name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs flex justify-between items-center">
              <span className="text-slate-600">Pending Payable Balance:</span>
              <span className="font-bold text-emerald-700 text-sm">
                ₹ {parseInt(selectedPartner?.payout_balance || 0, 10).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Payout Amount (₹) *</Label>
              <Input
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(parseInt(e.target.value, 10) || 0)}
                className="h-9 rounded-xl font-bold text-emerald-700 text-sm"
              />
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-bold text-slate-700">Reference / Bank Notes</Label>
              <Input
                value={payoutNotes}
                onChange={(e) => setPayoutNotes(e.target.value)}
                placeholder="NEFT Transfer UTR #9948219"
                className="h-9 rounded-xl text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPayoutModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              onClick={() => releasePayout.mutate()}
              disabled={payoutAmount <= 0 || releasePayout.isPending}
            >
              {releasePayout.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              Confirm Payout Release
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
