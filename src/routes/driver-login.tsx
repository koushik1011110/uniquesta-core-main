import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bus, Phone, ArrowRight, Lock, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/driver-login")({
  head: () => ({
    meta: [
      { title: "Driver & Bus Captain Login · Uniquesta Travels" },
      { name: "description", content: "Mobile driver terminal login for Uniquesta Tours & Travels fleet captains." },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" },
    ],
  }),
  component: DriverLoginPage,
});

function DriverLoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ phone: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone.trim()) {
      toast.error("Please enter your mobile number or name");
      return;
    }

    setLoading(true);
    try {
      const res: any = await api.post("/auth/driver-login", {
        phone: form.phone.trim(),
        password: form.password || "driver123",
      });

      const data = res.data ?? res;
      if (!data.token) throw new Error("No driver token returned");

      localStorage.setItem("uniquesta_driver_token", data.token);
      localStorage.setItem("uniquesta_driver_user", JSON.stringify(data.driver));

      toast.success(`Welcome back, Captain ${data.driver.name}!`);
      navigate({ to: "/driver-portal" });
    } catch (err: any) {
      toast.error(err.message || "Driver login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-white selection:bg-[#E52E20] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* ─── Mobile-Optimized Top Bar ─── */}
      <header className="px-3.5 py-3 sm:px-6 sm:py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/90 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#E52E20] flex items-center justify-center font-black text-white shrink-0 shadow-md shadow-red-950">
            <Bus className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="font-black text-sm sm:text-base tracking-tight leading-none truncate flex items-center gap-1.5">
              <span>Uni<span className="text-[#E52E20]">Questa</span></span>
              <span className="text-[9px] sm:text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.5 rounded border border-amber-500/30 shrink-0">
                DRIVER
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">
              Fleet Operations
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800 text-xs px-2 sm:px-3 h-8 sm:h-9">
            <Link to="/traveler-login">Traveler ➔</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="border-slate-800 text-slate-300 hover:bg-slate-800 text-xs px-2.5 sm:px-3 h-8 sm:h-9 rounded-xl">
            <Link to="/login">Admin</Link>
          </Button>
        </div>
      </header>

      {/* ─── Main Content Container (Mobile-First Touch Ergonomics) ─── */}
      <main className="flex-1 flex items-center justify-center px-3.5 py-6 sm:p-6">
        <div className="w-full max-w-[420px] space-y-4 sm:space-y-6">
          <Card className="rounded-2xl border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur text-white overflow-hidden">
            <CardHeader className="p-4 sm:p-6 space-y-1 pb-3 sm:pb-4 border-b border-slate-800/60">
              <div className="flex items-center justify-between">
                <Badge className="bg-red-950/80 text-red-300 border-red-800 text-[10px] sm:text-[11px]">
                  Driver Terminal Login
                </Badge>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">AS-FLEET</span>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-black tracking-tight text-white pt-1">
                Bus Driver & Fleet Portal
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 leading-relaxed">
                Log in to check today&apos;s assigned passengers, pickup locations, and start trips.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    Mobile Number OR Driver Name *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      type="tel"
                      inputMode="tel"
                      placeholder="Enter registered mobile number or name"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="pl-9 bg-slate-950 border-slate-700 text-white rounded-xl text-xs sm:text-sm h-11 placeholder:text-slate-500 focus:border-[#E52E20]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <Label className="font-semibold text-slate-300">PIN / Password</Label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      type="password"
                      placeholder="Enter driver PIN or password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="pl-9 bg-slate-950 border-slate-700 text-white rounded-xl text-xs sm:text-sm h-11 placeholder:text-slate-500 focus:border-[#E52E20]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 sm:h-12 rounded-xl bg-[#E52E20] hover:bg-[#C82114] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-900/40 transition-all flex items-center justify-center gap-1.5"
                >
                  {loading ? "Verifying Driver..." : "Login to Driver Portal ➔"}
                </Button>
              </form>

              {/* Informational Fleet Note */}
              <div className="pt-3 border-t border-slate-800/80 text-center">
                <p className="text-[11px] text-slate-400">
                  Captain registration is managed centrally by Uniquesta Super Admin / Fleet Dispatch. If you need account credentials or password reset, contact fleet operations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* ─── Mobile-Friendly Footer ─── */}
      <footer className="p-3.5 border-t border-slate-800/80 text-center text-[11px] sm:text-xs text-slate-500 bg-slate-950/80">
        Uniquesta Fleet Operations 24x7 · Driver Helpline: <a href="tel:+919820011111" className="text-slate-300 font-bold hover:underline">+91 98200 11111</a>
      </footer>
    </div>
  );
}
