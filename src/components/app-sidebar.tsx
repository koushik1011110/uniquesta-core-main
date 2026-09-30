import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  GraduationCap,
  Wallet,
  CheckSquare,
  Handshake,
  User,
  Briefcase,
  BarChart3,
  Settings,
  Plane,
  Compass,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { getUser, isStaffRole } from "@/lib/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SubItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface DropdownMenu {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems: SubItem[];
  highlight?: boolean;
}

const dropdownMenus: DropdownMenu[] = [
  {
    title: "Students & Admissions",
    icon: Users,
    subItems: [
      { title: "Student Admissions", url: "/students", icon: Users },
      { title: "Lead Management", url: "/leads", icon: UserPlus },
      { title: "Applications", url: "/applications", icon: FileText },
      { title: "Global Universities", url: "/universities", icon: GraduationCap },
    ],
  },
  {
    title: "Uniquesta Tours & Travels",
    icon: Plane,
    highlight: true,
    subItems: [
      { title: "Travel & Fleet Bookings", url: "/travel", icon: Plane },
      { title: "Destinations & Tours", url: "/travel-destinations", icon: Compass },
      { title: "Forex & Travel Support", url: "/travel-services", icon: ShieldCheck },
    ],
  },
  {
    title: "Operations & Finance",
    icon: Briefcase,
    subItems: [
      { title: "Finance & Invoices", url: "/finance", icon: Wallet },
      { title: "Partner Profit Sharing", url: "/partners", icon: Handshake },
      { title: "Expense Approvals", url: "/approvals", icon: CheckSquare },
      { title: "HR & Staff", url: "/hr", icon: Briefcase },
      { title: "Reports & Analytics", url: "/reports", icon: BarChart3 },
    ],
  },
  {
    title: "System & Settings",
    icon: Settings,
    subItems: [
      { title: "General Settings", url: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const user = getUser();
  const isStaff = isStaffRole(user);

  const isExactActive = (url: string) => pathname === url;
  const isSubActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200/80 bg-white">
      {/* ─── Header / Logo ─── */}
      <SidebarHeader className="border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden border border-slate-200 bg-white shadow-sm flex items-center justify-center p-0.5">
            <img src="/logo.png" alt="UniQuesta Logo" className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-[16px] font-black tracking-tight leading-none">
              <span className="text-black">Uni</span><span className="text-[#E52E20]">Questa</span>
            </div>
            <div className="truncate text-[9.5px] font-serif font-bold tracking-wider uppercase text-slate-800 mt-1">
              INTERNATIONAL
            </div>
          </div>
        </div>
      </SidebarHeader>

      {/* ─── Navigation ─── */}
      <SidebarContent className="px-1 py-2">
        {/* Standalone Dashboard Link */}
        <SidebarGroup className="p-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isExactActive("/")}
                tooltip="Dashboard"
                className="data-[active=true]:bg-red-50 data-[active=true]:text-[#E52E20] data-[active=true]:font-bold font-medium text-slate-700 hover:bg-slate-100 rounded-xl py-2"
              >
                <Link to="/">
                  <LayoutDashboard className="h-4 w-4 text-[#E52E20]" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Dropdown Menu Categories */}
        <SidebarGroup className="p-1">
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1">
            Main Menus
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {dropdownMenus.map((menu) => {
              // Hide restricted items (e.g. Partner Profit Sharing, HR & Staff) for staff portal
              const filteredSubItems = menu.subItems.filter((sub) => {
                if (sub.url === "/partners" && isStaff) return false;
                if (sub.url === "/hr" && isStaff) return false;
                return true;
              });

              if (filteredSubItems.length === 0) return null;

              const isAnyChildActive = filteredSubItems.some((sub) => isSubActive(sub.url));

              return (
                <Collapsible
                  key={menu.title}
                  asChild
                  defaultOpen={isAnyChildActive || menu.highlight}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={menu.title}
                        isActive={isAnyChildActive}
                        className={`w-full justify-between rounded-xl px-2.5 py-2 font-semibold text-sm transition-all select-none cursor-pointer ${
                          menu.highlight
                            ? "hover:bg-red-50/70 text-slate-900"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        } ${
                          isAnyChildActive
                            ? "bg-slate-100/90 text-slate-900 font-bold"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <menu.icon
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              menu.highlight || isAnyChildActive
                                ? "text-[#E52E20]"
                                : "text-slate-500 group-hover/collapsible:text-slate-700"
                            }`}
                          />
                          <span className="truncate text-xs">{menu.title}</span>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="transition-all duration-200 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                      <SidebarMenuSub className="ml-5 border-l-2 border-slate-200/80 pl-2.5 py-1 my-0.5 space-y-0.5">
                        {filteredSubItems.map((sub) => {
                          const active = isSubActive(sub.url);
                          return (
                            <SidebarMenuSubItem key={sub.url}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={active}
                                size="sm"
                                className={`rounded-lg px-2 py-1.5 text-xs transition-all ${
                                  active
                                    ? "bg-red-50 text-[#E52E20] font-bold border-l-2 border-[#E52E20]"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                                }`}
                              >
                                <Link to={sub.url} className="flex items-center gap-2">
                                  <sub.icon
                                    className={`h-3.5 w-3.5 shrink-0 ${
                                      active ? "text-[#E52E20]" : "text-slate-400"
                                    }`}
                                  />
                                  <span className="truncate">{sub.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* ─── Footer User Profile ─── */}
      <SidebarFooter className="border-t border-slate-100">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary text-xs font-semibold">
            {user
              ? user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "MI"}
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-xs font-semibold">{user?.name ?? "Mohammad Iqbal"}</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {user ? `${user.branch} · ${user.role}` : "Guwahati HQ · Admin"}
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
