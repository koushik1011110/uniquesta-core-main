import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "./_libs/react.mjs";
import { n as cn, t as Button } from "./_ssr/button-Th46ikol.mjs";
import { t as Input } from "./_ssr/input-CWiOSw9Q.mjs";
import { t as api } from "./_ssr/api-06dRWXHB.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { E as Plug, H as LoaderCircle, It as Building2, P as Palette, Q as Globe, Rt as Bell, g as Shield, pt as CreditCard, r as Users } from "./_libs/lucide-react.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { t as PageHeader } from "./_ssr/page-header-DRgCwu0n.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-BpRCf_XK.mjs";
import { t as Label } from "./_ssr/label-DPnTa5YU.mjs";
import { n as SwitchThumb, t as Switch$1 } from "./_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.settings-DqLan_C0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "D:/React APP/uniquesta-core-main/src/components/ui/switch.tsx";
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") }, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 18,
		columnNumber: 5
	}, void 0)
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 10,
	columnNumber: 3
}, void 0));
Switch.displayName = Switch$1.displayName;
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/routes/_app.settings.tsx?tsr-split=component";
var groups = [
	{
		icon: Building2,
		title: "Organisation & Branches",
		desc: "Legal entity, 14 branches, GST profiles"
	},
	{
		icon: Users,
		title: "Roles & Permissions",
		desc: "12 roles, 84 permissions"
	},
	{
		icon: Shield,
		title: "Security & Compliance",
		desc: "SSO, 2FA, audit log, DPDP"
	},
	{
		icon: Bell,
		title: "Notifications",
		desc: "Email, SMS, WhatsApp templates"
	},
	{
		icon: Plug,
		title: "Integrations",
		desc: "WhatsApp, Zoom, Google Workspace, Tally"
	},
	{
		icon: CreditCard,
		title: "Billing & Plan",
		desc: "Enterprise plan · 280 seats"
	},
	{
		icon: Globe,
		title: "Localisation",
		desc: "Currencies, timezones, languages"
	},
	{
		icon: Palette,
		title: "Branding",
		desc: "Logo, colours, email signature"
	}
];
function SettingsPage() {
	const qc = useQueryClient();
	const { data, isLoading } = useQuery({
		queryKey: ["settings"],
		queryFn: async () => {
			const res = await api.get("/settings");
			return res.data ?? res ?? {};
		}
	});
	const settings = data ?? {};
	const [form, setForm] = (0, import_react.useState)({
		legal_name: "",
		support_email: "",
		two_factor: true,
		whatsapp_notify: true
	});
	(0, import_react.useEffect)(() => {
		if (settings && settings.legal_name) setForm({
			legal_name: settings.legal_name ?? settings.legalName ?? "Uniquesta Overseas Pvt Ltd",
			support_email: settings.support_email ?? settings.supportEmail ?? "care@uniquesta.com",
			two_factor: !!(settings.two_factor ?? settings.twoFactor ?? true),
			whatsapp_notify: !!(settings.whatsapp_notify ?? settings.whatsappNotify ?? true)
		});
	}, [
		settings.legal_name,
		settings.support_email,
		settings.two_factor,
		settings.whatsapp_notify
	]);
	const save = useMutation({
		mutationFn: async () => api.put("/settings", {
			legal_name: form.legal_name,
			support_email: form.support_email,
			two_factor: form.two_factor,
			whatsapp_notify: form.whatsapp_notify
		}),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["settings"] });
			toast.success("Settings saved");
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
		title: "Settings",
		description: "Configure your Uniquesta workspace"
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 88,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid gap-6 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "rounded-2xl shadow-soft lg:col-span-2",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "grid gap-3 p-4 sm:grid-cols-2",
				children: groups.map((g) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					className: "flex items-start gap-3 rounded-xl border p-4 text-left transition hover:border-primary/40 hover:bg-primary-soft/40",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(g.icon, { className: "h-5 w-5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 94,
							columnNumber: 117
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 94,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "font-medium",
							children: g.title
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 96,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: g.desc
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 97,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 95,
						columnNumber: 17
					}, this)]
				}, g.title, true, {
					fileName: _jsxFileName,
					lineNumber: 93,
					columnNumber: 30
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 92,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 91,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "rounded-2xl shadow-soft",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
				className: "space-y-5 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
					className: "font-semibold",
					children: "Organisation"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 106,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-muted-foreground",
					children: "Basic details shown across the app"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 107,
					columnNumber: 15
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 105,
					columnNumber: 13
				}, this), isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 109,
						columnNumber: 97
					}, this), " Loading…"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 109,
					columnNumber: 26
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Legal Name" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 111,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							value: form.legal_name,
							onChange: (e) => setForm({
								...form,
								legal_name: e.target.value
							}),
							className: "rounded-lg"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 112,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 110,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Support Email" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 118,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							value: form.support_email,
							onChange: (e) => setForm({
								...form,
								support_email: e.target.value
							}),
							className: "rounded-lg"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 119,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 117,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between rounded-lg border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-sm font-medium",
							children: "Two-factor authentication"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 126,
							columnNumber: 21
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-xs text-muted-foreground",
							children: "Required for admins"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 127,
							columnNumber: 21
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 125,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Switch, {
							checked: form.two_factor,
							onCheckedChange: (v) => setForm({
								...form,
								two_factor: v
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 129,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 124,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between rounded-lg border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-sm font-medium",
							children: "WhatsApp notifications"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 136,
							columnNumber: 21
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-xs text-muted-foreground",
							children: "Student & partner alerts"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 137,
							columnNumber: 21
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 135,
							columnNumber: 19
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Switch, {
							checked: form.whatsapp_notify,
							onCheckedChange: (v) => setForm({
								...form,
								whatsapp_notify: v
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 139,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 134,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						className: "w-full rounded-lg",
						onClick: () => save.mutate(),
						disabled: save.isPending,
						children: [save.isPending && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 144,
							columnNumber: 130
						}, this), " Save changes"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 144,
						columnNumber: 17
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 109,
					columnNumber: 159
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 104,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 103,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 90,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 87,
		columnNumber: 10
	}, this);
}
//#endregion
export { SettingsPage as component };
