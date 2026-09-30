import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "@/components/top-bar";
import { isLoggedIn, getUser } from "@/lib/auth";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!isLoggedIn()) {
        navigate({ to: "/login" });
        return;
      }
      try {
        await api.get("/auth/me");
        setChecking(false);
      } catch {
        localStorage.removeItem("uniquesta_token");
        localStorage.removeItem("uniquesta_user");
        navigate({ to: "/login" });
      }
    };
    check();
  }, [navigate]);

  if (checking && isLoggedIn()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="text-sm text-muted-foreground">Checking session...</div>
      </div>
    );
  }

  // if not logged in, will redirect — avoid flash
  if (!isLoggedIn()) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col bg-background">
          <TopBar />
          <main className="flex-1 overflow-x-hidden">
            <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
