import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Compass,
  MapPin,
  Calendar,
  Star,
  Check,
  Plus,
  ArrowRight,
  ShieldCheck,
  Luggage,
  Sparkles,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export const Route = createFileRoute("/_app/travel-destinations")({
  head: () => ({
    meta: [
      { title: "Tour Destinations & Packages · Uniquesta Tours & Travels" },
      {
        name: "description",
        content:
          "Explore international and domestic tour packages, university campus tours, and holiday itineraries with Uniquesta Tours & Travels.",
      },
    ],
  }),
  component: TravelDestinationsPage,
});

function TravelDestinationsPage() {
  const qc = useQueryClient();
  const [openNewModal, setOpenNewModal] = useState(false);
  const [openBookModal, setOpenBookModal] = useState<any>(null);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");

  const [form, setForm] = useState({
    title: "",
    country: "",
    duration: "6 Days / 5 Nights",
    category: "Holiday Package",
    price: "₹ 65,000",
    rating: "4.8",
    inclusions: "Direct Flights, 4-Star Hotels, Daily Breakfast, Guided Sightseeing, Visa Support",
    best_season: "All Year Round",
    badge: "Popular",
  });

  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ["travel-destinations"],
    queryFn: async () => {
      try {
        const res: any = await api.get("/travel/destinations");
        return res.data ?? res ?? [];
      } catch {
        return [];
      }
    },
  });

  const createDestination = useMutation({
    mutationFn: async () => {
      return api.post("/travel/destinations", form);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["travel-destinations"] });
      setOpenNewModal(false);
      toast.success("New tour package published to database!");
      setForm({
        title: "",
        country: "",
        duration: "6 Days / 5 Nights",
        category: "Holiday Package",
        price: "₹ 65,000",
        rating: "4.8",
        inclusions: "Direct Flights, 4-Star Hotels, Daily Breakfast, Guided Sightseeing, Visa Support",
        best_season: "All Year Round",
        badge: "Popular",
      });
    },
    onError: (e: any) => toast.error(e.message || "Failed to publish package"),
  });

  const handleBookInquiry = () => {
    if (!inquiryName) {
      toast.error("Please enter your name");
      return;
    }
    toast.success(`Inquiry for ${openBookModal?.title} submitted! Our travel desk will contact you.`);
    setOpenBookModal(null);
    setInquiryName("");
    setInquiryPhone("");
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Tour Destinations & Packages"
        description="Curated international holiday packages, university campus edu-tours & customized itineraries"
        actions={
          <Button
            onClick={() => setOpenNewModal(true)}
            className="rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-semibold shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Tour Package
          </Button>
        }
      />

      {/* ─── Destination Grid ─── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((dest: any) => (
          <Card
            key={dest.code || dest.id}
            className="rounded-2xl border-[#E2E8F0] shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
          >
            <div>
              {/* Card Header Banner */}
              <div className="bg-gradient-to-r from-[#0A1628] to-[#0F2040] p-5 text-white relative">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="border-[#FF7A2D]/40 bg-[#FF7A2D]/10 text-[#FF7A2D] text-[10px] font-bold"
                  >
                    {dest.badge || "Featured"}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {dest.rating || "4.8"}
                  </div>
                </div>

                <h3 className="mt-3 text-base font-bold leading-snug group-hover:text-[#FF7A2D] transition">
                  {dest.title}
                </h3>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-[#FF7A2D]" />
                  {dest.country}
                </div>
              </div>

              {/* Card Body */}
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="h-4 w-4 text-[#E52E20]" />
                    {dest.duration}
                  </span>
                  <Badge variant="secondary" className="text-[11px] font-semibold">
                    {dest.category}
                  </Badge>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Package Inclusions:
                  </div>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {dest.inclusions || "Flights, Hotels, Daily Breakfast, Transfers & Visa"}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Best Season:</span>
                  <span className="font-semibold text-slate-700">{dest.best_season || "All Year"}</span>
                </div>
              </CardContent>
            </div>

            {/* Card Footer */}
            <div className="border-t border-slate-100 p-5 bg-slate-50/50 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Starting from</div>
                <div className="text-lg font-black text-[#0A1628]">{dest.price}</div>
              </div>
              <Button
                onClick={() => setOpenBookModal(dest)}
                className="rounded-xl bg-[#0A1628] hover:bg-[#0F2040] text-white font-semibold text-xs"
              >
                Inquire & Book <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* ─── Inquiry Dialog ─── */}
      <Dialog open={Boolean(openBookModal)} onOpenChange={() => setOpenBookModal(null)}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0A1628] flex items-center gap-2">
              <Compass className="h-5 w-5 text-[#E52E20]" />
              Book / Inquire Tour Package
            </DialogTitle>
          </DialogHeader>

          {openBookModal && (
            <div className="space-y-4 py-2 text-xs">
              <div className="rounded-xl bg-[#0A1628] p-4 text-white">
                <div className="text-xs font-semibold text-[#FF7A2D]">Selected Tour</div>
                <div className="text-base font-bold mt-0.5">{openBookModal.title}</div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-xs">
                  <span>Duration: {openBookModal.duration}</span>
                  <span className="font-bold text-[#FF7A2D]">{openBookModal.price}</span>
                </div>
              </div>

              <div>
                <Label className="text-xs">Your Name / Group Lead</Label>
                <Input
                  placeholder="e.g. Ramesh Kalita"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="mt-1 rounded-xl"
                />
              </div>

              <div>
                <Label className="text-xs">Contact Phone / WhatsApp</Label>
                <Input
                  placeholder="+91 98XXX XXXXX"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenBookModal(null)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBookInquiry}
              className="rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-semibold"
            >
              Submit Travel Inquiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Add Package Dialog ─── */}
      <Dialog open={openNewModal} onOpenChange={setOpenNewModal}>
        <DialogContent className="sm:max-w-[520px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0A1628] flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#E52E20]" />
              Publish New Tour Package
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-3.5 py-2 text-xs">
            <div>
              <Label className="text-xs">Package Title</Label>
              <Input
                placeholder="e.g. Tokyo & Mount Fuji Cherry Blossom Tour"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Destination Country</Label>
                <Input
                  placeholder="e.g. Japan / Switzerland"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs">Duration</Label>
                <Input
                  placeholder="e.g. 7 Days / 6 Nights"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(val) => setForm({ ...form, category: val })}
                >
                  <SelectTrigger className="mt-1 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Holiday Package">Holiday Package</SelectItem>
                    <SelectItem value="Student Edu-Tour">Student Edu-Tour</SelectItem>
                    <SelectItem value="Domestic Wonder">Domestic Wonder</SelectItem>
                    <SelectItem value="Corporate Retreat">Corporate Retreat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Starting Price</Label>
                <Input
                  placeholder="e.g. ₹ 85,000"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Key Inclusions</Label>
              <Textarea
                placeholder="Direct Flights, 4-Star Hotel, Visa, Daily Breakfast, Sightseeing Pass"
                value={form.inclusions}
                onChange={(e) => setForm({ ...form, inclusions: e.target.value })}
                className="mt-1 rounded-xl resize-none h-20"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenNewModal(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={() => createDestination.mutate()}
              disabled={createDestination.isPending}
              className="rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-semibold"
            >
              {createDestination.isPending ? "Publishing..." : "Publish to Database"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
