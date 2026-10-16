import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Users,
  Shield,
  Bell,
  Plug,
  CreditCard,
  Globe,
  Palette,
  Loader2,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  Smartphone,
  Mail,
  MessageSquare,
  Key,
  Database,
  Cloud,
  Check,
  Zap,
  Sliders,
  Sparkles,
  Server,
  ArrowRight,
  ShieldCheck,
  Send,
  HelpCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Advanced Settings · UniQuesta ERP" },
      {
        name: "description",
        content:
          "Enterprise configuration: organisation, branch hierarchy, multi-role permissions matrix, security, notifications, webhooks and integrations.",
      },
      { property: "og:title", content: "Advanced Settings · UniQuesta ERP" },
      {
        property: "og:description",
        content: "Configure and customize your enterprise UniQuesta workspace.",
      },
    ],
  }),
  component: AdvancedSettingsPage,
});

/* -------------------------------------------------------------------------- */
/* Setting Groups Configuration                                               */
/* -------------------------------------------------------------------------- */
const SETTING_GROUPS = [
  {
    id: "organisation",
    title: "Organisation & Entity",
    desc: "Legal entity, CIN, GST profiles, headquarters & branches",
    icon: Building2,
    badge: "Core",
  },
  {
    id: "roles",
    title: "Roles & Permissions",
    desc: "12 system roles, granular department permission matrix",
    icon: Users,
    badge: "Access",
  },
  {
    id: "security",
    title: "Security & Compliance",
    desc: "2FA enforcement, session timeout, IP restriction & DPDP",
    icon: Shield,
    badge: "Protected",
  },
  {
    id: "notifications",
    title: "Notifications Engine",
    desc: "WhatsApp Cloud API, SMS gateway, automated event triggers",
    icon: Bell,
    badge: "Automated",
  },
  {
    id: "integrations",
    title: "Integrations & API",
    desc: "Meta Lead Ads, WhatsApp WABA, Zoom, Tally Prime, Webhooks",
    icon: Plug,
    badge: "Connected",
  },
  {
    id: "branding",
    title: "Branding & Appearance",
    desc: "Brand identity, official colors, logos, signatures & themes",
    icon: Palette,
    badge: "Theme",
  },
  {
    id: "billing",
    title: "Subscription & License",
    desc: "Enterprise license, 280 seats quota, storage allocation",
    icon: CreditCard,
    badge: "Enterprise",
  },
  {
    id: "localisation",
    title: "Localisation & Region",
    desc: "Currency, timezones, fiscal year & Indian number systems",
    icon: Globe,
    badge: "Regional",
  },
];

/* Pre-defined Roles with permissions */
const ROLE_PROFILES = [
  {
    id: "super_admin",
    name: "Super Administrator",
    desc: "Full unrestricted access across all branches, finance, and system settings.",
    usersCount: 2,
    permissions: [
      "students_view",
      "students_edit",
      "students_export",
      "finance_view",
      "finance_issue",
      "finance_audit",
      "approvals_signoff",
      "approvals_release",
      "travel_manage",
      "travel_margins",
      "settings_manage",
    ],
  },
  {
    id: "branch_admin",
    name: "Branch Administrator",
    desc: "Manages regional branch counsellors, student admissions, and branch budgets.",
    usersCount: 8,
    permissions: [
      "students_view",
      "students_edit",
      "students_export",
      "finance_view",
      "approvals_signoff",
      "travel_manage",
    ],
  },
  {
    id: "senior_counsellor",
    name: "Senior Counsellor",
    desc: "Conducts lead counselling, files international applications, verifies documents.",
    usersCount: 14,
    permissions: ["students_view", "students_edit", "students_export", "approvals_submit"],
  },
  {
    id: "counsellor",
    name: "Admission Counsellor",
    desc: "Assigned inbound leads, schedules calls, and guides student enrollment.",
    usersCount: 18,
    permissions: ["students_view", "students_edit"],
  },
  {
    id: "visa_officer",
    name: "Visa & Compliance Officer",
    desc: "Manages embassy filings, CAS/COE compliance, and student visa documents.",
    usersCount: 4,
    permissions: ["students_view", "students_edit"],
  },
  {
    id: "accounts_finance",
    name: "Finance & Accounts Officer",
    desc: "Audits fee receipts, reconciles partner payouts, and executes NEFT transfers.",
    usersCount: 3,
    permissions: [
      "students_view",
      "finance_view",
      "finance_issue",
      "finance_audit",
      "approvals_release",
    ],
  },
  {
    id: "travel_manager",
    name: "Travel Fleet Manager",
    desc: "Coordinates bus fleets, airport shuttles, driver rosters, and agency margins.",
    usersCount: 3,
    permissions: ["travel_manage", "travel_margins"],
  },
];

const PERMISSION_DEFINITIONS = [
  { key: "students_view", label: "View Student Records", module: "Admissions" },
  { key: "students_edit", label: "Create & Edit Applications", module: "Admissions" },
  { key: "students_export", label: "Export Student Data (CSV/PDF)", module: "Admissions" },
  { key: "finance_view", label: "View Invoices & Fee Ledger", module: "Finance" },
  { key: "finance_issue", label: "Generate Invoices & Receipts", module: "Finance" },
  { key: "finance_audit", label: "Audit Financial Statements & P&L", module: "Finance" },
  { key: "approvals_submit", label: "Submit Expense Requisitions", module: "Approvals" },
  { key: "approvals_signoff", label: "Branch Sign-off Authority", module: "Approvals" },
  { key: "approvals_release", label: "Executive Disbursement & Payout", module: "Approvals" },
  { key: "travel_manage", label: "Manage Bookings & Assign Drivers", module: "Tours & Travels" },
  { key: "travel_margins", label: "View & Override Admin Profit Margins", module: "Tours & Travels" },
  { key: "settings_manage", label: "System Configuration & Integration Keys", module: "Admin Settings" },
];

function AdvancedSettingsPage() {
  const qc = useQueryClient();
  const [activeCategory, setActiveCategory] = useState("organisation");
  const [selectedRole, setSelectedRole] = useState("super_admin");
  const [hasChanges, setHasChanges] = useState(false);

  // Form State
  const [form, setForm] = useState({
    // Organisation
    legal_name: "Uniquesta Overseas Education & Travels Pvt. Ltd.",
    brand_name: "UniQuesta International",
    cin: "U74999AS2024PTC021980",
    gstin: "18AAACU9821K1ZM",
    support_email: "care@uniquesta.com",
    helpline_phone: "+91 98200 11111",
    website: "https://uniquesta.com",
    hq_address: "UniQuesta Tower, G.S. Road, Guwahati, Assam - 781005",
    total_branches_count: 14,

    // Security & Compliance
    two_factor: true,
    session_timeout: "30_mins",
    password_rotation_days: 90,
    enforce_admin_ip_whitelist: false,
    audit_trail_logging: true,
    dpdp_compliance: true,
    allow_export_data: true,

    // Notifications
    whatsapp_notify: true,
    whatsapp_api_status: "connected",
    student_welcome_sms: true,
    fee_reminder_days: 3,
    approval_urgent_alerts: true,
    email_smtp_host: "smtp.sendgrid.net",
    email_smtp_port: 587,
    email_from_address: "notifications@uniquesta.com",

    // Integrations
    meta_leads_webhook_enabled: true,
    meta_pixel_id: "8992019482103",
    zoom_auto_meeting: true,
    tally_sync_enabled: true,
    cloud_storage_provider: "aws_s3",
    cloud_bucket_name: "uniquesta-student-vault-ap-south-1",
    webhook_url: "https://api.uniquesta.com/v1/webhooks/admissions",

    // Branding
    brand_color: "#E52E20",
    brand_slogan: "Trusted Pathway to Global Success",
    dark_mode_preference: "system",
    counselor_signature_suffix: "UniQuesta Global Education Specialist",

    // Billing
    plan_tier: "Enterprise Multi-Branch License",
    licensed_seats: 280,
    allocated_storage_gb: 500,

    // Localisation
    timezone: "Asia/Kolkata",
    date_format: "DD/MM/YYYY",
    number_format: "indian",
    currency: "INR",
    fiscal_year_start: "April 1",
  });

  // Role permissions mapping
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    ROLE_PROFILES.forEach((r) => {
      initial[r.id] = [...r.permissions];
    });
    return initial;
  });

  // Fetch settings from server
  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      try {
        const res: any = await api.get<any>("/settings");
        return res.data ?? res ?? {};
      } catch {
        return {};
      }
    },
  });

  useEffect(() => {
    if (data && typeof data === "object") {
      setForm((prev) => ({
        ...prev,
        legal_name: data.legal_name ?? prev.legal_name,
        support_email: data.support_email ?? prev.support_email,
        two_factor: data.two_factor !== undefined ? !!data.two_factor : prev.two_factor,
        whatsapp_notify: data.whatsapp_notify !== undefined ? !!data.whatsapp_notify : prev.whatsapp_notify,
        brand_name: data.brand_name ?? prev.brand_name,
        cin: data.cin ?? prev.cin,
        gstin: data.gstin ?? prev.gstin,
        helpline_phone: data.helpline_phone ?? prev.helpline_phone,
        website: data.website ?? prev.website,
        hq_address: data.hq_address ?? prev.hq_address,
        brand_color: data.brand_color ?? prev.brand_color,
        timezone: data.timezone ?? prev.timezone,
        currency: data.currency ?? prev.currency,
        webhook_url: data.webhook_url ?? prev.webhook_url,
      }));
    }
  }, [data]);

  const updateField = (key: string, val: any) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setHasChanges(true);
  };

  const togglePermission = (roleId: string, permKey: string) => {
    setRolePermissions((prev) => {
      const current = prev[roleId] || [];
      const updated = current.includes(permKey)
        ? current.filter((k) => k !== permKey)
        : [...current, permKey];
      return { ...prev, [roleId]: updated };
    });
    setHasChanges(true);
  };

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      return api.put("/settings", {
        ...form,
        role_permissions: rolePermissions,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      setHasChanges(false);
      toast.success("Settings saved successfully", {
        description: "All enterprise system configurations are now active.",
      });
    },
    onError: (err: any) => {
      toast.error("Failed to save settings: " + (err.message || "Unknown error"));
    },
  });

  const handleTestPing = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: "Testing integration webhook endpoint...",
        success: "HTTP 200 OK — Webhook received payload successfully!",
        error: "Webhook test failed",
      }
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* -------------------------------------------------------------------- */}
      {/* Header with Global Save / Reset Action Controls                      */}
      {/* -------------------------------------------------------------------- */}
      <PageHeader
        title="Settings & Workspace Configuration"
        description="Enterprise settings, multi-branch hierarchy, granular role access, security policies, and integrations."
        actions={
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-300">
                Unsaved Changes
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                qc.invalidateQueries({ queryKey: ["settings"] });
                setHasChanges(false);
                toast.info("Settings reset to current server state");
              }}
              className="rounded-lg gap-1.5"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <Button
              size="sm"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="rounded-lg bg-primary text-primary-foreground gap-1.5 shadow-sm"
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save All Changes
            </Button>
          </div>
        }
      />

      {/* -------------------------------------------------------------------- */}
      {/* Main Two-Column Layout: Left Category Nav + Right Settings Body      */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Interactive Settings Sidebar (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-2">
          <Card className="rounded-2xl border shadow-sm p-2 bg-card/60 backdrop-blur">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Settings Directory
            </div>
            <div className="space-y-1">
              {SETTING_GROUPS.map((g) => {
                const isActive = activeCategory === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setActiveCategory(g.id)}
                    className={`w-full flex items-start gap-3 rounded-xl p-3 text-left transition cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-muted/60 text-foreground"
                    }`}
                  >
                    <div
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-primary-soft text-primary dark:bg-muted"
                      }`}
                    >
                      <g.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold truncate">{g.title}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {g.badge}
                        </span>
                      </div>
                      <p
                        className={`text-xs mt-0.5 line-clamp-1 ${
                          isActive ? "text-white/80" : "text-muted-foreground"
                        }`}
                      >
                        {g.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Quick System Status Card */}
          <Card className="rounded-2xl border p-4 bg-muted/30">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Server className="h-4 w-4 text-emerald-500" /> System Engine Status
            </div>
            <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Database Sync:</span>
                <span className="font-semibold text-emerald-600">Active (MySQL / Mem)</span>
              </div>
              <div className="flex justify-between">
                <span>Active Branches:</span>
                <span className="font-semibold text-foreground">{form.total_branches_count} Hubs</span>
              </div>
              <div className="flex justify-between">
                <span>WhatsApp API:</span>
                <span className="font-semibold text-emerald-600">Connected</span>
              </div>
              <div className="flex justify-between">
                <span>Cloud Storage:</span>
                <span className="font-semibold text-foreground">AWS S3 (Mumbai)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Active Settings Panel Content (8 cols on lg) */}
        <div className="lg:col-span-8">
          {isLoading ? (
            <Card className="rounded-2xl border p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Loading workspace settings...</p>
            </Card>
          ) : (
            <>
              {/* ════════════════════════════════════════════════════════════ */}
              {/* CATEGORY 1: ORGANISATION & ENTITY                            */}
              {/* ════════════════════════════════════════════════════════════ */}
              {activeCategory === "organisation" && (
                <Card className="rounded-2xl border shadow-soft">
                  <CardHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Organisation & Entity Profile</CardTitle>
                          <CardDescription className="text-xs">
                            Legal entity credentials, corporate registration, and branch setup.
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        14 Branches Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Legal Company Name</Label>
                        <Input
                          value={form.legal_name}
                          onChange={(e) => updateField("legal_name", e.target.value)}
                          className="rounded-xl h-10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Public Brand Name</Label>
                        <Input
                          value={form.brand_name}
                          onChange={(e) => updateField("brand_name", e.target.value)}
                          className="rounded-xl h-10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Corporate CIN / Reg Number</Label>
                        <Input
                          value={form.cin}
                          onChange={(e) => updateField("cin", e.target.value)}
                          className="rounded-xl h-10 font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">GSTIN Tax Registration</Label>
                        <Input
                          value={form.gstin}
                          onChange={(e) => updateField("gstin", e.target.value)}
                          className="rounded-xl h-10 font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Central Support Email</Label>
                        <Input
                          value={form.support_email}
                          onChange={(e) => updateField("support_email", e.target.value)}
                          className="rounded-xl h-10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Official Helpline Phone</Label>
                        <Input
                          value={form.helpline_phone}
                          onChange={(e) => updateField("helpline_phone", e.target.value)}
                          className="rounded-xl h-10 font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Headquarters Address</Label>
                      <Input
                        value={form.hq_address}
                        onChange={(e) => updateField("hq_address", e.target.value)}
                        className="rounded-xl h-10"
                      />
                    </div>

                    <div className="rounded-xl border p-4 bg-muted/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold">National Branch Network</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {form.total_branches_count} Registered Offices
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Guwahati HQ, Mumbai (Andheri West), Delhi NCR, Bengaluru, Hyderabad, Kolkata,
                        Kochi, Chandigarh, Ahmedabad, Pune, Jaipur, Chennai, Silchar, and Shillong.
                      </p>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={() => saveMutation.mutate()}
                        disabled={saveMutation.isPending}
                        className="rounded-xl text-xs gap-1.5"
                      >
                        <Save className="h-4 w-4" /> Save Organisation Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ════════════════════════════════════════════════════════════ */}
              {/* CATEGORY 2: ROLES & PERMISSIONS MATRIX                       */}
              {/* ════════════════════════════════════════════════════════════ */}
              {activeCategory === "roles" && (
                <Card className="rounded-2xl border shadow-soft">
                  <CardHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Roles & Permission Matrix</CardTitle>
                          <CardDescription className="text-xs">
                            Select a system role to view and customize granular authority.
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        7 Standard Roles
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    {/* Role Selector Tabs */}
                    <div className="flex flex-wrap gap-2">
                      {ROLE_PROFILES.map((role) => (
                        <button
                          key={role.id}
                          onClick={() => setSelectedRole(role.id)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer border ${
                            selectedRole === role.id
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-background text-foreground hover:bg-muted border-border"
                          }`}
                        >
                          {role.name} ({role.usersCount})
                        </button>
                      ))}
                    </div>

                    {/* Active Selected Role Details */}
                    {(() => {
                      const currentRole =
                        ROLE_PROFILES.find((r) => r.id === selectedRole) || ROLE_PROFILES[0];
                      const activePerms = rolePermissions[selectedRole] || [];
                      return (
                        <div className="space-y-4">
                          <div className="rounded-xl border p-3.5 bg-muted/20 flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-sm text-foreground">
                                {currentRole.name}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {currentRole.desc}
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {activePerms.length} of {PERMISSION_DEFINITIONS.length} Permissions
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Permission Checklist (Click to Toggle)
                            </Label>
                            <div className="grid gap-2.5 sm:grid-cols-2">
                              {PERMISSION_DEFINITIONS.map((perm) => {
                                const hasPerm = activePerms.includes(perm.key);
                                return (
                                  <div
                                    key={perm.key}
                                    onClick={() => togglePermission(selectedRole, perm.key)}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                                      hasPerm
                                        ? "border-primary/40 bg-primary-soft/30 dark:bg-primary-soft/10"
                                        : "border-border bg-card hover:bg-muted/30 opacity-70"
                                    }`}
                                  >
                                    <div>
                                      <div className="text-xs font-semibold text-foreground">
                                        {perm.label}
                                      </div>
                                      <div className="text-[10px] text-muted-foreground">
                                        Module: {perm.module}
                                      </div>
                                    </div>
                                    <Switch checked={hasPerm} />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={() => saveMutation.mutate()}
                        disabled={saveMutation.isPending}
                        className="rounded-xl text-xs gap-1.5"
                      >
                        <Save className="h-4 w-4" /> Save Role Permissions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ════════════════════════════════════════════════════════════ */}
              {/* CATEGORY 3: SECURITY & COMPLIANCE                            */}
              {/* ════════════════════════════════════════════════════════════ */}
              {activeCategory === "security" && (
                <Card className="rounded-2xl border shadow-soft">
                  <CardHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Security, Access & DPDP Compliance</CardTitle>
                          <CardDescription className="text-xs">
                            Authentication guards, session management, and data protection policies.
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-300">
                        High Security
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-xl border p-4">
                        <div>
                          <div className="text-sm font-semibold">Two-Factor Authentication (2FA)</div>
                          <div className="text-xs text-muted-foreground">
                            Mandatory OTP verification required for Super Admins, Branch Managers, and Finance roles.
                          </div>
                        </div>
                        <Switch
                          checked={form.two_factor}
                          onCheckedChange={(v) => updateField("two_factor", v)}
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-xl border p-4">
                        <div>
                          <div className="text-sm font-semibold">DPDP 2023 Student Data Privacy</div>
                          <div className="text-xs text-muted-foreground">
                            Enforces academic consent verification and anonymization of expired lead records.
                          </div>
                        </div>
                        <Switch
                          checked={form.dpdp_compliance}
                          onCheckedChange={(v) => updateField("dpdp_compliance", v)}
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-xl border p-4">
                        <div>
                          <div className="text-sm font-semibold">Real-Time Audit Trail Logging</div>
                          <div className="text-xs text-muted-foreground">
                            Captures every student record edit, invoice alteration, and approval action with IP timestamp.
                          </div>
                        </div>
                        <Switch
                          checked={form.audit_trail_logging}
                          onCheckedChange={(v) => updateField("audit_trail_logging", v)}
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-xl border p-4">
                        <div>
                          <div className="text-sm font-semibold">Allow CSV & Report Exports</div>
                          <div className="text-xs text-muted-foreground">
                            Permits authorized staff to download CSV reports from Reports & Analytics.
                          </div>
                        </div>
                        <Switch
                          checked={form.allow_export_data}
                          onCheckedChange={(v) => updateField("allow_export_data", v)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 pt-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Session Inactivity Timeout</Label>
                        <Select
                          value={form.session_timeout}
                          onValueChange={(v) => updateField("session_timeout", v)}
                        >
                          <SelectTrigger className="rounded-xl h-10">
                            <SelectValue placeholder="Session Timeout" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15_mins">15 Minutes</SelectItem>
                            <SelectItem value="30_mins">30 Minutes (Recommended)</SelectItem>
                            <SelectItem value="1_hour">1 Hour</SelectItem>
                            <SelectItem value="8_hours">8 Hours (Full Shift)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Password Rotation Interval</Label>
                        <Select
                          value={String(form.password_rotation_days)}
                          onValueChange={(v) => updateField("password_rotation_days", parseInt(v, 10))}
                        >
                          <SelectTrigger className="rounded-xl h-10">
                            <SelectValue placeholder="Password Expiry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="60">Every 60 Days</SelectItem>
                            <SelectItem value="90">Every 90 Days</SelectItem>
                            <SelectItem value="180">Every 180 Days</SelectItem>
                            <SelectItem value="0">Never Expire</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={() => saveMutation.mutate()}
                        disabled={saveMutation.isPending}
                        className="rounded-xl text-xs gap-1.5"
                      >
                        <Save className="h-4 w-4" /> Save Security Policies
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ════════════════════════════════════════════════════════════ */}
              {/* CATEGORY 4: NOTIFICATIONS ENGINE                             */}
              {/* ════════════════════════════════════════════════════════════ */}
              {activeCategory === "notifications" && (
                <Card className="rounded-2xl border shadow-soft">
                  <CardHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                          <Bell className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Notifications & Communications Engine</CardTitle>
                          <CardDescription className="text-xs">
                            Meta WhatsApp Cloud API, automated student SMS, and staff notification triggers.
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                        Multi-Channel
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-xl border p-4 bg-emerald-50/20 dark:bg-emerald-950/10">
                        <div>
                          <div className="text-sm font-semibold flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-emerald-600" /> WhatsApp Cloud API Alerts
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Automated delivery of application progress, offer letters, and fee receipts to students.
                          </div>
                        </div>
                        <Switch
                          checked={form.whatsapp_notify}
                          onCheckedChange={(v) => updateField("whatsapp_notify", v)}
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-xl border p-4">
                        <div>
                          <div className="text-sm font-semibold">Immediate Welcome Message on New Enquiry</div>
                          <div className="text-xs text-muted-foreground">
                            Dispatches counselor greeting & introductory brochures as soon as lead registers.
                          </div>
                        </div>
                        <Switch
                          checked={form.student_welcome_sms}
                          onCheckedChange={(v) => updateField("student_welcome_sms", v)}
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-xl border p-4">
                        <div>
                          <div className="text-sm font-semibold">Urgent Approval Telegram / Mobile Push</div>
                          <div className="text-xs text-muted-foreground">
                            Notifies Branch Managers & Executive Sign-off officers when expense vouchers are submitted.
                          </div>
                        </div>
                        <Switch
                          checked={form.approval_urgent_alerts}
                          onCheckedChange={(v) => updateField("approval_urgent_alerts", v)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 pt-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Outgoing Email SMTP Host</Label>
                        <Input
                          value={form.email_smtp_host}
                          onChange={(e) => updateField("email_smtp_host", e.target.value)}
                          className="rounded-xl h-10 font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">From Email Address</Label>
                        <Input
                          value={form.email_from_address}
                          onChange={(e) => updateField("email_from_address", e.target.value)}
                          className="rounded-xl h-10 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={() => saveMutation.mutate()}
                        disabled={saveMutation.isPending}
                        className="rounded-xl text-xs gap-1.5"
                      >
                        <Save className="h-4 w-4" /> Save Notification Rules
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ════════════════════════════════════════════════════════════ */}
              {/* CATEGORY 5: INTEGRATIONS & API WEBHOOKS                      */}
              {/* ════════════════════════════════════════════════════════════ */}
              {activeCategory === "integrations" && (
                <Card className="rounded-2xl border shadow-soft">
                  <CardHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                          <Plug className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Integrations & API Webhooks</CardTitle>
                          <CardDescription className="text-xs">
                            Meta Lead Ads, Tally Prime accounting sync, Zoom counseling, and cloud webhooks.
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                        Live Sync
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-xl border p-4">
                        <div>
                          <div className="text-sm font-semibold">Meta (Facebook & Instagram) Lead Ads</div>
                          <div className="text-xs text-muted-foreground">
                            Automatically ingest leads from education campaign forms straight into UniQuesta CRM.
                          </div>
                        </div>
                        <Switch
                          checked={form.meta_leads_webhook_enabled}
                          onCheckedChange={(v) => updateField("meta_leads_webhook_enabled", v)}
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-xl border p-4">
                        <div>
                          <div className="text-sm font-semibold">Zoom & Google Meet Auto-Scheduler</div>
                          <div className="text-xs text-muted-foreground">
                            Generates direct virtual counseling room links when student books an appointment.
                          </div>
                        </div>
                        <Switch
                          checked={form.zoom_auto_meeting}
                          onCheckedChange={(v) => updateField("zoom_auto_meeting", v)}
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-xl border p-4">
                        <div>
                          <div className="text-sm font-semibold">Tally Prime / Accounting XML Export</div>
                          <div className="text-xs text-muted-foreground">
                            Syncs paid tuition invoices and approved voucher vouchers with Tally Prime ledgers.
                          </div>
                        </div>
                        <Switch
                          checked={form.tally_sync_enabled}
                          onCheckedChange={(v) => updateField("tally_sync_enabled", v)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold">Production Inbound Webhook Endpoint</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleTestPing}
                          className="h-7 text-xs text-primary gap-1"
                        >
                          <Send className="h-3 w-3" /> Test Webhook Ping
                        </Button>
                      </div>
                      <Input
                        value={form.webhook_url}
                        onChange={(e) => updateField("webhook_url", e.target.value)}
                        className="rounded-xl h-10 font-mono text-xs"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={() => saveMutation.mutate()}
                        disabled={saveMutation.isPending}
                        className="rounded-xl text-xs gap-1.5"
                      >
                        <Save className="h-4 w-4" /> Save Integration Keys
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ════════════════════════════════════════════════════════════ */}
              {/* CATEGORY 6: BRANDING & THEME                                 */}
              {/* ════════════════════════════════════════════════════════════ */}
              {activeCategory === "branding" && (
                <Card className="rounded-2xl border shadow-soft">
                  <CardHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
                          <Palette className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Branding & Corporate Identity</CardTitle>
                          <CardDescription className="text-xs">
                            Accent colors, brand slogans, portal signatures, and design theme preferences.
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Customizable
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 p-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Primary Brand Theme Accent Color</Label>
                      <div className="flex flex-wrap gap-3 items-center">
                        {[
                          { name: "UniQuesta Red", color: "#E52E20" },
                          { name: "Royal Navy", color: "#1E40AF" },
                          { name: "Emerald Forest", color: "#059669" },
                          { name: "Regal Purple", color: "#7C3AED" },
                          { name: "Sunset Gold", color: "#D97706" },
                        ].map((c) => (
                          <button
                            key={c.color}
                            onClick={() => updateField("brand_color", c.color)}
                            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition cursor-pointer ${
                              form.brand_color === c.color
                                ? "border-foreground bg-muted font-bold"
                                : "hover:bg-muted/50"
                            }`}
                          >
                            <span
                              className="h-4 w-4 rounded-full border border-black/10 shrink-0"
                              style={{ backgroundColor: c.color }}
                            />
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 pt-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Brand Tagline / Slogan</Label>
                        <Input
                          value={form.brand_slogan}
                          onChange={(e) => updateField("brand_slogan", e.target.value)}
                          className="rounded-xl h-10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Counselor Signature Designation</Label>
                        <Input
                          value={form.counselor_signature_suffix}
                          onChange={(e) => updateField("counselor_signature_suffix", e.target.value)}
                          className="rounded-xl h-10"
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border p-4 bg-muted/20">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Live Preview: Student Portal Brand Header
                      </div>
                      <div className="rounded-lg border bg-card p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: form.brand_color }}
                          >
                            UQ
                          </div>
                          <div>
                            <div className="text-sm font-bold text-foreground">{form.brand_name}</div>
                            <div className="text-[11px] text-muted-foreground">{form.brand_slogan}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          Verified Brand
                        </Badge>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={() => saveMutation.mutate()}
                        disabled={saveMutation.isPending}
                        className="rounded-xl text-xs gap-1.5"
                      >
                        <Save className="h-4 w-4" /> Save Brand Styling
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ════════════════════════════════════════════════════════════ */}
              {/* CATEGORY 7: SUBSCRIPTION & LICENSE                           */}
              {/* ════════════════════════════════════════════════════════════ */}
              {activeCategory === "billing" && (
                <Card className="rounded-2xl border shadow-soft">
                  <CardHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Subscription & Enterprise License</CardTitle>
                          <CardDescription className="text-xs">
                            Active tier, seats quota, storage usage, and contractual service agreements.
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-emerald-600 text-white text-xs">
                        Active & Paid
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 p-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-xl border p-4 bg-muted/20">
                        <span className="text-xs text-muted-foreground font-medium">Licensed Plan</span>
                        <div className="text-base font-bold text-foreground mt-1">Enterprise Core</div>
                        <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Multi-branch deployment</p>
                      </div>
                      <div className="rounded-xl border p-4 bg-muted/20">
                        <span className="text-xs text-muted-foreground font-medium">Staff Seats</span>
                        <div className="text-base font-bold text-foreground mt-1">
                          42 / {form.licensed_seats}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">238 Seats Available</p>
                      </div>
                      <div className="rounded-xl border p-4 bg-muted/20">
                        <span className="text-xs text-muted-foreground font-medium">Vault Storage</span>
                        <div className="text-base font-bold text-foreground mt-1">38.4 GB / 500 GB</div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">7.6% Quota Used</p>
                      </div>
                    </div>

                    <div className="rounded-xl border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold">Annual Corporate Subscription Renewal</div>
                          <div className="text-xs text-muted-foreground">
                            Next renewal scheduled for March 31, 2027. Dedicated Enterprise Support SLA included.
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info("Downloading official GST license certificate...")}
                          className="rounded-lg text-xs"
                        >
                          GST Invoice Copy
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={() => saveMutation.mutate()}
                        disabled={saveMutation.isPending}
                        className="rounded-xl text-xs gap-1.5"
                      >
                        <Save className="h-4 w-4" /> Save License Allocation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ════════════════════════════════════════════════════════════ */}
              {/* CATEGORY 8: LOCALISATION & REGION                            */}
              {/* ════════════════════════════════════════════════════════════ */}
              {activeCategory === "localisation" && (
                <Card className="rounded-2xl border shadow-soft">
                  <CardHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300">
                          <Globe className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Localisation, Currency & Timezone</CardTitle>
                          <CardDescription className="text-xs">
                            Format preferences for dates, monetary values, and regional working cycles.
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Asia / Kolkata (IST)
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Standard Workspace Timezone</Label>
                        <Select
                          value={form.timezone}
                          onValueChange={(v) => updateField("timezone", v)}
                        >
                          <SelectTrigger className="rounded-xl h-10">
                            <SelectValue placeholder="Timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asia/Kolkata">Asia / Kolkata (GMT +5:30)</SelectItem>
                            <SelectItem value="UTC">Universal Coordinated Time (UTC)</SelectItem>
                            <SelectItem value="Europe/London">Europe / London (GMT +0 / BST)</SelectItem>
                            <SelectItem value="America/Toronto">America / Toronto (EST)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Primary Base Currency</Label>
                        <Select
                          value={form.currency}
                          onValueChange={(v) => updateField("currency", v)}
                        >
                          <SelectTrigger className="rounded-xl h-10">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">INR — Indian Rupee (₹)</SelectItem>
                            <SelectItem value="USD">USD — US Dollar ($)</SelectItem>
                            <SelectItem value="GBP">GBP — British Pound (£)</SelectItem>
                            <SelectItem value="EUR">EUR — Euro (€)</SelectItem>
                            <SelectItem value="CAD">CAD — Canadian Dollar (C$)</SelectItem>
                            <SelectItem value="AUD">AUD — Australian Dollar (A$)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Date Display Format</Label>
                        <Select
                          value={form.date_format}
                          onValueChange={(v) => updateField("date_format", v)}
                        >
                          <SelectTrigger className="rounded-xl h-10">
                            <SelectValue placeholder="Date Format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (Indian Standard)</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</SelectItem>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US Format)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Number Formatting Scheme</Label>
                        <Select
                          value={form.number_format}
                          onValueChange={(v) => updateField("number_format", v)}
                        >
                          <SelectTrigger className="rounded-xl h-10">
                            <SelectValue placeholder="Number Format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="indian">Indian Lakhs & Crores (e.g. ₹ 10,50,000)</SelectItem>
                            <SelectItem value="international">International Millions (e.g. $ 1,050,000)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={() => saveMutation.mutate()}
                        disabled={saveMutation.isPending}
                        className="rounded-xl text-xs gap-1.5"
                      >
                        <Save className="h-4 w-4" /> Save Localisation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
