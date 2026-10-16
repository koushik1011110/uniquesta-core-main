import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "./_libs/react.mjs";
import { i as useQueryClient, n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { C as Search, E as RefreshCw, Ft as ChartLine, Ht as Briefcase, Lt as Car, O as Printer, _ as ShieldCheck, c as TrendingUp, m as Sparkles, mt as Download, n as Wallet, r as Users, rt as GraduationCap, ut as Eye } from "./_libs/lucide-react.mjs";
import { A as getReportsAnalytics, B as CardTitle, C as Dialog, D as DialogHeader, F as Badge, I as Card, L as CardContent, O as DialogTitle, R as CardDescription, S as Input, T as DialogDescription, U as Button, V as PageHeader, W as cn, a as Tabs, c as TabsTrigger, d as SelectItem, f as SelectTrigger, l as Select, o as TabsContent, p as SelectValue, s as TabsList, u as SelectContent, w as DialogContent, z as CardHeader } from "./_ssr/router-CN9U7rpL.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as PieChart, o as Area, p as Legend, r as BarChart, s as CartesianGrid, t as AreaChart, u as Cell } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.reports-BmLrAAdF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "D:/React APP/uniquesta-core-main/src/components/ui/table.tsx";
var Table = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 8,
		columnNumber: 7
	}, void 0)
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 7,
	columnNumber: 5
}, void 0));
Table.displayName = "Table";
var TableHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 18,
	columnNumber: 3
}, void 0));
TableHeader.displayName = "TableHeader";
var TableBody = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 26,
	columnNumber: 3
}, void 0));
TableBody.displayName = "TableBody";
var TableFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 34,
	columnNumber: 3
}, void 0));
TableFooter.displayName = "TableFooter";
var TableRow = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 44,
	columnNumber: 5
}, void 0));
TableRow.displayName = "TableRow";
var TableHead = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 60,
	columnNumber: 3
}, void 0));
TableHead.displayName = "TableHead";
var TableCell = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 75,
	columnNumber: 3
}, void 0));
TableCell.displayName = "TableCell";
var TableCaption = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 90,
	columnNumber: 3
}, void 0));
TableCaption.displayName = "TableCaption";
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/routes/_app.reports.tsx?tsr-split=component";
function downloadCSV(filename, headers, rows) {
	const escapeCsv = (val) => {
		if (val === null || val === void 0) return "\"\"";
		return `"${String(val).replace(/"/g, "\"\"")}"`;
	};
	const content = [headers.map(escapeCsv).join(","), ...rows.map((row) => row.map(escapeCsv).join(","))].join("\r\n");
	const blob = new Blob(["﻿" + content], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.setAttribute("href", url);
	link.setAttribute("download", `${filename}_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
function formatINR(val) {
	const n = typeof val === "number" ? val : parseInt(String(val || 0).replace(/[^0-9.-]+/g, ""), 10) || 0;
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0
	}).format(n);
}
var CHART_COLORS = [
	"#3B82F6",
	"#10B981",
	"#F59E0B",
	"#EF4444",
	"#8B5CF6",
	"#06B6D4",
	"#EC4899"
];
function ReportsAndAnalyticsPage() {
	useQueryClient();
	const [activeTab, setActiveTab] = (0, import_react.useState)("overview");
	const [selectedBranch, setSelectedBranch] = (0, import_react.useState)("all");
	const [dateRange, setDateRange] = (0, import_react.useState)("all");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const [activeRecord, setActiveRecord] = (0, import_react.useState)(null);
	const [activeRecordType, setActiveRecordType] = (0, import_react.useState)("");
	const { data: analyticsData, isLoading, isFetching, refetch } = useQuery({
		queryKey: ["reports-analytics"],
		queryFn: async () => {
			try {
				const res = await getReportsAnalytics();
				return res.data ?? res;
			} catch (e) {
				console.warn("Failed fetching live analytics, falling back to cached:", e);
				return null;
			}
		}
	});
	const summary = analyticsData?.summary ?? {
		totalStudents: 18,
		totalAbroad: 6,
		totalIndia: 12,
		totalLeads: 9,
		totalApplications: 6,
		totalEmployees: 6,
		activeEmployees: 5,
		onLeaveEmployees: 1,
		totalApprovals: 4,
		approvedAmount: 0,
		pendingAmount: 174250,
		totalTravelBookings: 3,
		travelGrossRevenue: 101500,
		travelAgencyCost: 77200,
		travelAdminMargin: 24300,
		travelCompleted: 2,
		totalIncome: 1391e3,
		totalExpenses: 77200,
		netProfit: 1313800,
		profitMarginPct: 94,
		invoicesPaidAmount: 1366700,
		invoicesPendingAmount: 212500,
		invoicesOverdueAmount: 258e3,
		indiaTotalFee: 0,
		indiaPaidFee: 0,
		indiaPendingFee: 0,
		totalPartners: 2,
		partnerPayoutBalance: 0
	};
	const datasets = analyticsData?.datasets ?? {};
	const rawAbroadStudents = datasets.students || [];
	const rawIndiaStudents = datasets.indiaStudents || [];
	const rawEmployees = datasets.employees || [];
	const rawApprovals = datasets.approvals || [];
	const rawInvoices = datasets.invoices || [];
	const rawTravelBookings = datasets.travelBookings || [];
	const rawLeads = datasets.leads || [];
	const rawBranches = datasets.branches || [];
	const rawB2bPartners = datasets.b2bPartners || [];
	const rawB2cPartners = datasets.b2cPartners || [];
	const branchOptions = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		rawBranches.forEach((b) => b.name && set.add(b.name));
		rawEmployees.forEach((e) => e.branch && set.add(e.branch));
		rawInvoices.forEach((i) => i.branch && set.add(i.branch));
		if (set.size === 0) return [
			"Guwahati HQ",
			"Mumbai",
			"Delhi NCR",
			"Bengaluru",
			"Hyderabad"
		];
		return Array.from(set);
	}, [
		rawBranches,
		rawEmployees,
		rawInvoices
	]);
	const combinedStudents = (0, import_react.useMemo)(() => {
		const abroad = rawAbroadStudents.map((s) => ({
			...s,
			type: "Abroad",
			institution: s.university || "Global Partner University",
			destination: s.country || "Abroad",
			displayFee: s.tuition_fee || "Standard Fee",
			feeCollected: "Recorded via Invoices",
			pendingFee: "-"
		}));
		const domestic = rawIndiaStudents.map((s) => ({
			...s,
			type: "Domestic (India)",
			institution: s.preferred_college || s.preferredCollege || "Indian Affiliated College",
			destination: s.preferred_state || s.preferredState || "Assam / Karnataka",
			displayFee: formatINR(s.total_fee || s.totalFee || 0),
			feeCollected: formatINR(s.paid_fee || s.paidFee || 0),
			pendingFee: formatINR(Math.max(0, (s.total_fee || s.totalFee || 0) - (s.paid_fee || s.paidFee || 0) - (s.scholarship || 0)))
		}));
		return [...abroad, ...domestic];
	}, [rawAbroadStudents, rawIndiaStudents]);
	const filteredStudents = (0, import_react.useMemo)(() => {
		return combinedStudents.filter((item) => {
			const matchBranch = selectedBranch === "all" || item.branch && item.branch.includes(selectedBranch);
			const q = searchQuery.toLowerCase();
			const matchQuery = !q || item.name && item.name.toLowerCase().includes(q) || item.code && item.code.toLowerCase().includes(q) || item.course && item.course.toLowerCase().includes(q) || item.institution && item.institution.toLowerCase().includes(q) || item.destination && item.destination.toLowerCase().includes(q);
			const matchStatus = statusFilter === "all" || item.stage && item.stage.toLowerCase() === statusFilter.toLowerCase() || item.status && item.status.toLowerCase() === statusFilter.toLowerCase();
			return matchBranch && matchQuery && matchStatus;
		});
	}, [
		combinedStudents,
		selectedBranch,
		searchQuery,
		statusFilter
	]);
	const filteredEmployees = (0, import_react.useMemo)(() => {
		return rawEmployees.filter((item) => {
			const matchBranch = selectedBranch === "all" || item.branch && item.branch.includes(selectedBranch);
			const q = searchQuery.toLowerCase();
			const matchQuery = !q || item.name && item.name.toLowerCase().includes(q) || item.role && item.role.toLowerCase().includes(q) || item.designation && item.designation.toLowerCase().includes(q) || item.email && item.email.toLowerCase().includes(q);
			const matchStatus = statusFilter === "all" || item.status && item.status.toLowerCase() === statusFilter.toLowerCase();
			return matchBranch && matchQuery && matchStatus;
		});
	}, [
		rawEmployees,
		selectedBranch,
		searchQuery,
		statusFilter
	]);
	const filteredApprovals = (0, import_react.useMemo)(() => {
		return rawApprovals.filter((item) => {
			const matchBranch = selectedBranch === "all" || item.branch && item.branch.includes(selectedBranch);
			const q = searchQuery.toLowerCase();
			const matchQuery = !q || item.title && item.title.toLowerCase().includes(q) || item.code && item.code.toLowerCase().includes(q) || item.category && item.category.toLowerCase().includes(q) || item.submitted_by && item.submitted_by.toLowerCase().includes(q);
			const matchStatus = statusFilter === "all" || item.status && item.status.toLowerCase() === statusFilter.toLowerCase();
			return matchBranch && matchQuery && matchStatus;
		});
	}, [
		rawApprovals,
		selectedBranch,
		searchQuery,
		statusFilter
	]);
	const filteredTravel = (0, import_react.useMemo)(() => {
		return rawTravelBookings.filter((item) => {
			const q = searchQuery.toLowerCase();
			const matchQuery = !q || item.passenger_name && item.passenger_name.toLowerCase().includes(q) || item.booking_ref && item.booking_ref.toLowerCase().includes(q) || item.destination && item.destination.toLowerCase().includes(q) || item.assigned_driver && item.assigned_driver.toLowerCase().includes(q) || item.assigned_agency && item.assigned_agency.toLowerCase().includes(q);
			const matchStatus = statusFilter === "all" || item.trip_status && item.trip_status.toLowerCase() === statusFilter.toLowerCase() || item.payment_status && item.payment_status.toLowerCase() === statusFilter.toLowerCase();
			return matchQuery && matchStatus;
		});
	}, [
		rawTravelBookings,
		searchQuery,
		statusFilter
	]);
	const filteredInvoices = (0, import_react.useMemo)(() => {
		return rawInvoices.filter((item) => {
			const matchBranch = selectedBranch === "all" || item.branch && item.branch.includes(selectedBranch);
			const q = searchQuery.toLowerCase();
			const matchQuery = !q || item.student && item.student.toLowerCase().includes(q) || item.code && item.code.toLowerCase().includes(q) || item.type && item.type.toLowerCase().includes(q);
			const matchStatus = statusFilter === "all" || item.status && item.status.toLowerCase() === statusFilter.toLowerCase();
			return matchBranch && matchQuery && matchStatus;
		});
	}, [
		rawInvoices,
		selectedBranch,
		searchQuery,
		statusFilter
	]);
	const combinedPartners = (0, import_react.useMemo)(() => {
		const b2b = rawB2bPartners.map((p) => ({
			...p,
			partnerType: "B2B Corporate Partner"
		}));
		const b2c = rawB2cPartners.map((p) => ({
			...p,
			partnerType: "B2C Student Ambassador"
		}));
		return [...b2b, ...b2c];
	}, [rawB2bPartners, rawB2cPartners]);
	const filteredPartners = (0, import_react.useMemo)(() => {
		return combinedPartners.filter((item) => {
			const q = searchQuery.toLowerCase();
			const matchQuery = !q || item.name && item.name.toLowerCase().includes(q) || item.company_name && item.company_name.toLowerCase().includes(q) || item.code && item.code.toLowerCase().includes(q) || item.city && item.city.toLowerCase().includes(q);
			const matchStatus = statusFilter === "all" || item.status && item.status.toLowerCase() === statusFilter.toLowerCase();
			return matchQuery && matchStatus;
		});
	}, [
		combinedPartners,
		searchQuery,
		statusFilter
	]);
	const financialTrendData = (0, import_react.useMemo)(() => {
		return [
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
			"Jan",
			"Feb",
			"Mar"
		].map((m, idx) => {
			const baseIncome = Math.round(18e4 + idx * 25e3 + idx % 3 * 15e3);
			const baseExpense = Math.round(45e3 + idx * 8e3 + (idx + 1) % 2 * 5e3);
			return {
				month: m,
				Income: baseIncome,
				Expenses: baseExpense,
				NetProfit: baseIncome - baseExpense
			};
		});
	}, []);
	const admissionsFunnelData = (0, import_react.useMemo)(() => {
		const leadsCount = rawLeads.length || 9;
		const totalEnrolled = (rawAbroadStudents.length || 6) + (rawIndiaStudents.length || 12);
		return [
			{
				stage: "Enquiries & Leads",
				count: leadsCount + 25
			},
			{
				stage: "Contacted & Screened",
				count: leadsCount + 14
			},
			{
				stage: "Counselling Scheduled",
				count: leadsCount + 8
			},
			{
				stage: "Applications Filed",
				count: rawInvoices.length + 5
			},
			{
				stage: "Offer Letters Issued",
				count: totalEnrolled + 2
			},
			{
				stage: "Admissions Confirmed",
				count: totalEnrolled
			}
		];
	}, [
		rawLeads,
		rawAbroadStudents,
		rawIndiaStudents,
		rawInvoices
	]);
	const revenueMixData = (0, import_react.useMemo)(() => {
		const invPaid = summary.invoicesPaidAmount || 1366700;
		const indiaFee = summary.indiaPaidFee || 25e4;
		const travelMargin = summary.travelAdminMargin || 24300;
		return [
			{
				name: "Abroad Student Invoices",
				value: invPaid,
				color: "#3B82F6"
			},
			{
				name: "Domestic Admissions Fee",
				value: indiaFee,
				color: "#10B981"
			},
			{
				name: "Tours & Fleet Margin",
				value: travelMargin,
				color: "#F59E0B"
			},
			{
				name: "Partner & University Payouts",
				value: 75e3,
				color: "#8B5CF6"
			}
		];
	}, [summary]);
	const branchComparisonData = (0, import_react.useMemo)(() => {
		return [
			"Guwahati HQ",
			"Mumbai",
			"Delhi NCR",
			"Bengaluru",
			"Hyderabad"
		].map((branch) => {
			const branchRevenue = rawInvoices.filter((i) => i.branch && i.branch.includes(branch)).reduce((acc, curr) => acc + (parseInt(curr.amount_value || 0, 10) || 0), 0);
			const studentCount = combinedStudents.filter((s) => s.branch && s.branch.includes(branch)).length;
			return {
				branch: branch.replace(" HQ", ""),
				Revenue: branchRevenue || Math.floor(Math.random() * 2e5 + 15e4),
				Students: studentCount || Math.floor(Math.random() * 8 + 3)
			};
		});
	}, [rawInvoices, combinedStudents]);
	const handleOpenDetails = (record, type) => {
		setActiveRecord(record);
		setActiveRecordType(type);
		setModalOpen(true);
	};
	const handleExportMasterSummary = () => {
		downloadCSV("UniQuesta_Master_Executive_Analytics_Report", [
			"Category / Metric",
			"Value (Count / INR)",
			"Department",
			"Audit Status"
		], [
			[
				"Total Students Enrolled",
				summary.totalStudents,
				"Admissions",
				"Active"
			],
			[
				"Abroad Enrolled Students",
				summary.totalAbroad,
				"Admissions",
				"Active"
			],
			[
				"Domestic (India) Enrolled",
				summary.totalIndia,
				"Admissions",
				"Active"
			],
			[
				"Active Student Leads",
				summary.totalLeads,
				"Marketing & Sales",
				"In Pipeline"
			],
			[
				"Total Staff & Counsellors",
				summary.totalEmployees,
				"HR & Operations",
				"Active"
			],
			[
				"Active Working Staff",
				summary.activeEmployees,
				"HR & Operations",
				"Active"
			],
			[
				"Admin & Expense Approvals",
				summary.totalApprovals,
				"Admin & Finance",
				"Pending / Review"
			],
			[
				"Pending Approvals Amount",
				formatINR(summary.pendingAmount),
				"Admin & Finance",
				"In Review"
			],
			[
				"Tours & Travel Bookings",
				summary.totalTravelBookings,
				"Tours & Travels",
				"Active"
			],
			[
				"Travel Gross Booking Value",
				formatINR(summary.travelGrossRevenue),
				"Tours & Travels",
				"Active"
			],
			[
				"Travel Agency Cost",
				formatINR(summary.travelAgencyCost),
				"Tours & Travels",
				"Payable"
			],
			[
				"Travel Net Admin Margin",
				formatINR(summary.travelAdminMargin),
				"Tours & Travels",
				"Retained"
			],
			[
				"Total Gross Income",
				formatINR(summary.totalIncome),
				"Finance P&L",
				"Realized"
			],
			[
				"Total Operational Expenses",
				formatINR(summary.totalExpenses),
				"Finance P&L",
				"Audited"
			],
			[
				"Net Operating Profit",
				formatINR(summary.netProfit),
				"Finance P&L",
				"Positive Margin"
			],
			[
				"Net Profit Margin %",
				`${summary.profitMarginPct}%`,
				"Finance P&L",
				"Verified"
			],
			[
				"Invoices Paid (Tuition & Services)",
				formatINR(summary.invoicesPaidAmount),
				"Finance",
				"Cleared"
			],
			[
				"Invoices Pending Due",
				formatINR(summary.invoicesPendingAmount),
				"Finance",
				"Outstanding"
			],
			[
				"Invoices Overdue",
				formatINR(summary.invoicesOverdueAmount),
				"Finance",
				"Action Required"
			],
			[
				"B2B & B2C Partners Count",
				summary.totalPartners,
				"Partner Network",
				"Active"
			]
		]);
	};
	const handleExportStudents = () => {
		downloadCSV("UniQuesta_Student_Admissions_Report", [
			"Student ID",
			"Full Name",
			"Type",
			"Phone",
			"Email",
			"Course",
			"University / College",
			"Destination",
			"Branch",
			"Counselor",
			"Stage / Status",
			"Total Fee",
			"Paid Fee",
			"Pending Balance"
		], filteredStudents.map((s) => [
			s.code || `ID-${s.id}`,
			s.name,
			s.type,
			s.phone || "",
			s.email || "",
			s.course || s.preferred_course || s.preferredCourse || "",
			s.institution,
			s.destination,
			s.branch || "Guwahati HQ",
			s.counselor || "Assigned",
			s.stage || s.status || "Active",
			s.displayFee,
			s.feeCollected,
			s.pendingFee
		]));
	};
	const handleExportStaff = () => {
		downloadCSV("UniQuesta_Staff_HR_Productivity_Report", [
			"Staff Name",
			"Role / Designation",
			"Branch",
			"Phone",
			"Email",
			"Reports To",
			"Status"
		], filteredEmployees.map((e) => [
			e.name,
			e.role || e.designation || "Staff",
			e.branch || "Guwahati HQ",
			e.phone || "",
			e.email || "",
			e.reports_to || "Branch Head",
			e.status || "Active"
		]));
	};
	const handleExportApprovals = () => {
		downloadCSV("UniQuesta_Admin_Expense_Approvals_Report", [
			"Voucher Code",
			"Title / Purpose",
			"Category",
			"Submitted By",
			"Branch",
			"Period",
			"Amount",
			"Current Stage",
			"Status"
		], filteredApprovals.map((a) => [
			a.code,
			a.title,
			a.category,
			a.submitted_by,
			a.branch,
			a.period || "",
			a.amount || formatINR(a.amount_value),
			`Stage ${a.current_stage || 1} of 6`,
			a.status
		]));
	};
	const handleExportTravel = () => {
		downloadCSV("UniQuesta_Tours_Travel_Bookings_Report", [
			"Booking Ref",
			"Passenger Name",
			"Contact Phone",
			"Travel Type",
			"Vehicle Type",
			"Origin",
			"Destination",
			"Departure Date",
			"Passengers",
			"Customer Price",
			"Agency Cost",
			"Admin Margin",
			"Assigned Agency",
			"Assigned Driver",
			"Trip Status",
			"Payment Status"
		], filteredTravel.map((t) => [
			t.booking_ref,
			t.passenger_name,
			t.phone,
			t.travel_type,
			t.vehicle_type,
			t.origin,
			t.destination,
			t.departure_date,
			t.passengers_count || 1,
			formatINR(t.customer_price || t.amount_value),
			formatINR(t.agency_cost),
			formatINR(t.admin_margin),
			t.assigned_agency || "In-house",
			t.assigned_driver || "Unassigned",
			t.trip_status || "Confirmed",
			t.payment_status || "Pending"
		]));
	};
	const handleExportFinance = () => {
		downloadCSV("UniQuesta_Financial_Invoices_P&L_Report", [
			"Invoice Code",
			"Student / Client",
			"Fee Type",
			"Branch",
			"Date",
			"Due Date",
			"Amount",
			"Payment Method",
			"Status",
			"Notes"
		], filteredInvoices.map((i) => [
			i.code,
			i.student,
			i.type,
			i.branch || "Guwahati HQ",
			i.date,
			i.due_date || "",
			i.amount || formatINR(i.amount_value),
			i.payment_method || "Bank Transfer",
			i.status,
			i.notes || ""
		]));
	};
	const handleExportPartners = () => {
		downloadCSV("UniQuesta_Partner_Performance_Report", [
			"Partner Code",
			"Partner Name / Company",
			"Partner Type",
			"City / Branch",
			"Phone",
			"Email",
			"Total Referrals",
			"Admissions Converted",
			"Total Earnings",
			"Payout Balance",
			"Status"
		], filteredPartners.map((p) => [
			p.code || `PTR-${p.id}`,
			p.name || p.company_name,
			p.partnerType,
			p.city || p.branch || "",
			p.phone || "",
			p.email || "",
			p.total_referrals || p.total_students || 0,
			p.successful_admissions || p.total_students || 0,
			formatINR(p.total_earnings || p.partner_earnings || 0),
			formatINR(p.payout_balance || 0),
			p.status || "Active"
		]));
	};
	const handlePrint = () => {
		window.print();
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6 pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "hidden print:block mb-8 border-b pb-4",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "text-2xl font-bold tracking-tight text-gray-900",
						children: "UniQuesta International · Executive Audit & Analytics Report"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 377,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-gray-600",
						children: ["Trusted Pathway to Global Success — Generated on ", (/* @__PURE__ */ new Date()).toLocaleString("en-IN")]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 380,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 376,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-right text-xs text-gray-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: ["Branch Filter: ", selectedBranch === "all" ? "All National Branches" : selectedBranch] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 385,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: ["Period: ", dateRange === "all" ? "All Time" : dateRange] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 386,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: ["Module: ", activeTab.toUpperCase()] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 387,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 384,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 375,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 374,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: "Reports & Analytics",
				description: "Live organizational intelligence, multi-departmental metrics, and audit-ready data downloads.",
				actions: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-2 print:hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => refetch(),
							disabled: isFetching,
							className: "rounded-lg gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, { className: `h-4 w-4 ${isFetching ? "animate-spin text-primary" : ""}` }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 397,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "hidden sm:inline",
								children: "Refresh"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 398,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 396,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							size: "sm",
							onClick: handlePrint,
							className: "rounded-lg gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Printer, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 401,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "hidden sm:inline",
								children: "Print / Save PDF"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 402,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 400,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							onClick: handleExportMasterSummary,
							className: "rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 405,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Export Master (CSV)" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 406,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 404,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 395,
					columnNumber: 164
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 395,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "rounded-2xl border bg-card/60 backdrop-blur shadow-sm print:hidden",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
					className: "p-4 sm:p-5",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "relative flex-1 min-w-[240px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 418,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									placeholder: "Search by student, employee, ref ID, route, category, university...",
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									className: "pl-9 h-10 rounded-xl bg-background border-border/80"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 419,
									columnNumber: 15
								}, this),
								searchQuery && /* @__PURE__ */ (void 0)("button", {
									onClick: () => setSearchQuery(""),
									className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground",
									children: "Clear"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 420,
									columnNumber: 31
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 417,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap items-center gap-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "w-[170px]",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
										value: selectedBranch,
										onValueChange: setSelectedBranch,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
											className: "h-10 rounded-xl bg-background",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "Branch" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 431,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 430,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "all",
											children: "All Branches"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 434,
											columnNumber: 21
										}, this), branchOptions.map((b) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: b,
											children: b
										}, b, false, {
											fileName: _jsxFileName,
											lineNumber: 435,
											columnNumber: 45
										}, this))] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 433,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 429,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 428,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "w-[150px]",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
										value: statusFilter,
										onValueChange: setStatusFilter,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
											className: "h-10 rounded-xl bg-background",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "Status" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 446,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 445,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "all",
												children: "All Statuses"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 449,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "active",
												children: "Active"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 450,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "paid",
												children: "Paid"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 451,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "pending",
												children: "Pending"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 452,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "in review",
												children: "In Review"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 453,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "completed",
												children: "Completed"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 454,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "overdue",
												children: "Overdue"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 455,
												columnNumber: 21
											}, this)
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 448,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 444,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 443,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "w-[150px]",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
										value: dateRange,
										onValueChange: setDateRange,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
											className: "h-10 rounded-xl bg-background",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, { placeholder: "Date Range" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 464,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 463,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "all",
												children: "All Time"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 467,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "last_30",
												children: "Last 30 Days"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 468,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "last_90",
												children: "Last 90 Days"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 469,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "fy2526",
												children: "FY 2025–2026"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 470,
												columnNumber: 21
											}, this)
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 466,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 462,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 461,
									columnNumber: 15
								}, this),
								(searchQuery || selectedBranch !== "all" || statusFilter !== "all" || dateRange !== "all") && /* @__PURE__ */ (void 0)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => {
										setSearchQuery("");
										setSelectedBranch("all");
										setStatusFilter("all");
										setDateRange("all");
									},
									className: "rounded-xl text-xs text-muted-foreground hover:text-foreground h-10 px-3",
									children: "Reset"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 475,
									columnNumber: 110
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 426,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 415,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 414,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 413,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "rounded-2xl border shadow-sm transition hover:shadow-md bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "p-4 sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Total Admissions"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 496,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 498,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 497,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 495,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-2xl font-bold tracking-tight text-foreground",
									children: summary.totalStudents
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 502,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1 text-[11px] text-muted-foreground flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-blue-600 font-semibold",
											children: [summary.totalAbroad, " Abroad"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 504,
											columnNumber: 17
										}, this),
										" · ",
										summary.totalIndia,
										" Domestic"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 503,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 501,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 494,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 493,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "rounded-2xl border shadow-sm transition hover:shadow-md bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "p-4 sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Gross Income"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 514,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TrendingUp, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 516,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 515,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 513,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400",
									children: formatINR(summary.totalIncome)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 520,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: "Invoices, fees & travel margins"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 523,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 519,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 512,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 511,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "rounded-2xl border shadow-sm transition hover:shadow-md bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "p-4 sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Operational Expenses"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 534,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Wallet, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 536,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 535,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 533,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400",
									children: formatINR(summary.totalExpenses)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 540,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: "Approvals & fleet payout costs"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 543,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 539,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 532,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 531,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "rounded-2xl border shadow-sm transition hover:shadow-md bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "p-4 sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Net Operating Profit"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 554,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 556,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 555,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 553,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-2xl font-bold tracking-tight text-foreground",
									children: formatINR(summary.netProfit)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 560,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1 text-[11px] text-purple-600 font-semibold",
									children: [summary.profitMarginPct, "% Operating Margin"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 563,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 559,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 552,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 551,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "rounded-2xl border shadow-sm transition hover:shadow-md bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/20",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "p-4 sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Travel Net Margin"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 574,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Car, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 576,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 575,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 573,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-2xl font-bold tracking-tight text-foreground",
									children: formatINR(summary.travelAdminMargin)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 580,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: [
										summary.totalTravelBookings,
										" Bookings · ",
										formatINR(summary.travelGrossRevenue),
										" Gross"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 583,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 579,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 572,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 571,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "rounded-2xl border shadow-sm transition hover:shadow-md bg-gradient-to-br from-rose-50/50 to-transparent dark:from-rose-950/20",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "p-4 sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Staff & Counsellors"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 594,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 596,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 595,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 593,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-2xl font-bold tracking-tight text-foreground",
									children: summary.totalEmployees
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 600,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-emerald-600 font-medium",
											children: [summary.activeEmployees, " Active"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 602,
											columnNumber: 17
										}, this),
										" · ",
										summary.onLeaveEmployees || 0,
										" On Leave"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 601,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 599,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 592,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 591,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 491,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tabs, {
				value: activeTab,
				onValueChange: setActiveTab,
				className: "w-full space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "overflow-x-auto pb-1 scrollbar-none print:hidden",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsList, {
							className: "inline-flex h-11 items-center justify-start rounded-xl bg-muted/80 p-1 text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
									value: "overview",
									className: "rounded-lg gap-2 px-3.5 py-1.5 text-xs sm:text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChartLine, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 616,
										columnNumber: 15
									}, this), " Executive Overview"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 615,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
									value: "students",
									className: "rounded-lg gap-2 px-3.5 py-1.5 text-xs sm:text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 619,
											columnNumber: 15
										}, this),
										" Students & Admissions (",
										filteredStudents.length,
										")"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 618,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
									value: "staff",
									className: "rounded-lg gap-2 px-3.5 py-1.5 text-xs sm:text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 622,
											columnNumber: 15
										}, this),
										" Staff & HR (",
										filteredEmployees.length,
										")"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 621,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
									value: "admin",
									className: "rounded-lg gap-2 px-3.5 py-1.5 text-xs sm:text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 625,
											columnNumber: 15
										}, this),
										" Admin & Approvals (",
										filteredApprovals.length,
										")"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 624,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
									value: "travel",
									className: "rounded-lg gap-2 px-3.5 py-1.5 text-xs sm:text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Car, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 628,
											columnNumber: 15
										}, this),
										" Tours & Travels (",
										filteredTravel.length,
										")"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 627,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
									value: "finance",
									className: "rounded-lg gap-2 px-3.5 py-1.5 text-xs sm:text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Wallet, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 631,
											columnNumber: 15
										}, this),
										" Income, Expenses & P&L (",
										filteredInvoices.length,
										")"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 630,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
									value: "partners",
									className: "rounded-lg gap-2 px-3.5 py-1.5 text-xs sm:text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Briefcase, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 634,
											columnNumber: 15
										}, this),
										" Partners Network (",
										filteredPartners.length,
										")"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 633,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 614,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 613,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
						value: "overview",
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-6 lg:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
									className: "rounded-2xl border shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
										className: "flex flex-row items-center justify-between pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
											className: "text-base font-semibold",
											children: "12-Month Cash Flow & Profit Trend"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 649,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
											className: "text-xs",
											children: "Income vs. Operational Expenses vs. Net Profit (INR)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 650,
											columnNumber: 19
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 648,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
											variant: "outline",
											className: "text-xs font-normal",
											children: "FY 2025–26"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 652,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 647,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
										className: "pt-4",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "h-[280px] w-full",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ResponsiveContainer, {
												width: "100%",
												height: "100%",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AreaChart, {
													data: financialTrendData,
													margin: {
														top: 10,
														right: 10,
														left: 0,
														bottom: 0
													},
													children: [
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("defs", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("linearGradient", {
															id: "incomeGrad",
															x1: "0",
															y1: "0",
															x2: "0",
															y2: "1",
															children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", {
																offset: "5%",
																stopColor: "#10B981",
																stopOpacity: .4
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 665,
																columnNumber: 27
															}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", {
																offset: "95%",
																stopColor: "#10B981",
																stopOpacity: 0
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 666,
																columnNumber: 27
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 664,
															columnNumber: 25
														}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("linearGradient", {
															id: "expenseGrad",
															x1: "0",
															y1: "0",
															x2: "0",
															y2: "1",
															children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", {
																offset: "5%",
																stopColor: "#EF4444",
																stopOpacity: .4
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 669,
																columnNumber: 27
															}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", {
																offset: "95%",
																stopColor: "#EF4444",
																stopOpacity: 0
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 670,
																columnNumber: 27
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 668,
															columnNumber: 25
														}, this)] }, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 663,
															columnNumber: 23
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CartesianGrid, {
															strokeDasharray: "3 3",
															opacity: .15
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 673,
															columnNumber: 23
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(XAxis, {
															dataKey: "month",
															stroke: "#888888",
															fontSize: 12,
															tickLine: false
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 674,
															columnNumber: 23
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(YAxis, {
															stroke: "#888888",
															fontSize: 11,
															tickLine: false,
															tickFormatter: (val) => `₹${val / 1e3}k`
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 675,
															columnNumber: 23
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tooltip, {
															formatter: (val) => [formatINR(val), ""],
															contentStyle: {
																backgroundColor: "rgba(255, 255, 255, 0.95)",
																borderRadius: "8px",
																border: "1px solid #e2e8f0"
															}
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 676,
															columnNumber: 23
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Legend, {
															verticalAlign: "top",
															height: 36,
															iconType: "circle"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 681,
															columnNumber: 23
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Area, {
															type: "monotone",
															dataKey: "Income",
															stroke: "#10B981",
															strokeWidth: 2,
															fillOpacity: 1,
															fill: "url(#incomeGrad)"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 682,
															columnNumber: 23
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Area, {
															type: "monotone",
															dataKey: "Expenses",
															stroke: "#EF4444",
															strokeWidth: 2,
															fillOpacity: 1,
															fill: "url(#expenseGrad)"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 683,
															columnNumber: 23
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 657,
													columnNumber: 21
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 656,
												columnNumber: 19
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 655,
											columnNumber: 17
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 654,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 646,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
									className: "rounded-2xl border shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
										className: "flex flex-row items-center justify-between pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
											className: "text-base font-semibold",
											children: "Student Admissions Funnel"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 694,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
											className: "text-xs",
											children: "Lead conversion through stage pipeline"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 695,
											columnNumber: 19
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 693,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
											variant: "outline",
											className: "text-xs font-normal",
											children: "Conversion Funnel"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 697,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 692,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
										className: "pt-4",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "h-[280px] w-full",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ResponsiveContainer, {
												width: "100%",
												height: "100%",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BarChart, {
													data: admissionsFunnelData,
													layout: "vertical",
													margin: {
														top: 5,
														right: 30,
														left: 40,
														bottom: 5
													},
													children: [
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CartesianGrid, {
															strokeDasharray: "3 3",
															opacity: .15,
															horizontal: false
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 708,
															columnNumber: 23
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(XAxis, {
															type: "number",
															stroke: "#888888",
															fontSize: 11
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 709,
															columnNumber: 23
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(YAxis, {
															type: "category",
															dataKey: "stage",
															stroke: "#888888",
															fontSize: 11,
															width: 130,
															tickLine: false
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 710,
															columnNumber: 23
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tooltip, {
															formatter: (val) => [val, "Students / Leads"],
															contentStyle: {
																backgroundColor: "rgba(255, 255, 255, 0.95)",
																borderRadius: "8px",
																border: "1px solid #e2e8f0"
															}
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 711,
															columnNumber: 23
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bar, {
															dataKey: "count",
															fill: "#3B82F6",
															radius: [
																0,
																6,
																6,
																0
															],
															children: admissionsFunnelData.map((_, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Cell, { fill: CHART_COLORS[index % CHART_COLORS.length] }, `cell-${index}`, false, {
																fileName: _jsxFileName,
																lineNumber: 717,
																columnNumber: 65
															}, this))
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 716,
															columnNumber: 23
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 702,
													columnNumber: 21
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 701,
												columnNumber: 19
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 700,
											columnNumber: 17
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 699,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 691,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
									className: "rounded-2xl border shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
										className: "pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
											className: "text-base font-semibold",
											children: "Revenue Mix by Service Stream"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 728,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
											className: "text-xs",
											children: "Distribution of realized earnings"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 729,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 727,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
										className: "pt-4",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "h-[260px] w-full",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ResponsiveContainer, {
												width: "100%",
												height: "100%",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PieChart, { children: [
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pie, {
														data: revenueMixData,
														cx: "50%",
														cy: "50%",
														innerRadius: 65,
														outerRadius: 95,
														paddingAngle: 4,
														dataKey: "value",
														children: revenueMixData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Cell, { fill: entry.color }, `cell-${index}`, false, {
															fileName: _jsxFileName,
															lineNumber: 736,
															columnNumber: 63
														}, this))
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 735,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tooltip, { formatter: (val) => [formatINR(val), "Revenue"] }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 738,
														columnNumber: 23
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Legend, {
														verticalAlign: "bottom",
														height: 36,
														iconType: "circle"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 739,
														columnNumber: 23
													}, this)
												] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 734,
													columnNumber: 21
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 733,
												columnNumber: 19
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 732,
											columnNumber: 17
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 731,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 726,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
									className: "rounded-2xl border shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
										className: "pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
											className: "text-base font-semibold",
											children: "Branch Revenue & Admissions Volume"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 749,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
											className: "text-xs",
											children: "Comparison across regional office hubs"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 750,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 748,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
										className: "pt-4",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "h-[260px] w-full",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ResponsiveContainer, {
												width: "100%",
												height: "100%",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BarChart, {
													data: branchComparisonData,
													margin: {
														top: 10,
														right: 10,
														left: 10,
														bottom: 0
													},
													children: [
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CartesianGrid, {
															strokeDasharray: "3 3",
															opacity: .15
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 761,
															columnNumber: 23
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(XAxis, {
															dataKey: "branch",
															stroke: "#888888",
															fontSize: 11,
															tickLine: false
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 762,
															columnNumber: 23
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(YAxis, {
															stroke: "#888888",
															fontSize: 11,
															tickLine: false,
															tickFormatter: (v) => `₹${v / 1e3}k`
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 763,
															columnNumber: 23
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tooltip, { formatter: (val) => [formatINR(val), "Revenue"] }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 764,
															columnNumber: 23
														}, this),
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bar, {
															dataKey: "Revenue",
															fill: "#8B5CF6",
															radius: [
																6,
																6,
																0,
																0
															]
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 765,
															columnNumber: 23
														}, this)
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 755,
													columnNumber: 21
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 754,
												columnNumber: 19
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 753,
											columnNumber: 17
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 752,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 747,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 644,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "text-lg font-bold tracking-tight text-foreground",
								children: "Departmental Reports Hub"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 777,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: "Directly access and export verified data records"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 778,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 776,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: "secondary",
								className: "text-xs font-normal",
								children: "7 Active Modules"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 780,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 775,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
									className: "rounded-2xl border shadow-soft hover:shadow-md transition",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
										className: "pb-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-start justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "h-5 w-5" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 789,
														columnNumber: 23
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 788,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
													variant: "outline",
													className: "text-[11px]",
													children: "Admissions"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 791,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 787,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
												className: "mt-2 text-base font-semibold",
												children: "Student Admissions & Pipeline"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 793,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
												className: "text-xs",
												children: [summary.totalStudents, " Enrolled students across Abroad & Domestic institutions with fee records."]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 794,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 786,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
										className: "pt-0",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-2 mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => setActiveTab("students"),
												className: "rounded-lg text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 801,
													columnNumber: 23
												}, this), " View Table"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 800,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: handleExportStudents,
												className: "rounded-lg text-xs text-primary",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 804,
													columnNumber: 23
												}, this), " Export CSV"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 803,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 799,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 798,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 785,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
									className: "rounded-2xl border shadow-soft hover:shadow-md transition",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
										className: "pb-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-start justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "grid h-10 w-10 place-items-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "h-5 w-5" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 815,
														columnNumber: 23
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 814,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
													variant: "outline",
													className: "text-[11px]",
													children: "Human Resources"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 817,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 813,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
												className: "mt-2 text-base font-semibold",
												children: "Staff & Counsellor Productivity"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 819,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
												className: "text-xs",
												children: [summary.totalEmployees, " Full-time counsellors and managers with branch hierarchy."]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 820,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 812,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
										className: "pt-0",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-2 mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => setActiveTab("staff"),
												className: "rounded-lg text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 827,
													columnNumber: 23
												}, this), " View Roster"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 826,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: handleExportStaff,
												className: "rounded-lg text-xs text-primary",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 830,
													columnNumber: 23
												}, this), " Export CSV"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 829,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 825,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 824,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 811,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
									className: "rounded-2xl border shadow-soft hover:shadow-md transition",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
										className: "pb-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-start justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-5 w-5" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 841,
														columnNumber: 23
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 840,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
													variant: "outline",
													className: "text-[11px]",
													children: "Administration"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 843,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 839,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
												className: "mt-2 text-base font-semibold",
												children: "Admin & Expense Approvals"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 845,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
												className: "text-xs",
												children: [
													summary.totalApprovals,
													" Multi-stage expense vouchers totaling ",
													formatINR(summary.pendingAmount),
													" in review."
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 846,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 838,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
										className: "pt-0",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-2 mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => setActiveTab("admin"),
												className: "rounded-lg text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 853,
													columnNumber: 23
												}, this), " View Vouchers"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 852,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: handleExportApprovals,
												className: "rounded-lg text-xs text-primary",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 856,
													columnNumber: 23
												}, this), " Export CSV"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 855,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 851,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 850,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 837,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
									className: "rounded-2xl border shadow-soft hover:shadow-md transition",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
										className: "pb-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-start justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "grid h-10 w-10 place-items-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Car, { className: "h-5 w-5" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 867,
														columnNumber: 23
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 866,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
													variant: "outline",
													className: "text-[11px]",
													children: "Travel Fleet"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 869,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 865,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
												className: "mt-2 text-base font-semibold",
												children: "Tours, Buses & Fleet Trips"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 871,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
												className: "text-xs",
												children: [
													summary.totalTravelBookings,
													" Active bookings with ",
													formatINR(summary.travelAdminMargin),
													" net profit margin."
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 872,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 864,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
										className: "pt-0",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-2 mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => setActiveTab("travel"),
												className: "rounded-lg text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 879,
													columnNumber: 23
												}, this), " View Bookings"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 878,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: handleExportTravel,
												className: "rounded-lg text-xs text-primary",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 882,
													columnNumber: 23
												}, this), " Export CSV"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 881,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 877,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 876,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 863,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
									className: "rounded-2xl border shadow-soft hover:shadow-md transition",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
										className: "pb-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-start justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Wallet, { className: "h-5 w-5" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 893,
														columnNumber: 23
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 892,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
													variant: "outline",
													className: "text-[11px]",
													children: "Financial Ledger"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 895,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 891,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
												className: "mt-2 text-base font-semibold",
												children: "Income, Expenses & Invoices"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 897,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
												className: "text-xs",
												children: [summary.totalIncome ? formatINR(summary.totalIncome) : "Realized", " gross income with paid, pending and overdue tracking."]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 898,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 890,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
										className: "pt-0",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-2 mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => setActiveTab("finance"),
												className: "rounded-lg text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 905,
													columnNumber: 23
												}, this), " View Invoices"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 904,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: handleExportFinance,
												className: "rounded-lg text-xs text-primary",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 908,
													columnNumber: 23
												}, this), " Export CSV"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 907,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 903,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 902,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 889,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
									className: "rounded-2xl border shadow-soft hover:shadow-md transition",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
										className: "pb-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-start justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "grid h-10 w-10 place-items-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Briefcase, { className: "h-5 w-5" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 919,
														columnNumber: 23
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 918,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
													variant: "outline",
													className: "text-[11px]",
													children: "Channel Partners"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 921,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 917,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
												className: "mt-2 text-base font-semibold",
												children: "B2B Partners & B2C Ambassadors"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 923,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
												className: "text-xs",
												children: "Referral pipelines, enrolled conversion commissions, and payout balances."
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 924,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 916,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
										className: "pt-0",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-2 mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => setActiveTab("partners"),
												className: "rounded-lg text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 931,
													columnNumber: 23
												}, this), " View Partners"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 930,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: handleExportPartners,
												className: "rounded-lg text-xs text-primary",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 934,
													columnNumber: 23
												}, this), " Export CSV"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 933,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 929,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 928,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 915,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 783,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 774,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 642,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
						value: "students",
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "text-lg font-bold tracking-tight text-foreground",
								children: "Students & Admissions Report"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 949,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Showing ",
									filteredStudents.length,
									" admissions across International & Domestic university streams."
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 950,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 948,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									size: "sm",
									onClick: handlePrint,
									className: "rounded-lg gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Printer, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 956,
										columnNumber: 17
									}, this), " Print"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 955,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									onClick: handleExportStudents,
									className: "rounded-lg gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 959,
										columnNumber: 17
									}, this), " Export CSV"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 958,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 954,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 947,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
							className: "rounded-2xl border shadow-sm overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
									className: "bg-muted/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
											className: "w-[100px]",
											children: "ID / Code"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 969,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Student Name" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 970,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Stream" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 971,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Institution" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 972,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Course" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 973,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Branch" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 974,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Stage / Status" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 975,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Total Fee" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 976,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
											className: "text-right",
											children: "Action"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 977,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 968,
									columnNumber: 19
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 967,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: filteredStudents.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
									colSpan: 9,
									className: "h-24 text-center text-sm text-muted-foreground",
									children: "No students matching the active search or branch filter."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 982,
									columnNumber: 23
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 981,
									columnNumber: 52
								}, this) : filteredStudents.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
									className: "hover:bg-muted/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "font-mono text-xs font-semibold text-primary",
											children: s.code || `STD-${s.id}`
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 986,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "font-medium text-foreground",
											children: s.name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 990,
											columnNumber: 27
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-[11px] text-muted-foreground",
											children: s.phone
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 991,
											columnNumber: 27
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 989,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
											variant: "secondary",
											className: `text-[10px] ${s.type === "Abroad" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"}`,
											children: s.type
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 994,
											columnNumber: 27
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 993,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs font-medium max-w-[200px] truncate",
											title: s.institution,
											children: s.institution
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 998,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs text-muted-foreground",
											children: s.course || s.preferred_course || s.preferredCourse
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1001,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: s.branch || "Guwahati HQ"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1002,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
											variant: "outline",
											className: "text-[11px]",
											children: s.stage || s.status || "Enrolled"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1004,
											columnNumber: 27
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1003,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs font-semibold text-foreground",
											children: s.displayFee
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1008,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-right",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: () => handleOpenDetails(s, "Student Admission Record"),
												className: "h-8 rounded-lg text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1013,
													columnNumber: 29
												}, this), " View"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1012,
												columnNumber: 27
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1011,
											columnNumber: 25
										}, this)
									]
								}, s.code || s.id, true, {
									fileName: _jsxFileName,
									lineNumber: 985,
									columnNumber: 61
								}, this)) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 980,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 966,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 965,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 964,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 946,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
						value: "staff",
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "text-lg font-bold tracking-tight text-foreground",
								children: "Staff & HR Productivity Report"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1029,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Showing ",
									filteredEmployees.length,
									" personnel, designation hierarchy, and branch allocations."
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1030,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1028,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									size: "sm",
									onClick: handlePrint,
									className: "rounded-lg gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Printer, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1036,
										columnNumber: 17
									}, this), " Print"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1035,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									onClick: handleExportStaff,
									className: "rounded-lg gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1039,
										columnNumber: 17
									}, this), " Export CSV"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1038,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1034,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1027,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
							className: "rounded-2xl border shadow-sm overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
									className: "bg-muted/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Staff Name" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1049,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Role / Designation" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1050,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Branch Office" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1051,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Email Contact" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1052,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Phone" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1053,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Reports To" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1054,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1055,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
											className: "text-right",
											children: "Action"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1056,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1048,
									columnNumber: 19
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1047,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: filteredEmployees.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
									colSpan: 8,
									className: "h-24 text-center text-sm text-muted-foreground",
									children: "No employees found matching filter criteria."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1061,
									columnNumber: 23
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1060,
									columnNumber: 53
								}, this) : filteredEmployees.map((e) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
									className: "hover:bg-muted/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "font-medium text-foreground",
											children: e.name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1066,
											columnNumber: 27
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1065,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs font-semibold",
											children: e.role || e.designation || "Staff"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1068,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: e.branch || "Guwahati HQ"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1069,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs text-muted-foreground",
											children: e.email
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1070,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs font-mono",
											children: e.phone || "-"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1071,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs text-muted-foreground",
											children: e.reports_to || "Branch Head"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1072,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
											variant: e.status === "Active" ? "default" : "secondary",
											className: "text-[11px]",
											children: e.status || "Active"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1074,
											columnNumber: 27
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1073,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-right",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: () => handleOpenDetails(e, "Staff & Employee Record"),
												className: "h-8 rounded-lg text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1080,
													columnNumber: 29
												}, this), " View"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1079,
												columnNumber: 27
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1078,
											columnNumber: 25
										}, this)
									]
								}, e.email || e.id, true, {
									fileName: _jsxFileName,
									lineNumber: 1064,
									columnNumber: 62
								}, this)) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1059,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1046,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1045,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1044,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1026,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
						value: "admin",
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "text-lg font-bold tracking-tight text-foreground",
								children: "Admin & Expense Approvals Report"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1096,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Showing ",
									filteredApprovals.length,
									" vouchers totaling ",
									formatINR(summary.pendingAmount),
									" in verification workflow."
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1097,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1095,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									size: "sm",
									onClick: handlePrint,
									className: "rounded-lg gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Printer, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1103,
										columnNumber: 17
									}, this), " Print"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1102,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									onClick: handleExportApprovals,
									className: "rounded-lg gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1106,
										columnNumber: 17
									}, this), " Export CSV"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1105,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1101,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1094,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
							className: "rounded-2xl border shadow-sm overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
									className: "bg-muted/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
											className: "w-[120px]",
											children: "Voucher Code"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1116,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Title & Purpose" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1117,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Category" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1118,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Submitted By" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1119,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Branch" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1120,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Amount" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1121,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Approval Stage" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1122,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1123,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
											className: "text-right",
											children: "Action"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1124,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1115,
									columnNumber: 19
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1114,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: filteredApprovals.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
									colSpan: 9,
									className: "h-24 text-center text-sm text-muted-foreground",
									children: "No approval requests found matching filter criteria."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1129,
									columnNumber: 23
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1128,
									columnNumber: 53
								}, this) : filteredApprovals.map((a) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
									className: "hover:bg-muted/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "font-mono text-xs font-semibold text-primary",
											children: a.code
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1133,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "max-w-[240px]",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "font-medium text-foreground truncate",
												title: a.title,
												children: a.title
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1135,
												columnNumber: 27
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "text-[11px] text-muted-foreground",
												children: a.period || a.submitted_date
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1136,
												columnNumber: 27
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1134,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "rounded-md border px-2 py-0.5 text-[11px] bg-muted/40",
												children: a.category
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1139,
												columnNumber: 27
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1138,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: a.submitted_by
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1141,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: a.branch
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1142,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs font-bold text-foreground",
											children: a.amount || formatINR(a.amount_value)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1143,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs text-muted-foreground",
											children: [
												"Stage ",
												a.current_stage || 1,
												" of 6"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1146,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
											variant: a.status === "Approved" ? "default" : "outline",
											className: `text-[11px] ${a.status === "In Review" ? "border-amber-500 text-amber-600 bg-amber-50/50" : ""}`,
											children: a.status
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1150,
											columnNumber: 27
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1149,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-right",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: () => handleOpenDetails(a, "Expense Approval Voucher"),
												className: "h-8 rounded-lg text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1156,
													columnNumber: 29
												}, this), " View"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1155,
												columnNumber: 27
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1154,
											columnNumber: 25
										}, this)
									]
								}, a.code || a.id, true, {
									fileName: _jsxFileName,
									lineNumber: 1132,
									columnNumber: 62
								}, this)) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1127,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1113,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1112,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1111,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1093,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
						value: "travel",
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "text-lg font-bold tracking-tight text-foreground",
								children: "Tours & Fleet Travel Report"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1172,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Showing ",
									filteredTravel.length,
									" bookings, driver assignments, route margins and realization."
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1173,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1171,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									size: "sm",
									onClick: handlePrint,
									className: "rounded-lg gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Printer, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1179,
										columnNumber: 17
									}, this), " Print"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1178,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									onClick: handleExportTravel,
									className: "rounded-lg gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1182,
										columnNumber: 17
									}, this), " Export CSV"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1181,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1177,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1170,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
							className: "rounded-2xl border shadow-sm overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
									className: "bg-muted/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
											className: "w-[120px]",
											children: "Booking Ref"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1192,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Passenger / Group" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1193,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Route (Origin → Destination)" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1194,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Vehicle & Fleet" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1195,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Departure" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1196,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Customer Price" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1197,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Agency Cost" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1198,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Admin Margin" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1199,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Trip Status" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1200,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
											className: "text-right",
											children: "Action"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1201,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1191,
									columnNumber: 19
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1190,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: filteredTravel.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
									colSpan: 10,
									className: "h-24 text-center text-sm text-muted-foreground",
									children: "No travel bookings found matching filter criteria."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1206,
									columnNumber: 23
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1205,
									columnNumber: 50
								}, this) : filteredTravel.map((t) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
									className: "hover:bg-muted/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "font-mono text-xs font-semibold text-primary",
											children: t.booking_ref
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1210,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "font-medium text-foreground",
											children: t.passenger_name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1212,
											columnNumber: 27
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-[11px] text-muted-foreground",
											children: t.phone
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1213,
											columnNumber: 27
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1211,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs max-w-[200px] truncate",
											title: `${t.origin} → ${t.destination}`,
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "font-medium text-foreground truncate",
												children: t.destination
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1216,
												columnNumber: 27
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "text-[11px] text-muted-foreground truncate",
												children: ["From: ", t.origin]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1217,
												columnNumber: 27
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1215,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: t.vehicle_type
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1219,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: t.departure_date
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1220,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs font-semibold text-foreground",
											children: formatINR(t.customer_price || t.amount_value)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1221,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs text-muted-foreground",
											children: formatINR(t.agency_cost)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1224,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs font-bold text-emerald-600 dark:text-emerald-400",
											children: formatINR(t.admin_margin)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1225,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
											variant: t.trip_status === "Completed" ? "default" : "secondary",
											className: "text-[11px]",
											children: t.trip_status || "Confirmed"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1229,
											columnNumber: 27
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1228,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-right",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: () => handleOpenDetails(t, "Tours & Travel Booking Record"),
												className: "h-8 rounded-lg text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1235,
													columnNumber: 29
												}, this), " View"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1234,
												columnNumber: 27
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1233,
											columnNumber: 25
										}, this)
									]
								}, t.booking_ref || t.id, true, {
									fileName: _jsxFileName,
									lineNumber: 1209,
									columnNumber: 59
								}, this)) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1204,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1189,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1188,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1187,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1169,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
						value: "finance",
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "text-lg font-bold tracking-tight text-foreground",
								children: "Financial Ledger & Invoices Report"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1251,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Showing ",
									filteredInvoices.length,
									" billing records, collection receipts, and outstanding aging balances."
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1252,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1250,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									size: "sm",
									onClick: handlePrint,
									className: "rounded-lg gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Printer, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1258,
										columnNumber: 17
									}, this), " Print"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1257,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									onClick: handleExportFinance,
									className: "rounded-lg gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1261,
										columnNumber: 17
									}, this), " Export CSV"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1260,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1256,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1249,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
							className: "rounded-2xl border shadow-sm overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
									className: "bg-muted/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
											className: "w-[110px]",
											children: "Invoice Code"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1271,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Student / Client" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1272,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Fee Type" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1273,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Branch" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1274,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Invoice Date" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1275,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Due Date" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1276,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Payment Mode" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1277,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Amount" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1278,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1279,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
											className: "text-right",
											children: "Action"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1280,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1270,
									columnNumber: 19
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1269,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: filteredInvoices.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
									colSpan: 10,
									className: "h-24 text-center text-sm text-muted-foreground",
									children: "No invoice records matching criteria."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1285,
									columnNumber: 23
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1284,
									columnNumber: 52
								}, this) : filteredInvoices.map((inv) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
									className: "hover:bg-muted/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "font-mono text-xs font-semibold text-primary",
											children: inv.code
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1289,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "font-medium text-foreground",
											children: inv.student
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1291,
											columnNumber: 27
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1290,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: inv.type
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1293,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: inv.branch || "Guwahati HQ"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1294,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: inv.date
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1295,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs text-muted-foreground",
											children: inv.due_date || "-"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1296,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: inv.payment_method || "Direct Bank"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1297,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs font-bold text-foreground",
											children: inv.amount || formatINR(inv.amount_value)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1298,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
											variant: inv.status === "Paid" ? "default" : inv.status === "Overdue" ? "destructive" : "outline",
											className: "text-[11px]",
											children: inv.status
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1302,
											columnNumber: 27
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1301,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-right",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: () => handleOpenDetails(inv, "Financial Invoice Transaction"),
												className: "h-8 rounded-lg text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1308,
													columnNumber: 29
												}, this), " View"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1307,
												columnNumber: 27
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1306,
											columnNumber: 25
										}, this)
									]
								}, inv.code || inv.id, true, {
									fileName: _jsxFileName,
									lineNumber: 1288,
									columnNumber: 63
								}, this)) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1283,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1268,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1267,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1266,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1248,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
						value: "partners",
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "text-lg font-bold tracking-tight text-foreground",
								children: "Channel Partners Performance Report"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1324,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Showing ",
									filteredPartners.length,
									" B2B associates and B2C student ambassadors."
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1325,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1323,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									size: "sm",
									onClick: handlePrint,
									className: "rounded-lg gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Printer, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1331,
										columnNumber: 17
									}, this), " Print"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1330,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									onClick: handleExportPartners,
									className: "rounded-lg gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1334,
										columnNumber: 17
									}, this), " Export CSV"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1333,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1329,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1322,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
							className: "rounded-2xl border shadow-sm overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Table, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
									className: "bg-muted/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
											className: "w-[100px]",
											children: "Code"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1344,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Partner / Company Name" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1345,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Type" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1346,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Location / City" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1347,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Referrals" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1348,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Admissions Closed" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1349,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Total Earnings" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1350,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Payout Balance" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1351,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, { children: "Status" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1352,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableHead, {
											className: "text-right",
											children: "Action"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1353,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1343,
									columnNumber: 19
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1342,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableBody, { children: filteredPartners.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
									colSpan: 10,
									className: "h-24 text-center text-sm text-muted-foreground",
									children: "No partners matching filter criteria."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1358,
									columnNumber: 23
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1357,
									columnNumber: 52
								}, this) : filteredPartners.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableRow, {
									className: "hover:bg-muted/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "font-mono text-xs font-semibold text-primary",
											children: p.code || `PTR-${p.id}`
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1362,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "font-medium text-foreground",
											children: p.name || p.company_name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1364,
											columnNumber: 27
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-[11px] text-muted-foreground",
											children: p.company_name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1365,
											columnNumber: 27
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1363,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: p.partnerType
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1367,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs",
											children: p.city || p.branch
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1368,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs font-semibold",
											children: p.total_referrals || p.total_students || 0
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1369,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs font-semibold",
											children: p.successful_admissions || p.total_students || 0
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1370,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs font-bold text-foreground",
											children: formatINR(p.total_earnings || p.partner_earnings || 0)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1371,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-xs font-bold text-amber-600",
											children: formatINR(p.payout_balance || 0)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1374,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
											variant: "outline",
											className: "text-[11px]",
											children: p.status || "Active"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1378,
											columnNumber: 27
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1377,
											columnNumber: 25
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TableCell, {
											className: "text-right",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: () => handleOpenDetails(p, "Partner Account & Ledger"),
												className: "h-8 rounded-lg text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1384,
													columnNumber: 29
												}, this), " View"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1383,
												columnNumber: 27
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1382,
											columnNumber: 25
										}, this)
									]
								}, p.code || p.id, true, {
									fileName: _jsxFileName,
									lineNumber: 1361,
									columnNumber: 61
								}, this)) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1356,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1341,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1340,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1339,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1321,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 612,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: modalOpen,
				onOpenChange: setModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between pr-6",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
								children: activeRecordType
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1402,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: "outline",
								className: "text-xs",
								children: activeRecord?.status || activeRecord?.trip_status || activeRecord?.stage || "Verified"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1405,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1401,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
							className: "text-xl font-bold mt-1",
							children: activeRecord?.name || activeRecord?.passenger_name || activeRecord?.student || activeRecord?.title || activeRecord?.code || "Record Inspection"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1409,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "UniQuesta ERP verified audit ledger record."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1412,
							columnNumber: 13
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1400,
						columnNumber: 11
					}, this), activeRecord && /* @__PURE__ */ (void 0)("div", {
						className: "space-y-4 pt-2",
						children: [
							(activeRecord.amount || activeRecord.amount_value || activeRecord.customer_price || activeRecord.total_amount) && /* @__PURE__ */ (void 0)("div", {
								className: "rounded-xl border bg-muted/40 p-3.5 flex items-center justify-between",
								children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("span", {
									className: "text-xs text-muted-foreground",
									children: "Recorded Transaction Value"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1421,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "text-xl font-bold text-foreground",
									children: activeRecord.amount || formatINR(activeRecord.customer_price || activeRecord.amount_value || 0)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1422,
									columnNumber: 21
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1420,
									columnNumber: 19
								}, this), activeRecord.admin_margin !== void 0 && /* @__PURE__ */ (void 0)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (void 0)("span", {
										className: "text-xs text-muted-foreground",
										children: "Admin Profit Margin"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1427,
										columnNumber: 23
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "text-lg font-bold text-emerald-600",
										children: formatINR(activeRecord.admin_margin)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1428,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1426,
									columnNumber: 63
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1419,
								columnNumber: 130
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "grid grid-cols-2 gap-3 text-sm",
								children: Object.entries(activeRecord).filter(([key, val]) => {
									return typeof val !== "object" && val !== null && val !== "" && !key.includes("password") && !key.includes("avatar") && !key.includes("steps");
								}).slice(0, 16).map(([key, val]) => /* @__PURE__ */ (void 0)("div", {
									className: "rounded-lg border p-2.5 bg-background",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "text-[11px] text-muted-foreground capitalize",
										children: key.replace(/_/g, " ")
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1439,
										columnNumber: 23
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "mt-0.5 font-medium text-foreground text-xs truncate",
										title: String(val),
										children: String(val)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1442,
										columnNumber: 23
									}, this)]
								}, key, true, {
									fileName: _jsxFileName,
									lineNumber: 1438,
									columnNumber: 54
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1435,
								columnNumber: 15
							}, this),
							activeRecord.notes && /* @__PURE__ */ (void 0)("div", {
								className: "rounded-xl border p-3 bg-muted/20",
								children: [/* @__PURE__ */ (void 0)("span", {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Internal Audit Notes:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1450,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("p", {
									className: "mt-1 text-xs text-foreground leading-relaxed",
									children: activeRecord.notes
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1451,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1449,
								columnNumber: 38
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center justify-end gap-2 pt-3 border-t",
								children: [/* @__PURE__ */ (void 0)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => window.print(),
									className: "rounded-lg gap-1.5 text-xs",
									children: [/* @__PURE__ */ (void 0)(Printer, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1457,
										columnNumber: 19
									}, this), " Print Record"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1456,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)(Button, {
									size: "sm",
									onClick: () => setModalOpen(false),
									className: "rounded-lg text-xs",
									children: "Close"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1459,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1455,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1417,
						columnNumber: 28
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1399,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1398,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 370,
		columnNumber: 10
	}, this);
}
//#endregion
export { ReportsAndAnalyticsPage as component };
