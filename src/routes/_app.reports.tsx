import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, PieChart, LineChart, Download, FileBarChart, Users, Wallet, Globe2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({
    meta: [
      { title: "Reports · Uniquesta ERP" },
      { name: "description", content: "Pre-built and custom reports for admissions, finance, HR and partner performance." },
      { property: "og:title", content: "Reports · Uniquesta ERP" },
      { property: "og:description", content: "Analytics and reporting for Uniquesta." },
    ],
  }),
  component: ReportsPage,
});

const fallback = [
  { title: "Admissions Funnel", desc: "Lead → Enrolled conversion by branch", icon: BarChart3, tag: "Sales" },
  { title: "Revenue by Destination", desc: "Country-wise revenue and margin", icon: PieChart, tag: "Finance" },
  { title: "Counsellor Productivity", desc: "Applications and offers per counsellor", icon: Users, tag: "HR" },
  { title: "Partner Contribution", desc: "Sub-agent lead quality and payouts", icon: Globe2, tag: "Partners" },
  { title: "Cash Flow Forecast", desc: "12-month projection across branches", icon: LineChart, tag: "Finance" },
  { title: "Visa Success Rate", desc: "Approvals vs. rejections by country", icon: FileBarChart, tag: "Compliance" },
  { title: "Marketing ROI", desc: "Campaign spend vs. qualified leads", icon: Wallet, tag: "Marketing" },
  { title: "Branch P&L", desc: "Branch-level profitability", icon: BarChart3, tag: "Finance" },
];

const iconMap: Record<string, any> = { "Admissions Funnel": BarChart3, "Revenue by Destination": PieChart, "Counsellor Productivity": Users, "Partner Contribution": Globe2, "Cash Flow Forecast": LineChart, "Visa Success Rate": FileBarChart, "Marketing ROI": Wallet, "Branch P&L": BarChart3 };

function ReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async ()=> {
      try { const r:any = await api.get<any[]>("/reports"); const d=r.data ?? r ?? []; return d.length ? d : fallback; } catch { return fallback; }
    },
  });
  const reports = (data as any[])?.length ? (data as any[]).map((r:any)=> ({ ...r, icon: iconMap[r.title] ?? BarChart3 })) : fallback;

  return (
    <>
      <PageHeader title="Reports" description="Curated dashboards and downloadable reports"
        actions={<Button className="rounded-lg"><Download className="h-4 w-4"/> Schedule Report</Button>} />

      {isLoading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/> Loading…</div> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((r:any)=>(
            <Card key={r.title} className="rounded-2xl shadow-soft transition hover:shadow-elevated">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary"><r.icon className="h-5 w-5"/></div>
                  <span className="rounded-md border px-2 py-0.5 text-[11px] text-muted-foreground">{r.tag}</span>
                </div>
                <CardTitle className="mt-3 text-base">{r.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg">View</Button>
                  <Button variant="ghost" size="sm" className="rounded-lg text-primary">Export</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
