import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Users, Shield, Bell, Plug, CreditCard, Globe, Palette, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Uniquesta ERP" },
      { name: "description", content: "Organisation, branches, roles, security and integrations for Uniquesta." },
      { property: "og:title", content: "Settings · Uniquesta ERP" },
      { property: "og:description", content: "Configure Uniquesta ERP & CRM." },
    ],
  }),
  component: SettingsPage,
});

const groups = [
  { icon: Building2, title: "Organisation & Branches", desc: "Legal entity, 14 branches, GST profiles" },
  { icon: Users, title: "Roles & Permissions", desc: "12 roles, 84 permissions" },
  { icon: Shield, title: "Security & Compliance", desc: "SSO, 2FA, audit log, DPDP" },
  { icon: Bell, title: "Notifications", desc: "Email, SMS, WhatsApp templates" },
  { icon: Plug, title: "Integrations", desc: "WhatsApp, Zoom, Google Workspace, Tally" },
  { icon: CreditCard, title: "Billing & Plan", desc: "Enterprise plan · 280 seats" },
  { icon: Globe, title: "Localisation", desc: "Currencies, timezones, languages" },
  { icon: Palette, title: "Branding", desc: "Logo, colours, email signature" },
];

function SettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async ()=> {
      const res:any = await api.get<any>("/settings");
      return res.data ?? res ?? {};
    }
  });
  const settings:any = data ?? {};
  const [form, setForm] = useState({ legal_name:"", support_email:"", two_factor:true, whatsapp_notify:true });
  useEffect(()=>{
    if(settings && settings.legal_name) setForm({
      legal_name: settings.legal_name ?? settings.legalName ?? "Uniquesta Overseas Pvt Ltd",
      support_email: settings.support_email ?? settings.supportEmail ?? "care@uniquesta.com",
      two_factor: !!(settings.two_factor ?? settings.twoFactor ?? true),
      whatsapp_notify: !!(settings.whatsapp_notify ?? settings.whatsappNotify ?? true),
    });
  }, [settings.legal_name, settings.support_email, settings.two_factor, settings.whatsapp_notify]);

  const save = useMutation({
    mutationFn: async ()=> api.put("/settings", { legal_name: form.legal_name, support_email: form.support_email, two_factor: form.two_factor, whatsapp_notify: form.whatsapp_notify }),
    onSuccess: ()=>{ qc.invalidateQueries({queryKey:["settings"]}); toast.success("Settings saved"); },
    onError:(e:any)=> toast.error(e.message),
  });

  return (
    <>
      <PageHeader title="Settings" description="Configure your Uniquesta workspace" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-soft lg:col-span-2">
          <CardContent className="grid gap-3 p-4 sm:grid-cols-2">
            {groups.map(g=>(
              <button key={g.title} className="flex items-start gap-3 rounded-xl border p-4 text-left transition hover:border-primary/40 hover:bg-primary-soft/40">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><g.icon className="h-5 w-5"/></div>
                <div className="min-w-0">
                  <div className="font-medium">{g.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{g.desc}</div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-soft">
          <CardContent className="space-y-5 p-6">
            <div>
              <h3 className="font-semibold">Organisation</h3>
              <p className="text-xs text-muted-foreground">Basic details shown across the app</p>
            </div>
            {isLoading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/> Loading…</div> : (
              <>
                <div className="space-y-2">
                  <Label>Legal Name</Label>
                  <Input value={form.legal_name} onChange={e=>setForm({...form,legal_name:e.target.value})} className="rounded-lg"/>
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input value={form.support_email} onChange={e=>setForm({...form,support_email:e.target.value})} className="rounded-lg"/>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="text-sm font-medium">Two-factor authentication</div>
                    <div className="text-xs text-muted-foreground">Required for admins</div>
                  </div>
                  <Switch checked={form.two_factor} onCheckedChange={v=>setForm({...form,two_factor:v})}/>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="text-sm font-medium">WhatsApp notifications</div>
                    <div className="text-xs text-muted-foreground">Student & partner alerts</div>
                  </div>
                  <Switch checked={form.whatsapp_notify} onCheckedChange={v=>setForm({...form,whatsapp_notify:v})}/>
                </div>
                <Button className="w-full rounded-lg" onClick={()=>save.mutate()} disabled={save.isPending}>{save.isPending && <Loader2 className="h-4 w-4 animate-spin"/>} Save changes</Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
