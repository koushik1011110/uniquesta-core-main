import { t as require_jsx_dev_runtime } from "./_libs/react.mjs";
import { t as Button } from "./_ssr/button-Th46ikol.mjs";
import { t as api } from "./_ssr/api-06dRWXHB.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { At as ChartColumn, H as LoaderCircle, Ot as ChartPie, ct as Earth, it as FileChartColumnIncreasing, kt as ChartLine, lt as Download, n as Wallet, r as Users } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/page-header-DRgCwu0n.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./_ssr/card-BpRCf_XK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.reports-CzbDcyG3.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/routes/_app.reports.tsx?tsr-split=component";
var fallback = [
	{
		title: "Admissions Funnel",
		desc: "Lead → Enrolled conversion by branch",
		icon: ChartColumn,
		tag: "Sales"
	},
	{
		title: "Revenue by Destination",
		desc: "Country-wise revenue and margin",
		icon: ChartPie,
		tag: "Finance"
	},
	{
		title: "Counsellor Productivity",
		desc: "Applications and offers per counsellor",
		icon: Users,
		tag: "HR"
	},
	{
		title: "Partner Contribution",
		desc: "Sub-agent lead quality and payouts",
		icon: Earth,
		tag: "Partners"
	},
	{
		title: "Cash Flow Forecast",
		desc: "12-month projection across branches",
		icon: ChartLine,
		tag: "Finance"
	},
	{
		title: "Visa Success Rate",
		desc: "Approvals vs. rejections by country",
		icon: FileChartColumnIncreasing,
		tag: "Compliance"
	},
	{
		title: "Marketing ROI",
		desc: "Campaign spend vs. qualified leads",
		icon: Wallet,
		tag: "Marketing"
	},
	{
		title: "Branch P&L",
		desc: "Branch-level profitability",
		icon: ChartColumn,
		tag: "Finance"
	}
];
var iconMap = {
	"Admissions Funnel": ChartColumn,
	"Revenue by Destination": ChartPie,
	"Counsellor Productivity": Users,
	"Partner Contribution": Earth,
	"Cash Flow Forecast": ChartLine,
	"Visa Success Rate": FileChartColumnIncreasing,
	"Marketing ROI": Wallet,
	"Branch P&L": ChartColumn
};
function ReportsPage() {
	const { data, isLoading } = useQuery({
		queryKey: ["reports"],
		queryFn: async () => {
			try {
				const r = await api.get("/reports");
				const d = r.data ?? r ?? [];
				return d.length ? d : fallback;
			} catch {
				return fallback;
			}
		}
	});
	const reports = data?.length ? data.map((r) => ({
		...r,
		icon: iconMap[r.title] ?? ChartColumn
	})) : fallback;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
		title: "Reports",
		description: "Curated dashboards and downloadable reports",
		actions: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
			className: "rounded-lg",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-4 w-4" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 79,
				columnNumber: 133
			}, this), " Schedule Report"]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 79,
			columnNumber: 102
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 79,
		columnNumber: 7
	}, this), isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex items-center gap-2 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 81,
			columnNumber: 91
		}, this), " Loading…"]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 81,
		columnNumber: 20
	}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
		children: reports.map((r) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "rounded-2xl shadow-soft transition hover:shadow-elevated",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r.icon, { className: "h-5 w-5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 85,
						columnNumber: 110
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 85,
					columnNumber: 19
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "rounded-md border px-2 py-0.5 text-[11px] text-muted-foreground",
					children: r.tag
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 86,
					columnNumber: 19
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 84,
				columnNumber: 17
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
				className: "mt-3 text-base",
				children: r.title
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 88,
				columnNumber: 17
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 83,
				columnNumber: 15
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground",
				children: r.desc
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 91,
				columnNumber: 17
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "outline",
					size: "sm",
					className: "rounded-lg",
					children: "View"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 93,
					columnNumber: 19
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "ghost",
					size: "sm",
					className: "rounded-lg text-primary",
					children: "Export"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 94,
					columnNumber: 19
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 92,
				columnNumber: 17
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 90,
				columnNumber: 15
			}, this)]
		}, r.title, true, {
			fileName: _jsxFileName,
			lineNumber: 82,
			columnNumber: 36
		}, this))
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 81,
		columnNumber: 153
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 78,
		columnNumber: 10
	}, this);
}
//#endregion
export { ReportsPage as component };
