import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Download, Plus, ArrowDownLeft, ArrowUpRight, Loader2, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/finance")({
  head: () => ({
    meta: [
      { title: "Finance · Uniquesta ERP" },
      { name: "description", content: "Invoicing, tuition collections, refunds, commissions and multi-branch P&L." },
      { property: "og:title", content: "Finance · Uniquesta ERP" },
      { property: "og:description", content: "Enterprise finance and receivables for education consultancy." },
    ],
  }),
  component: FinancePage,
});

const tone: Record<string,string> = { Paid:"bg-success/10 text-success", Pending:"bg-warning/15 text-warning", Overdue:"bg-destructive/10 text-destructive" };

function FinancePage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ student:"", amount:"", type:"Tuition Instalment", status:"Pending", date: new Date().toISOString().slice(0,10) });

  const { data, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async ()=> {
      const res:any = await api.get<any[]>("/invoices", { limit:50 });
      return res.data ?? res ?? [];
    }
  });
  const invoices: any[] = Array.isArray(data) ? data : (data as any)?.data ?? [];

  const create = useMutation({
    mutationFn: async ()=> api.post("/invoices", { ...form, amount_value: parseInt(form.amount.replace(/\D/g,""),10)||0, currency: form.amount.includes("€")?"EUR":form.amount.includes("$")?"USD":"INR" }),
    onSuccess: ()=>{ qc.invalidateQueries({queryKey:["invoices"]}); setOpen(false); toast.success("Invoice created"); },
    onError:(e:any)=> toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (code:string)=> api.del(`/invoices/${code}`),
    onSuccess: ()=>{ qc.invalidateQueries({queryKey:["invoices"]}); toast.success("Deleted"); },
    onError:(e:any)=> toast.error(e.message),
  });

  return (
    <>
      <PageHeader
        title="Finance"
        description="FY 2026 · Consolidated across all branches"
        actions={
          <>
            <Button variant="outline" className="rounded-lg"><Download className="h-4 w-4"/> Export</Button>
            <Button className="rounded-lg" onClick={()=>setOpen(true)}><Plus className="h-4 w-4"/> New Invoice</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Revenue MTD", value: "₹ 6.42 Cr", delta: "+18%", up: true },
          { label: "Receivables", value: "₹ 1.87 Cr", delta: "-4%", up: true },
          { label: "Refunds", value: "₹ 32.1 L", delta: "+2%", up: false },
          { label: "Commissions Earned", value: "₹ 2.16 Cr", delta: "+11%", up: true },
        ].map(k=>(
          <Card key={k.label} className="rounded-2xl shadow-soft">
            <CardContent className="p-5">
              <div className="text-sm text-muted-foreground">{k.label}</div>
              <div className="mt-1 text-2xl font-bold">{k.value}</div>
              <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${k.up?"bg-success/10 text-success":"bg-destructive/10 text-destructive"}`}>
                {k.up ? <ArrowUpRight className="h-3 w-3"/> : <ArrowDownLeft className="h-3 w-3"/>}{k.delta}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 rounded-2xl shadow-soft">
        <CardHeader><CardTitle className="text-base">Recent Invoices</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Invoice</th>
                  <th className="px-5 py-3 text-left font-medium">Student</th>
                  <th className="px-5 py-3 text-left font-medium">Type</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3 text-left font-medium">Date</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? <tr><td colSpan={7} className="px-5 py-6 text-center text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin inline"/> Loading…</td></tr> : invoices.map((i:any)=>(
                  <tr key={i.id ?? i.code} className="border-t border-border/60 hover:bg-muted/30">
                    <td className="px-5 py-3 font-medium">{i.code}</td>
                    <td className="px-5 py-3">{i.student}</td>
                    <td className="px-5 py-3 text-muted-foreground">{i.type}</td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums">{i.amount}</td>
                    <td className="px-5 py-3 text-muted-foreground">{i.date ? new Date(i.date).toLocaleDateString() : i.date}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone[i.status] ?? "bg-muted text-muted-foreground"}`}>{i.status}</span>
                    </td>
                    <td className="px-5 py-3 text-right"><Button variant="ghost" size="icon" className="h-7 w-7" onClick={()=>del.mutate(i.code)}><Trash2 className="h-3.5 w-3.5"/></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Invoice</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5"><Label>Student *</Label><Input value={form.student} onChange={e=>setForm({...form,student:e.target.value})} placeholder="Priya Nair"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5"><Label>Amount *</Label><Input value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="₹ 1,24,000"/></div>
              <div className="grid gap-1.5"><Label>Type</Label>
                <Select value={form.type} onValueChange={v=>setForm({...form,type:v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tuition Instalment">Tuition Instalment</SelectItem>
                    <SelectItem value="Service Fee">Service Fee</SelectItem>
                    <SelectItem value="Application Fee">Application Fee</SelectItem>
                    <SelectItem value="Visa & Travel">Visa & Travel</SelectItem>
                    <SelectItem value="University Fee">University Fee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5"><Label>Date</Label><Input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /></div>
              <div className="grid gap-1.5"><Label>Status</Label>
                <Select value={form.status} onValueChange={v=>setForm({...form,status:v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
            <Button onClick={()=>create.mutate()} disabled={!form.student||!form.amount||create.isPending}>{create.isPending&&<Loader2 className="h-4 w-4 animate-spin"/>} Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
