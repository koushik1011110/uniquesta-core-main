import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { L as redirect, _ as createRootRouteWithContext, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { D as Plane, J as Headphones, O as Phone, Z as GraduationCap, _ as ShieldCheck, ft as Crown, n as Wallet, r as Users, rt as FileCheck } from "../_libs/lucide-react.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-zF7wAd8r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var styles_default = "/assets/styles-DEz7VAxz.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/routes/__root.tsx";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 19,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 20,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 21,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 25,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 24,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 18,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 17,
		columnNumber: 5
	}, this);
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 47,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 50,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 54,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 63,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 53,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 46,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 45,
		columnNumber: 5
	}, this);
}
var Route$24 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Uniquesta ERP & CRM" },
			{
				name: "description",
				content: "Uniquesta ERP & CRM — enterprise workspace for international education consultancies managing students, leads, applications, universities, finance and partners across India."
			},
			{
				name: "author",
				content: "Uniquesta"
			},
			{
				property: "og:title",
				content: "Uniquesta ERP & CRM"
			},
			{
				property: "og:description",
				content: "Enterprise ERP & CRM for international education consultancies."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico?v=uniquesta-2026",
				type: "image/x-icon"
			},
			{
				rel: "icon",
				href: "/favicon.png?v=uniquesta-2026",
				type: "image/png",
				sizes: "32x32"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png?v=uniquesta-2026",
				sizes: "180x180"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeadContent, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 108,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 107,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 112,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 110,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 106,
		columnNumber: 5
	}, this);
}
function RootComponent() {
	const { queryClient } = Route$24.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 124,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 122,
		columnNumber: 5
	}, this);
}
var $$splitComponentImporter$23 = () => import("../_app-9WqxjghB.mjs");
var Route$23 = createFileRoute("/_app")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./driver-login-CMNnk5jP.mjs");
var Route$22 = createFileRoute("/driver-login")({
	head: () => ({ meta: [
		{ title: "Driver & Bus Captain Login · Uniquesta Travels" },
		{
			name: "description",
			content: "Mobile driver terminal login for Uniquesta Tours & Travels fleet captains."
		},
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./driver-portal-Bx6mOCu3.mjs");
var Route$21 = createFileRoute("/driver-portal")({
	head: () => ({ meta: [
		{ title: "Driver Trip Terminal · Uniquesta Travels" },
		{
			name: "description",
			content: "Mobile driver trip terminal and passenger boarding manager."
		},
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./login-DW0odr9S.mjs");
var Route$20 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./traveler-login-DWtPi6hh.mjs");
var Route$19 = createFileRoute("/traveler-login")({
	head: () => ({ meta: [
		{ title: "Traveler & Passenger Portal · Uniquesta Travels" },
		{
			name: "description",
			content: "Mobile traveler portal: View digital boarding pass, check assigned driver, and live trip status."
		},
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./traveler-portal-BCmzd4z5.mjs");
var Route$18 = createFileRoute("/traveler-portal")({
	head: () => ({ meta: [
		{ title: "My Travel Boarding Pass · Uniquesta Travels" },
		{
			name: "description",
			content: "Mobile digital boarding pass, live driver tracking, and trip itinerary."
		},
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("../_app.index-BTCGe4TO.mjs");
var Route$17 = createFileRoute("/_app/")({
	head: () => ({ meta: [{ title: "Dashboard · UniQuesta International" }, {
		name: "description",
		content: "Executive overview dashboard for UniQuesta International — Trusted Pathway to Global Success."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("../_app.applications-Cvz66SJ_.mjs");
var Route$16 = createFileRoute("/_app/applications")({
	head: () => ({ meta: [
		{ title: "Application Management · Uniquesta" },
		{
			name: "description",
			content: "Track document collection, submission and offer status across every university."
		},
		{
			property: "og:title",
			content: "Application Management · Uniquesta"
		},
		{
			property: "og:description",
			content: "End-to-end university application tracking."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("../_app.approvals-B4zT37JQ.mjs");
var Route$15 = createFileRoute("/_app/approvals")({
	head: () => ({ meta: [{ title: "Expense Approval Workflow · Uniquesta" }, {
		name: "description",
		content: "Email-style staged expense reimbursement approvals from staff to Director and CEO with custom messages."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("../_app.finance-By4Z7gui.mjs");
var Route$14 = createFileRoute("/_app/finance")({
	head: () => ({ meta: [
		{ title: "Finance · Uniquesta ERP" },
		{
			name: "description",
			content: "Invoicing, tuition collections, refunds, commissions and multi-branch P&L."
		},
		{
			property: "og:title",
			content: "Finance · Uniquesta ERP"
		},
		{
			property: "og:description",
			content: "Enterprise finance and receivables for education consultancy."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("../_app.hr-CV3avNOd.mjs");
var Route$13 = createFileRoute("/_app/hr")({
	head: () => ({ meta: [
		{ title: "Staff & Role Hierarchy · Uniquesta ERP" },
		{
			name: "description",
			content: "Branch Admin and Role-based staff management across Uniquesta branches."
		},
		{
			property: "og:title",
			content: "Staff & Role Hierarchy · Uniquesta ERP"
		},
		{
			property: "og:description",
			content: "Branch-wise Admin and Staff Management."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var SYSTEM_ROLES = {
	super_admin: {
		label: "Super Admin",
		badge: "bg-red-50 text-[#E52E20] border-red-200",
		icon: ShieldCheck,
		desc: "Global headquarters control: Can add branches, branch admins, and staff across all branches."
	},
	branch_admin: {
		label: "Branch Admin",
		badge: "bg-purple-50 text-purple-700 border-purple-200",
		icon: Crown,
		desc: "Branch executive head: Oversees branch operations and adds/manages staff for their branch."
	},
	staff: {
		label: "Staff",
		badge: "bg-blue-50 text-blue-700 border-blue-200",
		icon: Users,
		desc: "Operational branch personnel reporting to their Branch Admin."
	}
};
var STAFF_DESIGNATIONS = [
	{
		value: "Admissions Counsellor",
		label: "Admissions Counsellor",
		icon: GraduationCap,
		color: "text-blue-600 bg-blue-50 border-blue-200"
	},
	{
		value: "Visa & Documentation Officer",
		label: "Visa & Documentation Officer",
		icon: FileCheck,
		color: "text-amber-600 bg-amber-50 border-amber-200"
	},
	{
		value: "Finance & Accounts Executive",
		label: "Finance & Accounts Executive",
		icon: Wallet,
		color: "text-emerald-600 bg-emerald-50 border-emerald-200"
	},
	{
		value: "Travel & Fleet Coordinator",
		label: "Travel & Fleet Coordinator",
		icon: Plane,
		color: "text-indigo-600 bg-indigo-50 border-indigo-200"
	},
	{
		value: "Front Desk Executive",
		label: "Front Desk Executive",
		icon: Headphones,
		color: "text-slate-600 bg-slate-100 border-slate-300"
	},
	{
		value: "Telecaller / Lead Executive",
		label: "Telecaller / Lead Executive",
		icon: Phone,
		color: "text-teal-600 bg-teal-50 border-teal-200"
	}
];
var $$splitComponentImporter$12 = () => import("../_app.india-admissions-DFe2iHMx.mjs");
var Route$12 = createFileRoute("/_app/india-admissions")({
	beforeLoad: () => {
		throw redirect({ to: "/students" });
	},
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("../_app.leads-Crk55xuG.mjs");
var Route$11 = createFileRoute("/_app/leads")({
	head: () => ({ meta: [
		{ title: "Lead Management · Uniquesta" },
		{
			name: "description",
			content: "Kanban lead pipeline with automated lead-to-student admission conversion."
		},
		{
			property: "og:title",
			content: "Lead Management · Uniquesta"
		},
		{
			property: "og:description",
			content: "Track every enquiry from first touch to student admission conversion."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("../_app.partners-AgJwIMph.mjs");
var Route$10 = createFileRoute("/_app/partners")({
	head: () => ({ meta: [
		{ title: "Partner Profit Sharing & Margins · Uniquesta ERP" },
		{
			name: "description",
			content: "Admin management for B2B partner commission splits and profit sharing margins."
		},
		{
			property: "og:title",
			content: "Partner Profit Sharing & Margins · Uniquesta ERP"
		},
		{
			property: "og:description",
			content: "Configure partner profit margins and commission share."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("../_app.portal-DAFmYPNz.mjs");
var Route$9 = createFileRoute("/_app/portal")({
	head: () => ({ meta: [{ title: "Student Portal · Uniquesta" }, {
		name: "description",
		content: "Self-service portal for students and parents to track admission status, offer letters, fee installments, visa, travel, and documents."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("../_app.reports-CzbDcyG3.mjs");
var Route$8 = createFileRoute("/_app/reports")({
	head: () => ({ meta: [
		{ title: "Reports · Uniquesta ERP" },
		{
			name: "description",
			content: "Pre-built and custom reports for admissions, finance, HR and partner performance."
		},
		{
			property: "og:title",
			content: "Reports · Uniquesta ERP"
		},
		{
			property: "og:description",
			content: "Analytics and reporting for Uniquesta."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("../_app.settings-DqLan_C0.mjs");
var Route$7 = createFileRoute("/_app/settings")({
	head: () => ({ meta: [
		{ title: "Settings · Uniquesta ERP" },
		{
			name: "description",
			content: "Organisation, branches, roles, security and integrations for Uniquesta."
		},
		{
			property: "og:title",
			content: "Settings · Uniquesta ERP"
		},
		{
			property: "og:description",
			content: "Configure Uniquesta ERP & CRM."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("../_app.students-C4kueUx0.mjs");
var Route$6 = createFileRoute("/_app/students")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("../_app.travel-Dw03q-23.mjs");
var Route$5 = createFileRoute("/_app/travel")({
	head: () => ({ meta: [{ title: "Travel Bookings & Fleet Dispatch · Uniquesta Tours & Travels" }, {
		name: "description",
		content: "Manage customer travel bookings, assign bus drivers and partner agencies, and control middleman profit margins with Uniquesta."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("../_app.travel-destinations-DItqpbOa.mjs");
var Route$4 = createFileRoute("/_app/travel-destinations")({
	head: () => ({ meta: [{ title: "Tour Destinations & Packages · Uniquesta Tours & Travels" }, {
		name: "description",
		content: "Explore international and domestic tour packages, university campus tours, and holiday itineraries with Uniquesta Tours & Travels."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("../_app.travel-services-C9x5243J.mjs");
var Route$3 = createFileRoute("/_app/travel-services")({
	head: () => ({ meta: [{ title: "Forex & Travel Services · Uniquesta Tours & Travels" }, {
		name: "description",
		content: "Student multi-currency forex cards, overseas health insurance, airline student baggage allowance & airport pickup services."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("../_app.universities-BRSrZFmx.mjs");
var Route$2 = createFileRoute("/_app/universities")({
	head: () => ({ meta: [
		{ title: "University Management · Uniquesta" },
		{
			name: "description",
			content: "480+ partner universities across 14 countries with live commission, intake and course data."
		},
		{
			property: "og:title",
			content: "University Management · Uniquesta"
		},
		{
			property: "og:description",
			content: "Manage partner universities, courses, intakes and commissions."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("../_app.students.index-Cd4N7ILE.mjs");
var Route$1 = createFileRoute("/_app/students/")({
	head: () => ({ meta: [
		{ title: "Student CRM · Uniquesta" },
		{
			name: "description",
			content: "Student Data — clean list and dedicated profiles."
		},
		{
			property: "og:title",
			content: "Student CRM · Uniquesta ERP"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("../_app.students._studentId-apR33ueg.mjs");
var Route = createFileRoute("/_app/students/$studentId")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var AppRoute = Route$23.update({
	id: "/_app",
	getParentRoute: () => Route$24
});
var DriverLoginRoute = Route$22.update({
	id: "/driver-login",
	path: "/driver-login",
	getParentRoute: () => Route$24
});
var DriverPortalRoute = Route$21.update({
	id: "/driver-portal",
	path: "/driver-portal",
	getParentRoute: () => Route$24
});
var LoginRoute = Route$20.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$24
});
var TravelerLoginRoute = Route$19.update({
	id: "/traveler-login",
	path: "/traveler-login",
	getParentRoute: () => Route$24
});
var TravelerPortalRoute = Route$18.update({
	id: "/traveler-portal",
	path: "/traveler-portal",
	getParentRoute: () => Route$24
});
var AppIndexRoute = Route$17.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var AppApplicationsRoute = Route$16.update({
	id: "/applications",
	path: "/applications",
	getParentRoute: () => AppRoute
});
var AppApprovalsRoute = Route$15.update({
	id: "/approvals",
	path: "/approvals",
	getParentRoute: () => AppRoute
});
var AppFinanceRoute = Route$14.update({
	id: "/finance",
	path: "/finance",
	getParentRoute: () => AppRoute
});
var AppHrRoute = Route$13.update({
	id: "/hr",
	path: "/hr",
	getParentRoute: () => AppRoute
});
var AppIndiaAdmissionsRoute = Route$12.update({
	id: "/india-admissions",
	path: "/india-admissions",
	getParentRoute: () => AppRoute
});
var AppLeadsRoute = Route$11.update({
	id: "/leads",
	path: "/leads",
	getParentRoute: () => AppRoute
});
var AppPartnersRoute = Route$10.update({
	id: "/partners",
	path: "/partners",
	getParentRoute: () => AppRoute
});
var AppPortalRoute = Route$9.update({
	id: "/portal",
	path: "/portal",
	getParentRoute: () => AppRoute
});
var AppReportsRoute = Route$8.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AppRoute
});
var AppSettingsRoute = Route$7.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AppRoute
});
var AppStudentsRoute = Route$6.update({
	id: "/students",
	path: "/students",
	getParentRoute: () => AppRoute
});
var AppTravelRoute = Route$5.update({
	id: "/travel",
	path: "/travel",
	getParentRoute: () => AppRoute
});
var AppTravelDestinationsRoute = Route$4.update({
	id: "/travel-destinations",
	path: "/travel-destinations",
	getParentRoute: () => AppRoute
});
var AppTravelServicesRoute = Route$3.update({
	id: "/travel-services",
	path: "/travel-services",
	getParentRoute: () => AppRoute
});
var AppUniversitiesRoute = Route$2.update({
	id: "/universities",
	path: "/universities",
	getParentRoute: () => AppRoute
});
var AppStudentsIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppStudentsRoute
});
var AppStudentsRouteChildren = {
	AppStudentsStudentIdRoute: Route.update({
		id: "/$studentId",
		path: "/$studentId",
		getParentRoute: () => AppStudentsRoute
	}),
	AppStudentsIndexRoute
};
var AppRouteChildren = {
	AppApplicationsRoute,
	AppApprovalsRoute,
	AppFinanceRoute,
	AppHrRoute,
	AppIndiaAdmissionsRoute,
	AppLeadsRoute,
	AppPartnersRoute,
	AppPortalRoute,
	AppReportsRoute,
	AppSettingsRoute,
	AppStudentsRoute: AppStudentsRoute._addFileChildren(AppStudentsRouteChildren),
	AppTravelRoute,
	AppTravelDestinationsRoute,
	AppTravelServicesRoute,
	AppUniversitiesRoute,
	AppIndexRoute
};
var rootRouteChildren = {
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	DriverLoginRoute,
	DriverPortalRoute,
	LoginRoute,
	TravelerLoginRoute,
	TravelerPortalRoute
};
var routeTree = Route$24._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { SYSTEM_ROLES as i, Route as n, STAFF_DESIGNATIONS as r, router_exports as t };
