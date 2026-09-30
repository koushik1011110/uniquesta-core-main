import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ShieldCheck,
  CreditCard,
  Luggage,
  Car,
  Plus,
  CheckCircle2,
  PhoneCall,
  Clock,
  Globe,
  Building2,
  FileCheck,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/travel-services")({
  head: () => ({
    meta: [
      { title: "Forex & Travel Services · Uniquesta Tours & Travels" },
      {
        name: "description",
        content:
          "Student multi-currency forex cards, overseas health insurance, airline student baggage allowance & airport pickup services.",
      },
    ],
  }),
  component: TravelServicesPage,
});

const serviceFeatures = [
  {
    icon: CreditCard,
    title: "Student Forex Cards",
    desc: "Zero mark-up multi-currency cards with locked exchange rates for UK (GBP), US (USD), Canada (CAD), Europe (EUR) & Australia (AUD).",
    badge: "Instant Reload",
    tone: "bg-[#0A1628]",
  },
  {
    icon: ShieldCheck,
    title: "Overseas Medical Insurance",
    desc: "100% compliant with university and embassy visa criteria. Covers cashless hospitalization, COVID-19, baggage & flight loss.",
    badge: "Visa Compliant",
    tone: "bg-[#E52E20]",
  },
  {
    icon: Luggage,
    title: "Extra Student Baggage",
    desc: "Exclusive airline tie-ups with Emirates, Air Canada, Singapore Airlines & British Airways for 23kg x 2 checked-in bags.",
    badge: "Up to 46 Kg",
    tone: "bg-[#D4A017]",
  },
  {
    icon: Car,
    title: "Airport Meet & Greet",
    desc: "Safe pre-arranged airport pickup from London Heathrow, Toronto Pearson, Melbourne Tullamarine directly to campus/dormitory.",
    badge: "Verified Drivers",
    tone: "bg-[#0F2040]",
  },
];

function TravelServicesPage() {
  const qc = useQueryClient();
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    student_name: "",
    phone: "",
    service_type: "Student Multi-Currency Forex Card",
    destination_country: "United Kingdom (GBP)",
    amount_val: "GBP £ 2,500",
    provider: "UniQuesta Partner Bank",
    status: "Active",
  });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["travel-services"],
    queryFn: async () => {
      try {
        const res: any = await api.get("/travel/services");
        return res.data ?? res ?? [];
      } catch {
        return [];
      }
    },
  });

  const createService = useMutation({
    mutationFn: async () => api.post("/travel/services", form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["travel-services"] });
      setOpenModal(false);
      toast.success("Travel service request saved to database!");
      setForm({
        student_name: "",
        phone: "",
        service_type: "Student Multi-Currency Forex Card",
        destination_country: "United Kingdom (GBP)",
        amount_val: "GBP £ 2,500",
        provider: "UniQuesta Partner Bank",
        status: "Active",
      });
    },
    onError: (e: any) => toast.error(e.message || "Failed to submit request"),
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Student Travel, Forex & Insurance"
        description="Comprehensive pre-departure travel essentials for overseas university students"
        actions={
          <Button
            onClick={() => setOpenModal(true)}
            className="rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-semibold shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Service Request
          </Button>
        }
      />

      {/* ─── 4 Feature Cards ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {serviceFeatures.map((feat) => {
          const Icon = feat.icon;
          return (
            <Card key={feat.title} className="rounded-2xl border-[#E2E8F0] shadow-sm flex flex-col justify-between p-5">
              <div>
                <div className="flex items-center justify-between">
                  <div className={`grid h-11 w-11 place-items-center rounded-xl ${feat.tone} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-700">
                    {feat.badge}
                  </Badge>
                </div>
                <div className="mt-4 text-sm font-bold text-[#0A1628]">{feat.title}</div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ─── Active Service Requests Table ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0A1628]">
            Active Student Service Requests
          </h2>
          <span className="text-xs text-slate-500">
            Synced with MySQL (<code className="text-[#E52E20]">travel_services</code>)
          </span>
        </div>

        <Card className="rounded-2xl border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Request Ref</th>
                  <th className="px-4 py-3.5">Student Name</th>
                  <th className="px-4 py-3.5">Service Requested</th>
                  <th className="px-4 py-3.5">Destination Country</th>
                  <th className="px-4 py-3.5">Coverage / Load Value</th>
                  <th className="px-4 py-3.5">Partner Provider</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      Loading travel service requests from database...
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No active requests. Click "New Service Request" to create one.
                    </td>
                  </tr>
                ) : (
                  services.map((s: any) => (
                    <tr key={s.req_code || s.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-3.5 font-mono font-bold text-[#E52E20]">
                        {s.req_code}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[#0A1628]">{s.student_name}</div>
                        <div className="text-[11px] text-slate-400">{s.phone}</div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-800">
                        {s.service_type}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-600">
                        {s.destination_country}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-[#0A1628]">
                        {s.amount_val}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {s.provider}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ─── New Service Request Dialog ─── */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0A1628] flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#E52E20]" />
              New Student Travel Service
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-3.5 py-2 text-xs">
            <div>
              <Label className="text-xs">Student Full Name</Label>
              <Input
                placeholder="e.g. Sneha Kulkarni"
                value={form.student_name}
                onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                className="mt-1 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Student Phone</Label>
                <Input
                  placeholder="+91 98XXX XXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs">Destination Country</Label>
                <Input
                  placeholder="e.g. Canada / Germany"
                  value={form.destination_country}
                  onChange={(e) => setForm({ ...form, destination_country: e.target.value })}
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Service Type</Label>
              <Select
                value={form.service_type}
                onValueChange={(val) => setForm({ ...form, service_type: val })}
              >
                <SelectTrigger className="mt-1 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student Multi-Currency Forex Card">Student Multi-Currency Forex Card</SelectItem>
                  <SelectItem value="Overseas Comprehensive Medical Insurance">Overseas Comprehensive Medical Insurance</SelectItem>
                  <SelectItem value="Student Extra Baggage Allowance (23kg)">Student Extra Baggage Allowance (23kg)</SelectItem>
                  <SelectItem value="Airport Meet & Greet + Drop">Airport Meet & Greet + Drop</SelectItem>
                  <SelectItem value="International Student SIM & Data">International Student SIM & Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Coverage / Load Value</Label>
                <Input
                  placeholder="e.g. CAD $3,000 / 12 Months"
                  value={form.amount_val}
                  onChange={(e) => setForm({ ...form, amount_val: e.target.value })}
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs">Partner Provider</Label>
                <Input
                  placeholder="e.g. HDFC Bank / Allianz"
                  value={form.provider}
                  onChange={(e) => setForm({ ...form, provider: e.target.value })}
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenModal(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={() => createService.mutate()}
              disabled={createService.isPending}
              className="rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-semibold"
            >
              {createService.isPending ? "Submitting..." : "Save to Database"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
