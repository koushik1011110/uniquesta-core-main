import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "./_libs/react.mjs";
import { u as Slot } from "./_libs/@radix-ui/react-avatar+[...].mjs";
import { t as cva } from "./_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as Button } from "./_ssr/button-Th46ikol.mjs";
import { t as Input } from "./_ssr/input-CWiOSw9Q.mjs";
import { t as api } from "./_ssr/api-06dRWXHB.mjs";
import { t as Badge } from "./_ssr/badge-h6Nj5OpU.mjs";
import { i as isStaffRole, n as getUser, r as isLoggedIn, t as clearToken } from "./_ssr/auth-CMDgS_mZ.mjs";
import { t as Separator } from "./_ssr/separator-C6bIjWry.mjs";
import { d as useRouterState, m as Outlet, v as Link, y as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { At as ChartColumn, B as LogOut, Ct as ChevronRight, D as Plane, Dt as CheckCheck, Et as Check, Lt as Briefcase, N as PanelLeft, Rt as Bell, T as Plus, U as LayoutDashboard, Vt as ArrowRight, Y as Handshake, Z as GraduationCap, _ as ShieldCheck, _t as Circle, a as UserPlus, ht as Compass, n as Wallet, nt as FileText, p as SquareCheckBig, q as Inbox, r as Users, t as X, x as Search, y as Settings, yt as CircleQuestionMark } from "./_libs/lucide-react.mjs";
import { n as CollapsibleTrigger$1, r as Root, t as CollapsibleContent$1 } from "./_libs/@radix-ui/react-collapsible+[...].mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "./_libs/@radix-ui/react-dialog+[...].mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "./_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { a as Trigger$1, i as Root3, n as Portal, r as Provider, t as Content2$1 } from "./_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-9WqxjghB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = import_react.useState(void 0);
	import_react.useEffect(() => {
		const mql = window.matchMedia(`(max-width: 767px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
var _jsxFileName$7 = "D:/React APP/uniquesta-core-main/src/components/ui/sheet.tsx";
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}, void 0, false, {
	fileName: _jsxFileName$7,
	lineNumber: 22,
	columnNumber: 3
}, void 0));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SheetOverlay, {}, void 0, false, {
	fileName: _jsxFileName$7,
	lineNumber: 62,
	columnNumber: 5
}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$7,
			lineNumber: 65,
			columnNumber: 9
		}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "sr-only",
			children: "Close"
		}, void 0, false, {
			fileName: _jsxFileName$7,
			lineNumber: 66,
			columnNumber: 9
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$7,
		lineNumber: 64,
		columnNumber: 7
	}, void 0), children]
}, void 0, true, {
	fileName: _jsxFileName$7,
	lineNumber: 63,
	columnNumber: 5
}, void 0)] }, void 0, true, {
	fileName: _jsxFileName$7,
	lineNumber: 61,
	columnNumber: 3
}, void 0));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$7,
	lineNumber: 75,
	columnNumber: 3
}, void 0);
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$7,
	lineNumber: 80,
	columnNumber: 3
}, void 0);
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$7,
	lineNumber: 91,
	columnNumber: 3
}, void 0));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$7,
	lineNumber: 103,
	columnNumber: 3
}, void 0));
SheetDescription.displayName = DialogDescription.displayName;
var _jsxFileName$6 = "D:/React APP/uniquesta-core-main/src/components/ui/skeleton.tsx";
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$6,
		lineNumber: 4,
		columnNumber: 10
	}, this);
}
var _jsxFileName$5 = "D:/React APP/uniquesta-core-main/src/components/ui/tooltip.tsx";
var TooltipProvider = Provider;
var Tooltip = Root3;
var TooltipTrigger = Trigger$1;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Portal, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Content2$1, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$5,
	lineNumber: 19,
	columnNumber: 5
}, void 0) }, void 0, false, {
	fileName: _jsxFileName$5,
	lineNumber: 18,
	columnNumber: 3
}, void 0));
TooltipContent.displayName = Content2$1.displayName;
var _jsxFileName$4 = "D:/React APP/uniquesta-core-main/src/components/ui/sidebar.tsx";
var SIDEBAR_COOKIE_NAME = "sidebar_state";
var SIDEBAR_COOKIE_MAX_AGE = 604800;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = import_react.createContext(null);
function useSidebar() {
	const context = import_react.useContext(SidebarContext);
	if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
	return context;
}
var SidebarProvider = import_react.forwardRef(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
	const isMobile = useIsMobile();
	const [openMobile, setOpenMobile] = import_react.useState(false);
	const [_open, _setOpen] = import_react.useState(defaultOpen);
	const open = openProp ?? _open;
	const setOpen = import_react.useCallback((value) => {
		const openState = typeof value === "function" ? value(open) : value;
		if (setOpenProp) setOpenProp(openState);
		else _setOpen(openState);
		document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
	}, [setOpenProp, open]);
	const toggleSidebar = import_react.useCallback(() => {
		return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
	}, [
		isMobile,
		setOpen,
		setOpenMobile
	]);
	import_react.useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggleSidebar();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleSidebar]);
	const state = open ? "expanded" : "collapsed";
	const contextValue = import_react.useMemo(() => ({
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	}), [
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarContext.Provider, {
		value: contextValue,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TooltipProvider, {
			delayDuration: 0,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				style: {
					"--sidebar-width": SIDEBAR_WIDTH,
					"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
					...style
				},
				className: cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className),
				ref,
				...props,
				children
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 129,
				columnNumber: 11
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 128,
			columnNumber: 9
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 127,
		columnNumber: 7
	}, void 0);
});
SidebarProvider.displayName = "SidebarProvider";
var Sidebar = import_react.forwardRef(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
	const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
	if (collapsible === "none") return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: cn("flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground", className),
		ref,
		...props,
		children
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 176,
		columnNumber: 9
	}, void 0);
	if (isMobile) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sheet, {
		open: openMobile,
		onOpenChange: setOpenMobile,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SheetContent, {
			"data-sidebar": "sidebar",
			"data-mobile": "true",
			className: "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
			style: { "--sidebar-width": SIDEBAR_WIDTH_MOBILE },
			side,
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SheetHeader, {
				className: "sr-only",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SheetTitle, { children: "Sidebar" }, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 204,
					columnNumber: 15
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SheetDescription, { children: "Displays the mobile sidebar." }, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 205,
					columnNumber: 15
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 203,
				columnNumber: 13
			}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex h-full w-full flex-col",
				children
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 207,
				columnNumber: 13
			}, void 0)]
		}, void 0, true, {
			fileName: _jsxFileName$4,
			lineNumber: 192,
			columnNumber: 11
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 191,
		columnNumber: 9
	}, void 0);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		ref,
		className: "group peer hidden text-sidebar-foreground md:block",
		"data-state": state,
		"data-collapsible": state === "collapsed" ? collapsible : "",
		"data-variant": variant,
		"data-side": side,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)") }, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 223,
			columnNumber: 9
		}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: cn("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex", side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]", variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l", className),
			...props,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				"data-sidebar": "sidebar",
				className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
				children
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 247,
				columnNumber: 11
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 233,
			columnNumber: 9
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 214,
		columnNumber: 7
	}, void 0);
});
Sidebar.displayName = "Sidebar";
var SidebarTrigger = import_react.forwardRef(({ className, onClick, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
		ref,
		"data-sidebar": "trigger",
		variant: "ghost",
		size: "icon",
		className: cn("h-7 w-7", className),
		onClick: (event) => {
			onClick?.(event);
			toggleSidebar();
		},
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PanelLeft, {}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 279,
			columnNumber: 7
		}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "sr-only",
			children: "Toggle Sidebar"
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 280,
			columnNumber: 7
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 267,
		columnNumber: 5
	}, void 0);
});
SidebarTrigger.displayName = "SidebarTrigger";
var SidebarRail = import_react.forwardRef(({ className, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
		ref,
		"data-sidebar": "rail",
		"aria-label": "Toggle Sidebar",
		tabIndex: -1,
		onClick: toggleSidebar,
		title: "Toggle Sidebar",
		className: cn("absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex", "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 291,
		columnNumber: 7
	}, void 0);
});
SidebarRail.displayName = "SidebarRail";
var SidebarInset = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
		ref,
		className: cn("relative flex w-full flex-1 flex-col bg-background", "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 317,
		columnNumber: 7
	}, void 0);
});
SidebarInset.displayName = "SidebarInset";
var SidebarInput = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
		ref,
		"data-sidebar": "input",
		className: cn("h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 336,
		columnNumber: 5
	}, void 0);
});
SidebarInput.displayName = "SidebarInput";
var SidebarHeader = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		ref,
		"data-sidebar": "header",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 352,
		columnNumber: 7
	}, void 0);
});
SidebarHeader.displayName = "SidebarHeader";
var SidebarFooter = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		ref,
		"data-sidebar": "footer",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 366,
		columnNumber: 7
	}, void 0);
});
SidebarFooter.displayName = "SidebarFooter";
var SidebarSeparator = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Separator, {
		ref,
		"data-sidebar": "separator",
		className: cn("mx-2 w-auto bg-sidebar-border", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 382,
		columnNumber: 5
	}, void 0);
});
SidebarSeparator.displayName = "SidebarSeparator";
var SidebarContent = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		ref,
		"data-sidebar": "content",
		className: cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 395,
		columnNumber: 7
	}, void 0);
});
SidebarContent.displayName = "SidebarContent";
var SidebarGroup = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		ref,
		"data-sidebar": "group",
		className: cn("relative flex w-full min-w-0 flex-col p-2", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 412,
		columnNumber: 7
	}, void 0);
});
SidebarGroup.displayName = "SidebarGroup";
var SidebarGroupLabel = import_react.forwardRef(({ className, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(asChild ? Slot : "div", {
		ref,
		"data-sidebar": "group-label",
		className: cn("flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 430,
		columnNumber: 5
	}, void 0);
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
var SidebarGroupAction = import_react.forwardRef(({ className, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(asChild ? Slot : "button", {
		ref,
		"data-sidebar": "group-action",
		className: cn("absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "after:absolute after:-inset-2 after:md:hidden", "group-data-[collapsible=icon]:hidden", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 451,
		columnNumber: 5
	}, void 0);
});
SidebarGroupAction.displayName = "SidebarGroupAction";
var SidebarGroupContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	ref,
	"data-sidebar": "group-content",
	className: cn("w-full text-sm", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$4,
	lineNumber: 469,
	columnNumber: 5
}, void 0));
SidebarGroupContent.displayName = "SidebarGroupContent";
var SidebarMenu = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
	ref,
	"data-sidebar": "menu",
	className: cn("flex w-full min-w-0 flex-col gap-1", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$4,
	lineNumber: 481,
	columnNumber: 5
}, void 0));
SidebarMenu.displayName = "SidebarMenu";
var SidebarMenuItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
	ref,
	"data-sidebar": "menu-item",
	className: cn("group/menu-item relative", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$4,
	lineNumber: 493,
	columnNumber: 5
}, void 0));
SidebarMenuItem.displayName = "SidebarMenuItem";
var sidebarMenuButtonVariants = cva("peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring cursor-pointer transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", {
	variants: {
		variant: {
			default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
			outline: "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]"
		},
		size: {
			default: "h-8 text-sm",
			sm: "h-7 text-xs",
			lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var SidebarMenuButton = import_react.forwardRef(({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }, ref) => {
	const Comp = asChild ? Slot : "button";
	const { isMobile, state } = useSidebar();
	const button = /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Comp, {
		ref,
		"data-sidebar": "menu-button",
		"data-size": size,
		"data-active": isActive,
		className: cn(sidebarMenuButtonVariants({
			variant,
			size
		}), className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 549,
		columnNumber: 7
	}, void 0);
	if (!tooltip) return button;
	if (typeof tooltip === "string") tooltip = { children: tooltip };
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TooltipTrigger, {
		asChild: true,
		children: button
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 571,
		columnNumber: 9
	}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TooltipContent, {
		side: "right",
		align: "center",
		hidden: state !== "collapsed" || isMobile,
		...tooltip
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 572,
		columnNumber: 9
	}, void 0)] }, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 570,
		columnNumber: 7
	}, void 0);
});
SidebarMenuButton.displayName = "SidebarMenuButton";
var SidebarMenuAction = import_react.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(asChild ? Slot : "button", {
		ref,
		"data-sidebar": "menu-action",
		className: cn("absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0", "after:absolute after:-inset-2 after:md:hidden", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 594,
		columnNumber: 5
	}, void 0);
});
SidebarMenuAction.displayName = "SidebarMenuAction";
var SidebarMenuBadge = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	ref,
	"data-sidebar": "menu-badge",
	className: cn("pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground", "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$4,
	lineNumber: 617,
	columnNumber: 5
}, void 0));
SidebarMenuBadge.displayName = "SidebarMenuBadge";
var SidebarMenuSkeleton = import_react.forwardRef(({ className, showIcon = false, ...props }, ref) => {
	const width = import_react.useMemo(() => {
		return `${Math.floor(Math.random() * 40) + 50}%`;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		ref,
		"data-sidebar": "menu-skeleton",
		className: cn("flex h-8 items-center gap-2 rounded-md px-2", className),
		...props,
		children: [showIcon && /* @__PURE__ */ (void 0)(Skeleton, {
			className: "size-4 rounded-md",
			"data-sidebar": "menu-skeleton-icon"
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 653,
			columnNumber: 20
		}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Skeleton, {
			className: "h-4 max-w-(--skeleton-width) flex-1",
			"data-sidebar": "menu-skeleton-text",
			style: { "--skeleton-width": width }
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 654,
			columnNumber: 7
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 647,
		columnNumber: 5
	}, void 0);
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
var SidebarMenuSub = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
	ref,
	"data-sidebar": "menu-sub",
	className: cn("mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$4,
	lineNumber: 670,
	columnNumber: 5
}, void 0));
SidebarMenuSub.displayName = "SidebarMenuSub";
var SidebarMenuSubItem = import_react.forwardRef(({ ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
	ref,
	...props
}, void 0, false, {
	fileName: _jsxFileName$4,
	lineNumber: 685,
	columnNumber: 26
}, void 0));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
var SidebarMenuSubButton = import_react.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(asChild ? Slot : "a", {
		ref,
		"data-sidebar": "menu-sub-button",
		"data-size": size,
		"data-active": isActive,
		className: cn("flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground", "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground", size === "sm" && "text-xs", size === "md" && "text-sm", "group-data-[collapsible=icon]:hidden", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 700,
		columnNumber: 5
	}, void 0);
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
var Collapsible = Root;
var CollapsibleTrigger = CollapsibleTrigger$1;
var CollapsibleContent = CollapsibleContent$1;
var _jsxFileName$3 = "D:/React APP/uniquesta-core-main/src/components/app-sidebar.tsx";
var dropdownMenus = [
	{
		title: "Students & Admissions",
		icon: Users,
		subItems: [
			{
				title: "Student Admissions",
				url: "/students",
				icon: Users
			},
			{
				title: "Lead Management",
				url: "/leads",
				icon: UserPlus
			},
			{
				title: "Applications",
				url: "/applications",
				icon: FileText
			},
			{
				title: "Global Universities",
				url: "/universities",
				icon: GraduationCap
			}
		]
	},
	{
		title: "Uniquesta Tours & Travels",
		icon: Plane,
		highlight: true,
		subItems: [
			{
				title: "Travel & Fleet Bookings",
				url: "/travel",
				icon: Plane
			},
			{
				title: "Destinations & Tours",
				url: "/travel-destinations",
				icon: Compass
			},
			{
				title: "Forex & Travel Support",
				url: "/travel-services",
				icon: ShieldCheck
			}
		]
	},
	{
		title: "Operations & Finance",
		icon: Briefcase,
		subItems: [
			{
				title: "Finance & Invoices",
				url: "/finance",
				icon: Wallet
			},
			{
				title: "Partner Profit Sharing",
				url: "/partners",
				icon: Handshake
			},
			{
				title: "Expense Approvals",
				url: "/approvals",
				icon: SquareCheckBig
			},
			{
				title: "HR & Staff",
				url: "/hr",
				icon: Briefcase
			},
			{
				title: "Reports & Analytics",
				url: "/reports",
				icon: ChartColumn
			}
		]
	},
	{
		title: "System & Settings",
		icon: Settings,
		subItems: [{
			title: "General Settings",
			url: "/settings",
			icon: Settings
		}]
	}
];
function AppSidebar() {
	const pathname = useRouterState({ select: (r) => r.location.pathname });
	const user = getUser();
	const isStaff = isStaffRole(user);
	const isExactActive = (url) => pathname === url;
	const isSubActive = (url) => url === "/" ? pathname === "/" : pathname.startsWith(url);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sidebar, {
		collapsible: "icon",
		className: "border-r border-slate-200/80 bg-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarHeader, {
				className: "border-b border-slate-100 pb-2",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2.5 px-2 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "h-10 w-10 shrink-0 rounded-full overflow-hidden border border-slate-200 bg-white shadow-sm flex items-center justify-center p-0.5",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
							src: "/logo.png",
							alt: "UniQuesta Logo",
							className: "h-full w-full object-contain"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 114,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 113,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "min-w-0 group-data-[collapsible=icon]:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "truncate text-[16px] font-black tracking-tight leading-none",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-black",
								children: "Uni"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 118,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[#E52E20]",
								children: "Questa"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 118,
								columnNumber: 54
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 117,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "truncate text-[9.5px] font-serif font-bold tracking-wider uppercase text-slate-800 mt-1",
							children: "INTERNATIONAL"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 120,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 116,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 112,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 111,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarContent, {
				className: "px-1 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarGroup, {
					className: "p-1",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarMenu, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarMenuItem, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarMenuButton, {
						asChild: true,
						isActive: isExactActive("/"),
						tooltip: "Dashboard",
						className: "data-[active=true]:bg-red-50 data-[active=true]:text-[#E52E20] data-[active=true]:font-bold font-medium text-slate-700 hover:bg-slate-100 rounded-xl py-2",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LayoutDashboard, { className: "h-4 w-4 text-[#E52E20]" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 140,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Dashboard" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 141,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 139,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 133,
						columnNumber: 15
					}, this) }, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 132,
						columnNumber: 13
					}, this) }, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 131,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 130,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarGroup, {
					className: "p-1",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarGroupLabel, {
						className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1",
						children: "Main Menus"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 150,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarMenu, {
						className: "gap-1",
						children: dropdownMenus.map((menu) => {
							const filteredSubItems = menu.subItems.filter((sub) => {
								if (sub.url === "/partners" && isStaff) return false;
								if (sub.url === "/hr" && isStaff) return false;
								return true;
							});
							if (filteredSubItems.length === 0) return null;
							const isAnyChildActive = filteredSubItems.some((sub) => isSubActive(sub.url));
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Collapsible, {
								asChild: true,
								defaultOpen: isAnyChildActive || menu.highlight,
								className: "group/collapsible",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarMenuItem, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CollapsibleTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarMenuButton, {
										tooltip: menu.title,
										isActive: isAnyChildActive,
										className: `w-full justify-between rounded-xl px-2.5 py-2 font-semibold text-sm transition-all select-none cursor-pointer ${menu.highlight ? "hover:bg-red-50/70 text-slate-900" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"} ${isAnyChildActive ? "bg-slate-100/90 text-slate-900 font-bold" : ""}`,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-2.5 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(menu.icon, { className: `h-4 w-4 shrink-0 transition-colors ${menu.highlight || isAnyChildActive ? "text-[#E52E20]" : "text-slate-500 group-hover/collapsible:text-slate-700"}` }, void 0, false, {
												fileName: _jsxFileName$3,
												lineNumber: 189,
												columnNumber: 27
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "truncate text-xs",
												children: menu.title
											}, void 0, false, {
												fileName: _jsxFileName$3,
												lineNumber: 196,
												columnNumber: 27
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$3,
											lineNumber: 188,
											columnNumber: 25
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" }, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 198,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 175,
										columnNumber: 23
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 174,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CollapsibleContent, {
									className: "transition-all duration-200 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarMenuSub, {
										className: "ml-5 border-l-2 border-slate-200/80 pl-2.5 py-1 my-0.5 space-y-0.5",
										children: filteredSubItems.map((sub) => {
											const active = isSubActive(sub.url);
											return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarMenuSubItem, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarMenuSubButton, {
												asChild: true,
												isActive: active,
												size: "sm",
												className: `rounded-lg px-2 py-1.5 text-xs transition-all ${active ? "bg-red-50 text-[#E52E20] font-bold border-l-2 border-[#E52E20]" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"}`,
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
													to: sub.url,
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(sub.icon, { className: `h-3.5 w-3.5 shrink-0 ${active ? "text-[#E52E20]" : "text-slate-400"}` }, void 0, false, {
														fileName: _jsxFileName$3,
														lineNumber: 219,
														columnNumber: 35
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "truncate",
														children: sub.title
													}, void 0, false, {
														fileName: _jsxFileName$3,
														lineNumber: 224,
														columnNumber: 35
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName$3,
													lineNumber: 218,
													columnNumber: 33
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName$3,
												lineNumber: 208,
												columnNumber: 31
											}, this) }, sub.url, false, {
												fileName: _jsxFileName$3,
												lineNumber: 207,
												columnNumber: 29
											}, this);
										})
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 203,
										columnNumber: 23
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 202,
									columnNumber: 21
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 173,
									columnNumber: 19
								}, this)
							}, menu.title, false, {
								fileName: _jsxFileName$3,
								lineNumber: 167,
								columnNumber: 17
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 153,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 149,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 128,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarFooter, {
				className: "border-t border-slate-100",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2.5 px-2 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary text-xs font-semibold",
						children: user ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "MI"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 243,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "min-w-0 group-data-[collapsible=icon]:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "truncate text-xs font-semibold",
							children: user?.name ?? "Mohammad Iqbal"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 254,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "truncate text-[11px] text-muted-foreground",
							children: user ? `${user.branch} · ${user.role}` : "Guwahati HQ · Admin"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 255,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 253,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 242,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 241,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 109,
		columnNumber: 5
	}, this);
}
var _jsxFileName$2 = "D:/React APP/uniquesta-core-main/src/components/ui/dropdown-menu.tsx";
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "ml-auto" }, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 37,
		columnNumber: 5
	}, void 0)]
}, void 0, true, {
	fileName: _jsxFileName$2,
	lineNumber: 27,
	columnNumber: 3
}, void 0));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$2,
	lineNumber: 46,
	columnNumber: 3
}, void 0));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$2,
	lineNumber: 62,
	columnNumber: 5
}, void 0) }, void 0, false, {
	fileName: _jsxFileName$2,
	lineNumber: 61,
	columnNumber: 3
}, void 0));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$2,
	lineNumber: 82,
	columnNumber: 3
}, void 0));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 109,
			columnNumber: 9
		}, void 0) }, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 108,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 107,
		columnNumber: 5
	}, void 0), children]
}, void 0, true, {
	fileName: _jsxFileName$2,
	lineNumber: 98,
	columnNumber: 3
}, void 0));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Circle, { className: "h-2 w-2 fill-current" }, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 131,
			columnNumber: 9
		}, void 0) }, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 130,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 129,
		columnNumber: 5
	}, void 0), children]
}, void 0, true, {
	fileName: _jsxFileName$2,
	lineNumber: 121,
	columnNumber: 3
}, void 0));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$2,
	lineNumber: 145,
	columnNumber: 3
}, void 0));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$2,
	lineNumber: 157,
	columnNumber: 3
}, void 0));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 167,
		columnNumber: 5
	}, void 0);
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var _jsxFileName$1 = "D:/React APP/uniquesta-core-main/src/components/top-bar.tsx";
function TopBar() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const user = getUser() ?? {
		name: "Mohammad Iqbal",
		email: "admin@uniquesta.com",
		role: "Super Admin",
		branch: "Guwahati HQ"
	};
	const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
	const { data: notifData } = useQuery({
		queryKey: ["notifications", user.email],
		queryFn: async () => {
			try {
				const res = await api.get(`/notifications?email=${encodeURIComponent(user.email)}`);
				return res.data ?? res ?? {
					data: [],
					unreadCount: 0
				};
			} catch {
				return {
					data: [],
					unreadCount: 0
				};
			}
		},
		refetchInterval: 3e3
	});
	const notifications = notifData?.data || [];
	const unreadCount = notifData?.unreadCount ?? notifications.filter((n) => !n.read_status).length;
	const markAllReadMut = useMutation({
		mutationFn: async () => {
			return api.post("/notifications/mark-all-read", { email: user.email });
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["notifications"] });
			toast.success("All notifications marked as read");
		}
	});
	const markSingleRead = async (n) => {
		try {
			if (!n.read_status) {
				await api.put(`/notifications/${n.id}/read`, {});
				qc.invalidateQueries({ queryKey: ["notifications"] });
			}
			if (n.reference_id && n.reference_id.startsWith("REIMB-")) navigate({ to: "/approvals" });
		} catch {}
	};
	const handleLogout = () => {
		clearToken();
		navigate({ to: "/login" });
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
		className: "sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarTrigger, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 79,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Separator, {
				orientation: "vertical",
				className: "h-6"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 80,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "relative hidden max-w-md flex-1 md:block",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 83,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						placeholder: "Search students, leads, universities, invoices…",
						className: "h-10 rounded-xl border-border bg-muted/60 pl-9 focus-visible:bg-background"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 84,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("kbd", {
						className: "pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline-block",
						children: "⌘K"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 88,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 82,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "ml-auto flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "outline",
						size: "sm",
						className: "hidden rounded-lg lg:inline-flex",
						onClick: () => navigate({ to: "/approvals" }),
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 95,
							columnNumber: 11
						}, this), " New Expense"]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 94,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "ghost",
						size: "icon",
						className: "rounded-lg text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleQuestionMark, { className: "h-5 w-5" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 98,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 97,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							className: "relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition",
							"aria-label": "View notifications",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bell, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 109,
								columnNumber: 15
							}, this), unreadCount > 0 && /* @__PURE__ */ (void 0)("span", {
								className: "absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E52E20] px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-background animate-pulse",
								children: unreadCount
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 111,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 104,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 103,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuContent, {
						align: "end",
						className: "w-[360px] p-0 shadow-lg",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between border-b px-4 py-3 bg-muted/30",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-sm font-bold text-foreground",
										children: "Notifications"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 120,
										columnNumber: 17
									}, this), unreadCount > 0 && /* @__PURE__ */ (void 0)(Badge, {
										variant: "destructive",
										className: "h-5 px-1.5 text-[10px] font-semibold",
										children: [unreadCount, " new"]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 122,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 119,
									columnNumber: 15
								}, this), unreadCount > 0 && /* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => markAllReadMut.mutate(),
									className: "flex items-center gap-1 text-[11px] font-medium text-primary hover:underline",
									children: [/* @__PURE__ */ (void 0)(CheckCheck, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 133,
										columnNumber: 19
									}, this), " Mark all read"]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 128,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 118,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "max-h-[340px] overflow-y-auto divide-y divide-border/60",
								children: notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "py-8 text-center text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Inbox, { className: "mx-auto mb-2 h-7 w-7 opacity-30" }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 141,
										columnNumber: 19
									}, this), "No new notifications right now."]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 140,
									columnNumber: 17
								}, this) : notifications.slice(0, 10).map((n) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									onClick: () => markSingleRead(n),
									className: `flex items-start gap-3 p-3.5 text-xs transition cursor-pointer hover:bg-muted/60 ${!n.read_status ? "bg-red-500/[0.04]" : "opacity-80"}`,
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: `mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${!n.read_status ? "bg-[#E52E20]/15 text-[#E52E20]" : "bg-muted text-muted-foreground"}`,
										children: n.sender_name ? n.sender_name.split(" ").map((x) => x[0]).join("").slice(0, 2) : "UQ"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 153,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-center justify-between gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: `font-semibold truncate ${!n.read_status ? "text-foreground font-bold" : "text-muted-foreground"}`,
													children: n.title
												}, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 170,
													columnNumber: 25
												}, this), !n.read_status && /* @__PURE__ */ (void 0)("span", { className: "h-2 w-2 shrink-0 rounded-full bg-[#E52E20]" }, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 174,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 169,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-foreground/80",
												children: n.message
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 177,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "mt-1.5 flex items-center justify-between text-[10.5px] text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: n.created_at ? new Date(n.created_at).toLocaleTimeString("en-IN", {
													hour: "2-digit",
													minute: "2-digit"
												}) : "Just now" }, void 0, false, {
													fileName: _jsxFileName$1,
													lineNumber: 181,
													columnNumber: 25
												}, this), n.reference_id && /* @__PURE__ */ (void 0)("span", {
													className: "font-mono text-primary flex items-center gap-0.5",
													children: [
														n.reference_id,
														" ",
														/* @__PURE__ */ (void 0)(ArrowRight, { className: "h-2.5 w-2.5" }, void 0, false, {
															fileName: _jsxFileName$1,
															lineNumber: 184,
															columnNumber: 46
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName$1,
													lineNumber: 183,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName$1,
												lineNumber: 180,
												columnNumber: 23
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 168,
										columnNumber: 21
									}, this)]
								}, n.id, true, {
									fileName: _jsxFileName$1,
									lineNumber: 146,
									columnNumber: 19
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 138,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "border-t p-2 text-center bg-muted/20",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "ghost",
									size: "sm",
									className: "w-full text-xs font-medium text-primary hover:text-primary",
									onClick: () => navigate({ to: "/approvals" }),
									children: "Go to Expense Approval Portal ➔"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 195,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 194,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 117,
						columnNumber: 11
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 102,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Separator, {
						orientation: "vertical",
						className: "mx-1 h-6"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 206,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							className: "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 hover:bg-muted border border-border/40 transition",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid h-8 w-8 place-items-center rounded-full bg-[#E52E20] text-white text-xs font-bold shadow-sm",
									children: initials
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 210,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "hidden text-left md:block",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xs font-semibold leading-tight text-foreground flex items-center gap-1.5",
										children: [
											user.name,
											user.role === "super_admin" && /* @__PURE__ */ (void 0)("span", {
												className: "rounded bg-red-100 text-[#E52E20] text-[9.5px] px-1 py-0.2 font-bold",
												children: "HQ"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 217,
												columnNumber: 21
											}, this),
											user.role === "branch_admin" && /* @__PURE__ */ (void 0)("span", {
												className: "rounded bg-purple-100 text-purple-700 text-[9.5px] px-1 py-0.2 font-bold",
												children: "Branch Head"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 220,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$1,
										lineNumber: 214,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[11px] leading-tight text-muted-foreground capitalize",
										children: user.role === "super_admin" ? "Super Admin" : user.role === "branch_admin" ? "Branch Admin" : (user.role || "").replace(/_/g, " ")
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 223,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 213,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
									variant: "outline",
									className: "ml-1 hidden rounded-md border-primary/30 bg-primary/10 text-[10.5px] font-semibold text-primary md:inline-flex",
									children: user.branch || "Guwahati HQ"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 227,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 209,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 208,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuContent, {
						align: "end",
						className: "w-64",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuLabel, { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-sm font-bold text-foreground",
									children: user.name
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 234,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-xs font-normal text-muted-foreground",
									children: user.email
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 235,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-2 space-y-1 rounded-lg bg-slate-50 p-2 text-[11px] text-slate-600 border",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-semibold text-slate-700",
												children: "Role:"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 238,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-mono text-slate-800 font-bold uppercase",
												children: user.role || "Admin"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 239,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 237,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-semibold text-slate-700",
												children: "Branch:"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 242,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-slate-800",
												children: user.branch || "Guwahati HQ"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 243,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 241,
											columnNumber: 17
										}, this),
										user.reports_to && /* @__PURE__ */ (void 0)("div", {
											className: "pt-1 border-t border-slate-200 text-slate-500",
											children: [/* @__PURE__ */ (void 0)("span", {
												className: "font-semibold text-slate-700 block text-[10px] uppercase",
												children: "Reports To:"
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 247,
												columnNumber: 21
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "text-slate-800 text-[10.5px] font-medium",
												children: user.reports_to
											}, void 0, false, {
												fileName: _jsxFileName$1,
												lineNumber: 248,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName$1,
											lineNumber: 246,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 236,
									columnNumber: 15
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 233,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuSeparator, {}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 253,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuItem, {
								onClick: handleLogout,
								className: "gap-2 text-destructive focus:text-destructive",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 255,
									columnNumber: 15
								}, this), " Logout"]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 254,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 232,
						columnNumber: 11
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 207,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 93,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 78,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/routes/_app.tsx?tsr-split=component";
function AppLayout() {
	const navigate = useNavigate();
	const [checking, setChecking] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
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
	if (checking && isLoggedIn()) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-muted/40",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-sm text-muted-foreground",
			children: "Checking session..."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 34,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 33,
		columnNumber: 12
	}, this);
	if (!isLoggedIn()) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarProvider, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen w-full bg-muted/40",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AppSidebar, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 42,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SidebarInset, {
			className: "flex min-w-0 flex-1 flex-col bg-background",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TopBar, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 44,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "flex-1 overflow-x-hidden",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 47,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 46,
					columnNumber: 13
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 45,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 43,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 41,
		columnNumber: 7
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 40,
		columnNumber: 10
	}, this);
}
//#endregion
export { AppLayout as component };
