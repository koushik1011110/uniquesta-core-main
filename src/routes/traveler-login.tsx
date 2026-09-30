import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Ticket, Phone, ArrowRight, ShieldCheck, Search, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/traveler-login")({
  head: () => ({
    meta: [
      { title: "Traveler & Passenger Portal · Uniquesta Travels" },
      { name: "description", content: "Mobile traveler portal: View digital boarding pass, check assigned driver, and live trip status." },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" },
    ],
  }),
  component: TravelerLoginPage,
});

function TravelerLoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ phoneOrRef: "" });

  const sampleTravelers = [
    { label: "Aman Barman (Group of 14)", ref: "UQ-TRV-1001", phone: "+91 98640 12345", route: "Guwahati ➔ Kaziranga" },
    { label: "Pooja Sharma & Family", ref: "UQ-TRV-1002", phone: "+91 98201 99882", route: "Airport ➔ Hotel Vivanta" },
    { label: "St. Xavier College Excursion", ref: "UQ-TRV-1003", phone: "+91 94351 22331", route: "Guwahati ➔ Cherrapunjee" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phoneOrRef.trim()) {
      toast.error("Please enter your mobile number or booking reference");
      return;
    }

    setLoading(true);
    try {
      const res: any = await api.post("/auth/traveler-login", {
        phone: form.phoneOrRef.trim(),
        booking_ref: form.phoneOrRef.trim(),
      });

      const data = res.data ?? res;
      if (!data.token) throw new Error("No token received");

      localStorage.setItem("uniquesta_traveler_token", data.token);
      localStorage.setItem("uniquesta_traveler_user", JSON.stringify(data.traveler));

      toast.success(`Welcome, ${data.traveler.name}! Opening your ticket...`);
      navigate({ to: "/traveler-portal" });
    } catch (err: any) {
      toast.error(err.message || "No booking found with this phone number or reference");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-white selection:bg-[#E52E20] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* ─── Mobile Header ─── */}
      <header className="px-3.5 py-3 sm:px-6 sm:py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/90 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shrink-0 shadow-md shadow-blue-950">
            <Ticket className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="font-black text-sm sm:text-base tracking-tight leading-none truncate flex items-center gap-1.5">
              <span>Uni<span className="text-[#E52E20]">Questa</span></span>
              <span className="text-[9px] sm:text-[10px] bg-blue-500/20 text-blue-300 font-mono px-1.5 py-0.5 rounded border border-blue-500/30 shrink-0">
                TRAVELER
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">
              E-Ticket & Boarding Pass
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800 text-xs px-2 sm:px-3 h-8 sm:h-9">
            <Link to="/driver-login">Driver ➔</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="border-slate-800 text-slate-300 hover:bg-slate-800 text-xs px-2.5 sm:px-3 h-8 sm:h-9 rounded-xl">
            <Link to="/login">Admin</Link>
          </Button>
        </div>
      </header>

      {/* ─── Main Check-in Card (Mobile-First Touch Ergonomics) ─── */}
      <main className="flex-1 flex items-center justify-center px-3.5 py-6 sm:p-6">
        <div className="w-full max-w-[420px] space-y-4 sm:space-y-6">
          <Card className="rounded-2xl border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur text-white overflow-hidden">
            <CardHeader className="p-4 sm:p-6 space-y-1 pb-3 sm:pb-4 border-b border-slate-800/60">
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-950/80 text-blue-300 border-blue-800 text-[10px] sm:text-[11px]">
                  Passenger Check-in
                </Badge>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">LIVE TICKET</span>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-black tracking-tight text-white pt-1">
                Find Your Travel Booking
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 leading-relaxed">
                Enter your registered mobile number or Booking Reference (e.g. UQ-TRV-1001) to view driver and boarding details.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    Mobile Number OR Booking Reference (Ref #) *
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      placeholder="e.g. +91 98640 12345 or UQ-TRV-1001"
                      value={form.phoneOrRef}
                      onChange={(e) => setForm({ phoneOrRef: e.target.value })}
                      className="pl-9 bg-slate-950 border-slate-700 text-white rounded-xl text-xs sm:text-sm h-11 placeholder:text-slate-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 sm:h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-950/40 transition-all flex items-center justify-center gap-1.5"
                >
                  {loading ? "Searching Your Ticket..." : "View My Trip & Driver Details ➔"}
                </Button>
              </form>

              {/* ─── Touch-Friendly 1-Tap Demo Check-ins ─── */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Quick Test Check-in (1-Tap):</span>
                  <span className="text-blue-400 font-normal">Sample Tickets</span>
                </div>
                <div className="space-y-2">
                  {sampleTravelers.map((st) => (
                    <button
                      key={st.ref}
                      type="button"
                      onClick={() => setForm({ phoneOrRef: st.ref })}
                      className="w-full text-left p-2.5 sm:p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 active:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-slate-200 group-hover:text-white flex items-center gap-1.5 truncate">
                          <span className="truncate">{st.label}</span>
                          <span className="font-mono text-[9px] sm:text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800 shrink-0">
                            {st.ref}
                          </span>
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">
                          {st.route}
                        </div>
                      </div>
                      <div className="h-7 w-7 rounded-lg bg-slate-800 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* ─── Mobile Footer ─── */}
      <footer className="p-3.5 border-t border-slate-800/80 text-center text-[11px] sm:text-xs text-slate-500 bg-slate-950/80">
        Uniquesta Passenger Care 24x7 · Helpline: <a href="tel:+919820011111" className="text-slate-300 font-bold hover:underline">+91 98200 11111</a>
      </footer>
    </div>
  );
}
