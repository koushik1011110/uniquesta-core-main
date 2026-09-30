import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Filter, FileText, Loader2, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/applications")({
  head: () => ({
    meta: [
      { title: "Application Management · Uniquesta" },
      { name: "description", content: "Track document collection, submission and offer status across every university." },
      { property: "og:title", content: "Application Management · Uniquesta" },
      { property: "og:description", content: "End-to-end university application tracking." },
    ],
  }),
  component: ApplicationsPage,
});

const statusTone: Record<string,string> = {
  "In Progress": "bg-info/10 text-info",
  "Offer": "bg-success/10 text-success",
  "Under Review": "bg-warning/15 text-warning",
  "Visa Filed": "bg-primary/10 text-primary",
  "Enrolled": "bg-success/10 text-success",
};

function ApplicationsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ student:"", university:"", program:"", intake:"Fall 2026", stage:"Documents", progress:0, status:"In Progress" });

  const { data, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const res:any = await api.get<any[]>("/applications", { limit: 100 });
      return res.data ?? res ?? [];
    },
  });
  const list: any[] = Array.isArray(data) ? data : (data as any)?.data ?? [];
  const kpis = [
    { label: "Open Applications", value: String(list.length || 986) },
    { label: "Offers Received", value: String(list.filter((a:any)=>a.status==="Offer").length || 287) },
    { label: "Avg. Turnaround", value: "4.2 days" },
    { label: "Rejection Rate", value: "6.8%" },
  ];

  const create = useMutation({
    mutationFn: async ()=> api.post("/applications", form),
    onSuccess: ()=>{ qc.invalidateQueries({queryKey:["applications"]}); setOpen(false); toast.success("Application created"); },
    onError:(e:any)=> toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (code:string)=> api.del(`/applications/${code}`),
    onSuccess: ()=>{ qc.invalidateQueries({queryKey:["applications"]}); toast.success("Deleted"); },
    onError:(e:any)=> toast.error(e.message),
  });

  return (
    <>
      <PageHeader
        title="Application Management"
        description="Every university application, in one workspace"
        actions={
          <>
            <Button variant="outline" className="rounded-lg"><Filter className="h-4 w-4"/> Filter</Button>
            <Button className="rounded-lg" onClick={()=>setOpen(true)}><Plus className="h-4 w-4"/> New Application</Button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(k=>(
          <Card key={k.label} className="rounded-2xl shadow-soft">
            <CardContent className="p-5">
              <div className="text-2xl font-bold">{k.value}</div>
              <div className="text-sm text-muted-foreground">{k.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/> Loading…</div> : (
        <div className="grid gap-3">
          {list.map((a:any)=>(
            <Card key={a.id ?? a.code} className="rounded-2xl shadow-soft transition hover:shadow-card">
              <CardContent className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto]">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-3.5 w-3.5"/>{a.code} · {a.intake}
                  </div>
                  <div className="mt-1 truncate font-semibold">{a.student} → {a.university}</div>
                  <div className="truncate text-sm text-muted-foreground">{a.program}</div>
                </div>
                <div className="hidden min-w-0 sm:block">
                  <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{a.stage}</span><span>{a.progress}%</span>
                  </div>
                  <Progress value={Number(a.progress)||0} className="h-1.5"/>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`hidden rounded-full px-2 py-0.5 text-xs font-medium sm:inline-flex ${statusTone[a.status] ?? "bg-muted text-muted-foreground"}`}>{a.status}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={()=>del.mutate(a.code)}><Trash2 className="h-4 w-4"/></Button>
                  <Button variant="outline" size="sm" className="rounded-lg">Open</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {list.length===0 && <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No applications yet</p>}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Application</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5"><Label>Student *</Label><Input value={form.student} onChange={e=>setForm({...form,student:e.target.value})} placeholder="Priya Nair"/></div>
            <div className="grid gap-1.5"><Label>University *</Label><Input value={form.university} onChange={e=>setForm({...form,university:e.target.value})} placeholder="University of Toronto"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5"><Label>Program *</Label><Input value={form.program} onChange={e=>setForm({...form,program:e.target.value})} placeholder="MSc Computer Science"/></div>
              <div className="grid gap-1.5"><Label>Intake</Label><Input value={form.intake} onChange={e=>setForm({...form,intake:e.target.value})} placeholder="Fall 2026"/></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5"><Label>Stage</Label>
                <Select value={form.stage} onValueChange={v=>setForm({...form,stage:v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Documents">Documents</SelectItem><SelectItem value="Submitted">Submitted</SelectItem><SelectItem value="Offer Received">Offer Received</SelectItem><SelectItem value="Visa">Visa</SelectItem><SelectItem value="Enrolled">Enrolled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5"><Label>Status</Label>
                <Select value={form.status} onValueChange={v=>setForm({...form,status:v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="Under Review">Under Review</SelectItem><SelectItem value="Offer">Offer</SelectItem><SelectItem value="Visa Filed">Visa Filed</SelectItem><SelectItem value="Enrolled">Enrolled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
            <Button onClick={()=>create.mutate()} disabled={!form.student||!form.university||create.isPending}>{create.isPending&&<Loader2 className="h-4 w-4 animate-spin"/>} Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
