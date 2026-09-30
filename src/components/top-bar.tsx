import { Bell, Search, HelpCircle, Plus, ChevronDown, LogOut, CheckCheck, Inbox, ArrowRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import { getUser, clearToken } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const user = getUser() ?? { name: "Mohammad Iqbal", email: "admin@uniquesta.com", role: "Super Admin", branch: "Guwahati HQ" };
  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Fetch real-time in-app notifications
  const { data: notifData } = useQuery({
    queryKey: ["notifications", user.email],
    queryFn: async () => {
      try {
        const res: any = await api.get(`/notifications?email=${encodeURIComponent(user.email)}`);
        return res.data ?? res ?? { data: [], unreadCount: 0 };
      } catch {
        return { data: [], unreadCount: 0 };
      }
    },
    refetchInterval: 3000,
  });

  const notifications: any[] = notifData?.data || [];
  const unreadCount: number = notifData?.unreadCount ?? notifications.filter((n) => !n.read_status).length;

  const markAllReadMut = useMutation({
    mutationFn: async () => {
      return api.post("/notifications/mark-all-read", { email: user.email });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
  });

  const markSingleRead = async (n: any) => {
    try {
      if (!n.read_status) {
        await api.put(`/notifications/${n.id}/read`, {});
        qc.invalidateQueries({ queryKey: ["notifications"] });
      }
      if (n.reference_id && n.reference_id.startsWith("REIMB-")) {
        navigate({ to: "/approvals" });
      }
    } catch {
      // noop
    }
  };

  const handleLogout = () => {
    clearToken();
    navigate({ to: "/login" });
  };
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search students, leads, universities, invoices…"
          className="h-10 rounded-xl border-border bg-muted/60 pl-9 focus-visible:bg-background"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline-block">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden rounded-lg lg:inline-flex" onClick={() => navigate({ to: "/approvals" })}>
          <Plus className="h-4 w-4" /> New Expense
        </Button>
        <Button variant="ghost" size="icon" className="rounded-lg text-muted-foreground">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Notifications Bell Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E52E20] px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-background animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[360px] p-0 shadow-lg">
            <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="h-5 px-1.5 text-[10px] font-semibold">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllReadMut.mutate()}
                  className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[340px] overflow-y-auto divide-y divide-border/60">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  <Inbox className="mx-auto mb-2 h-7 w-7 opacity-30" />
                  No new notifications right now.
                </div>
              ) : (
                notifications.slice(0, 10).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markSingleRead(n)}
                    className={`flex items-start gap-3 p-3.5 text-xs transition cursor-pointer hover:bg-muted/60 ${
                      !n.read_status ? "bg-red-500/[0.04]" : "opacity-80"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                        !n.read_status
                          ? "bg-[#E52E20]/15 text-[#E52E20]"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {n.sender_name
                        ? n.sender_name
                            .split(" ")
                            .map((x: string) => x[0])
                            .join("")
                            .slice(0, 2)
                        : "UQ"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`font-semibold truncate ${!n.read_status ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                          {n.title}
                        </p>
                        {!n.read_status && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[#E52E20]" />
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-foreground/80">
                        {n.message}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-muted-foreground">
                        <span>{n.created_at ? new Date(n.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Just now"}</span>
                        {n.reference_id && (
                          <span className="font-mono text-primary flex items-center gap-0.5">
                            {n.reference_id} <ArrowRight className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t p-2 text-center bg-muted/20">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs font-medium text-primary hover:text-primary"
                onClick={() => navigate({ to: "/approvals" })}
              >
                Go to Expense Approval Portal ➔
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 hover:bg-muted border border-border/40 transition">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#E52E20] text-white text-xs font-bold shadow-sm">
                {initials}
              </div>
              <div className="hidden text-left md:block">
                <div className="text-xs font-semibold leading-tight text-foreground flex items-center gap-1.5">
                  {user.name}
                  {user.role === "super_admin" && (
                    <span className="rounded bg-red-100 text-[#E52E20] text-[9.5px] px-1 py-0.2 font-bold">HQ</span>
                  )}
                  {user.role === "branch_admin" && (
                    <span className="rounded bg-purple-100 text-purple-700 text-[9.5px] px-1 py-0.2 font-bold">Branch Head</span>
                  )}
                </div>
                <div className="text-[11px] leading-tight text-muted-foreground capitalize">
                  {user.role === "super_admin" ? "Super Admin" : user.role === "branch_admin" ? "Branch Admin" : (user.role || "").replace(/_/g, " ")}
                </div>
              </div>
              <Badge variant="outline" className="ml-1 hidden rounded-md border-primary/30 bg-primary/10 text-[10.5px] font-semibold text-primary md:inline-flex">
                {user.branch || "Guwahati HQ"}
              </Badge>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="text-sm font-bold text-foreground">{user.name}</div>
              <div className="text-xs font-normal text-muted-foreground">{user.email}</div>
              <div className="mt-2 space-y-1 rounded-lg bg-slate-50 p-2 text-[11px] text-slate-600 border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Role:</span>
                  <span className="font-mono text-slate-800 font-bold uppercase">{user.role || "Admin"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Branch:</span>
                  <span className="text-slate-800">{user.branch || "Guwahati HQ"}</span>
                </div>
                {user.reports_to && (
                  <div className="pt-1 border-t border-slate-200 text-slate-500">
                    <span className="font-semibold text-slate-700 block text-[10px] uppercase">Reports To:</span>
                    <span className="text-slate-800 text-[10.5px] font-medium">{user.reports_to}</span>
                  </div>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
