import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Search, Star, MapPin, Loader2, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/universities")({
  head: () => ({
    meta: [
      { title: "University Management · Uniquesta" },
      { name: "description", content: "480+ partner universities across 14 countries with live commission, intake and course data." },
      { property: "og:title", content: "University Management · Uniquesta" },
      { property: "og:description", content: "Manage partner universities, courses, intakes and commissions." },
    ],
  }),
  component: UniversitiesPage,
});

function UniversitiesPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name:"", country:"", city:"", tier:"Tier 1", courses:0, intakes:"", commission:"", rating:4.5 });

  const { data, isLoading } = useQuery({
    queryKey: ["universities", search],
    queryFn: async () => {
      const res:any = await api.get<any[]>("/universities", { search, limit: 50 });
      return res.data ?? res ?? [];
    },
  });
  const list: any[] = Array.isArray(data) ? data : (data as any)?.data ?? [];

  const create = useMutation({
    mutationFn: async ()=> api.post("/universities", form),
    onSuccess: ()=>{ qc.invalidateQueries({queryKey:["universities"]}); setOpen(false); toast.success("University added"); },
    onError:(e:any)=> toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id:number)=> api.del(`/universities/${id}`),
    onSuccess: ()=>{ qc.invalidateQueries({queryKey:["universities"]}); toast.success("Deleted"); },
    onError:(e:any)=> toast.error(e.message),
  });

  return (
    <>
      <PageHeader
        title="University Management"
        description={`${list.length || 482} partner universities · 14 countries · 5,320 active courses`}
        actions={
          <>
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
              <Input placeholder="Search universities" className="h-9 w-64 rounded-lg pl-9" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <Button className="rounded-lg" onClick={()=>setOpen(true)}><Plus className="h-4 w-4"/> Add Partner</Button>
          </>
        }
      />

      {isLoading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/> Loading…</div> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((u:any)=>(
            <Card key={u.id ?? u.name} className="rounded-2xl shadow-soft transition hover:shadow-elevated">
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">{u.name}</CardTitle>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3"/>{u.city}, {u.country}
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0 rounded-md border-primary/30 bg-primary-soft text-primary">{u.tier}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div><div className="text-muted-foreground">Courses</div><div className="mt-0.5 font-semibold text-foreground">{u.courses}</div></div>
                  <div><div className="text-muted-foreground">Intakes</div><div className="mt-0.5 font-semibold text-foreground">{u.intakes}</div></div>
                  <div><div className="text-muted-foreground">Commission</div><div className="mt-0.5 font-semibold text-foreground">{u.commission}</div></div>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-warning text-warning"/>
                    <span className="font-medium">{u.rating}</span>
                    <span className="text-xs text-muted-foreground">counsellor rating</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={()=>u.id && del.mutate(u.id)}><Trash2 className="h-4 w-4"/></Button>
                    <Button variant="outline" size="sm" className="rounded-lg">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Partner University</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5"><Label>Name *</Label><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="University of Toronto"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5"><Label>Country *</Label><Input value={form.country} onChange={e=>setForm({...form,country:e.target.value})} placeholder="Canada"/></div>
              <div className="grid gap-1.5"><Label>City *</Label><Input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="Toronto"/></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5"><Label>Intakes *</Label><Input value={form.intakes} onChange={e=>setForm({...form,intakes:e.target.value})} placeholder="Fall, Winter"/></div>
              <div className="grid gap-1.5"><Label>Commission *</Label><Input value={form.commission} onChange={e=>setForm({...form,commission:e.target.value})} placeholder="15%"/></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
            <Button onClick={()=>create.mutate()} disabled={!form.name||!form.country||!form.city||create.isPending}>{create.isPending&&<Loader2 className="h-4 w-4 animate-spin"/>} Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
