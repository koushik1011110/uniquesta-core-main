import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "./_libs/react.mjs";
import { t as Button } from "./_ssr/button-Th46ikol.mjs";
import { t as Input } from "./_ssr/input-CWiOSw9Q.mjs";
import { t as api } from "./_ssr/api-06dRWXHB.mjs";
import { t as Badge } from "./_ssr/badge-h6Nj5OpU.mjs";
import { n as getUser, o as setUser } from "./_ssr/auth-CMDgS_mZ.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { C as Receipt, Dt as CheckCheck, Et as Check, I as MessageSquare, S as RefreshCw, T as Plus, V as Lock, _ as ShieldCheck, b as Send, bt as CircleCheck, et as Forward, gt as Clock, m as Sparkles, mt as CornerUpLeft, t as X, x as Search, xt as CircleAlert, zt as BellRing } from "./_libs/lucide-react.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { t as PageHeader } from "./_ssr/page-header-DRgCwu0n.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-BpRCf_XK.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./_ssr/dialog-BvRIEwxi.mjs";
import { t as Label } from "./_ssr/label-DPnTa5YU.mjs";
import { n as AvatarFallback, t as Avatar } from "./_ssr/avatar-Nllrur_R.mjs";
import { t as Textarea } from "./_ssr/textarea-CBLiJrex.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.approvals-B4zT37JQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/routes/_app.approvals.tsx?tsr-split=component";
function isMyTurn(item, currentUser) {
	if (!item?.steps || !currentUser) return false;
	const activeStep = item.steps.find((s) => s.status === "current");
	if (!activeStep) return false;
	const roleLower = (currentUser.role || "").toLowerCase();
	const emailLower = (currentUser.email || "").toLowerCase();
	const stepRoleLower = activeStep.role.toLowerCase();
	const stepNameLower = activeStep.name.toLowerCase();
	if (emailLower.includes("ceo") || roleLower === "super_admin") return stepRoleLower.includes("ceo") || stepNameLower.includes("iqbal");
	if (roleLower === "director" || emailLower.includes("director")) return stepRoleLower.includes("director") || stepNameLower.includes("vivek");
	if (roleLower === "branch_admin") return stepRoleLower.includes("branch manager") || stepRoleLower.includes("branch admin");
	if (roleLower === "finance") return stepRoleLower.includes("finance");
	return false;
}
function hasUserAlreadyApproved(item, currentUser) {
	if (!item?.steps || !currentUser) return false;
	const roleLower = (currentUser.role || "").toLowerCase();
	const emailLower = (currentUser.email || "").toLowerCase();
	return item.steps.some((s) => {
		if (s.status !== "approved") return false;
		const sRole = s.role.toLowerCase();
		const sName = s.name.toLowerCase();
		if (roleLower === "director" || emailLower.includes("director")) return sRole.includes("director") || sName.includes("vivek");
		if (roleLower === "super_admin" || emailLower.includes("ceo") || emailLower === "admin@uniquesta.com") return sRole.includes("ceo") || sName.includes("iqbal");
		if (roleLower === "branch_admin") return sRole.includes("branch manager") || sRole.includes("branch admin");
		if (roleLower === "finance") return sRole.includes("finance");
		return false;
	});
}
function canUserSeeApplication(item, currentUser) {
	if (!item || !currentUser) return false;
	const nameLower = (currentUser.name || "").toLowerCase();
	const emailLower = (currentUser.email || "").toLowerCase();
	if (item.submitted_by.toLowerCase().includes(nameLower) || emailLower && item.submitted_by.toLowerCase() === emailLower) return true;
	if (isMyTurn(item, currentUser)) return true;
	if (hasUserAlreadyApproved(item, currentUser)) return true;
	return false;
}
function ApprovalsPage() {
	const qc = useQueryClient();
	const currentUser = getUser() ?? {
		name: "Vivek Ramanathan",
		email: "director@uniquesta.com",
		role: "director",
		branch: "Guwahati HQ"
	};
	const [selectedCode, setSelectedCode] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filterTab, setFilterTab] = (0, import_react.useState)("turn");
	const [passMessage, setPassMessage] = (0, import_react.useState)("");
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [createForm, setCreateForm] = (0, import_react.useState)({
		title: "",
		amount: "",
		category: "Travel & Meals",
		branch: currentUser.branch || "Mumbai",
		submitted_by: currentUser.name,
		period: "26 Jul – 28 Jul 2026",
		notes: "",
		attachments: 3
	});
	const { data: branchesData } = useQuery({
		queryKey: ["branches-admins"],
		queryFn: async () => {
			try {
				const res = await api.get("/branches/admins");
				return res.data ?? res ?? [];
			} catch {
				return [];
			}
		}
	});
	const { data: allEmployeesData } = useQuery({
		queryKey: ["all-employees"],
		queryFn: async () => {
			try {
				const res = await api.get("/employees?limit=200");
				return res.data ?? res ?? [];
			} catch {
				return [];
			}
		}
	});
	const { data: apiData, isLoading, refetch } = useQuery({
		queryKey: ["approvals"],
		queryFn: async () => {
			try {
				const res = await api.get("/approvals");
				return res.data ?? res ?? [];
			} catch {
				return [];
			}
		},
		refetchInterval: 4e3
	});
	const rawApprovals = apiData || [];
	const visibleApprovals = (0, import_react.useMemo)(() => {
		return rawApprovals.filter((a) => canUserSeeApplication(a, currentUser));
	}, [rawApprovals, currentUser]);
	const filteredApprovals = (0, import_react.useMemo)(() => {
		return visibleApprovals.filter((a) => {
			if (!(!search || a.title.toLowerCase().includes(search.toLowerCase()) || a.code.toLowerCase().includes(search.toLowerCase()) || a.submitted_by.toLowerCase().includes(search.toLowerCase()) || a.branch.toLowerCase().includes(search.toLowerCase()))) return false;
			if (filterTab === "turn") return isMyTurn(a, currentUser);
			if (filterTab === "passed") return hasUserAlreadyApproved(a, currentUser);
			if (filterTab === "my_submissions") return a.submitted_by.toLowerCase().includes(currentUser.name.toLowerCase()) || currentUser.email && a.submitted_by.toLowerCase() === currentUser.email.toLowerCase();
			return true;
		});
	}, [
		visibleApprovals,
		search,
		filterTab,
		currentUser
	]);
	const selectedItem = (0, import_react.useMemo)(() => {
		if (!filteredApprovals.length) return visibleApprovals.length ? visibleApprovals[0] : null;
		if (selectedCode) {
			const found = filteredApprovals.find((a) => a.code === selectedCode || String(a.id) === selectedCode);
			if (found) return found;
		}
		return filteredApprovals[0];
	}, [
		filteredApprovals,
		visibleApprovals,
		selectedCode
	]);
	const actionNeededCount = visibleApprovals.filter((a) => isMyTurn(a, currentUser)).length;
	const passedCount = visibleApprovals.filter((a) => hasUserAlreadyApproved(a, currentUser)).length;
	const mySubmissionsCount = visibleApprovals.filter((a) => a.submitted_by.toLowerCase().includes(currentUser.name.toLowerCase())).length;
	const myTurnNow = selectedItem ? isMyTurn(selectedItem, currentUser) : false;
	const alreadyApprovedByMe = selectedItem ? hasUserAlreadyApproved(selectedItem, currentUser) : false;
	const passMut = useMutation({
		mutationFn: async ({ action, message }) => {
			if (!selectedItem) throw new Error("No approval selected");
			if (!isMyTurn(selectedItem, currentUser)) throw new Error("It is not your turn to act on this application.");
			return api.post(`/approvals/${selectedItem.code}/pass`, {
				action,
				message,
				approver_name: currentUser.name,
				approver_role: currentUser.role === "super_admin" ? "CEO · Executive Sign-off" : currentUser.role === "director" ? "Director · Operations" : currentUser.role === "branch_admin" ? "Branch Manager" : "Finance · AP Lead",
				user_email: currentUser.email
			});
		},
		onSuccess: (res) => {
			qc.invalidateQueries({ queryKey: ["approvals"] });
			qc.invalidateQueries({ queryKey: ["notifications"] });
			toast.success(res?.message || "Expense application updated and forwarded!");
			setPassMessage("");
		},
		onError: (err) => {
			toast.error(err.message || "Failed to pass approval");
		}
	});
	const createMut = useMutation({
		mutationFn: async () => {
			return api.post("/approvals", {
				title: createForm.title,
				amount: createForm.amount.startsWith("₹") ? createForm.amount : `₹ ${createForm.amount}`,
				category: createForm.category,
				branch: createForm.branch,
				period: createForm.period,
				submitted_by: createForm.submitted_by || currentUser.name,
				attachments: createForm.attachments
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["approvals"] });
			qc.invalidateQueries({ queryKey: ["notifications"] });
			setCreateOpen(false);
			toast.success("Reimbursement application submitted! Forwarded to Branch Manager.");
			setCreateForm({
				title: "",
				amount: "",
				category: "Travel & Meals",
				branch: currentUser.branch || "Mumbai",
				submitted_by: currentUser.name,
				period: "26 Jul – 28 Jul 2026",
				notes: "",
				attachments: 3
			});
		},
		onError: (err) => {
			toast.error(err.message || "Could not submit application");
		}
	});
	const presetChips = (0, import_react.useMemo)(() => {
		const roleLower = (currentUser.role || "").toLowerCase();
		if (roleLower === "director") return [
			"Approved from operations, client visit verified. Forwarding to CEO Mohammad Iqbal for final sanction.",
			"Operational sanction granted. Budget is within Q3 allocation.",
			"High-ROI client meeting agenda validated. Forwarded to CEO for release."
		];
		if (roleLower === "super_admin" || currentUser.email.includes("ceo") || currentUser.email.includes("admin")) return [
			"Final CEO sign-off granted. Authorized for immediate payout release.",
			"Budget sanctioned from executive reserves. Proceed with NEFT payment.",
			"Approved against university outreach budget. Release payment."
		];
		if (roleLower === "finance") return [
			"Itemised GST bills verified. Compliant with company per-diem policy. Forwarded to Director.",
			"Tax invoices verified against travel schedule. Passed for operational review.",
			"All calculations validated. Forwarded for executive sanction."
		];
		return ["Verified against branch travel plan. Endorsed for finance verification.", "Branch budget sanctioned. Forwarded to Finance AP Lead."];
	}, [currentUser]);
	const switchRole = (name, email, role, branch) => {
		setUser({
			name,
			email,
			role,
			branch
		});
		qc.invalidateQueries({ queryKey: ["notifications"] });
		toast.info(`Switched view to ${name} (${role.replace(/_/g, " ").toUpperCase()})`);
		window.location.reload();
	};
	const steps = selectedItem?.steps || [];
	const currentStepIndex = steps.findIndex((s) => s.status === "current");
	const activeStep = steps[currentStepIndex];
	const nextStep = steps[currentStepIndex + 1];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: "Expense Approval Workflow",
				description: "Turn-based sequential approval chain. Reviewers only see applications when it arrives at their desk, and pass with their own verified remarks.",
				actions: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => refetch(),
						className: "gap-1.5 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, { className: "h-3.5 w-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 354,
							columnNumber: 15
						}, this), " Refresh"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 353,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "sm",
						onClick: () => setCreateOpen(true),
						className: "gap-1.5 bg-[#E52E20] hover:bg-[#c92418] text-white",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 357,
							columnNumber: 15
						}, this), " New Expense Claim"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 356,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 352,
					columnNumber: 219
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 352,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "border-border/60 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-3 shadow-sm rounded-xl",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 365,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-semibold text-slate-200",
								children: "Current Portal:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 366,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10",
								children: [
									currentUser.name,
									" (",
									currentUser.role?.replace(/_/g, " ").toUpperCase(),
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 367,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-slate-400 hidden sm:inline",
								children: ["· ", currentUser.email]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 370,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 364,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-slate-400 text-[11px] font-medium mr-1",
								children: "Switch Portal Persona:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 374,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => switchRole("Vivek Ramanathan", "director@uniquesta.com", "director", "Guwahati HQ"),
								className: `px-2 py-1 rounded text-[11px] font-semibold transition ${currentUser.email === "director@uniquesta.com" ? "bg-purple-600 text-white shadow-sm ring-1 ring-white/50" : "bg-white/10 text-slate-300 hover:bg-white/20"}`,
								children: "Director (Vivek)"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 375,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => switchRole("Mohammad Iqbal", "admin@uniquesta.com", "super_admin", "Guwahati HQ"),
								className: `px-2 py-1 rounded text-[11px] font-semibold transition ${currentUser.email.includes("admin") || currentUser.email.includes("ceo") ? "bg-[#E52E20] text-white shadow-sm ring-1 ring-white/50" : "bg-white/10 text-slate-300 hover:bg-white/20"}`,
								children: "CEO (Mohammad Iqbal)"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 378,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => switchRole("Rahul Deshmukh", "mumbai.admin@uniquesta.com", "branch_admin", "Mumbai · Andheri West"),
								className: `px-2 py-1 rounded text-[11px] font-semibold transition ${currentUser.email === "mumbai.admin@uniquesta.com" ? "bg-blue-600 text-white shadow-sm ring-1 ring-white/50" : "bg-white/10 text-slate-300 hover:bg-white/20"}`,
								children: "Branch Head (Rahul)"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 381,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => switchRole("Anjali Kapoor", "anjali.finance@uniquesta.com", "finance", "Mumbai · Andheri West"),
								className: `px-2 py-1 rounded text-[11px] font-semibold transition ${currentUser.email === "anjali.finance@uniquesta.com" ? "bg-emerald-600 text-white shadow-sm ring-1 ring-white/50" : "bg-white/10 text-slate-300 hover:bg-white/20"}`,
								children: "Finance (Anjali)"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 384,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => switchRole("Meera Shah", "meera.counselor@uniquesta.com", "counselor", "Mumbai · Andheri West"),
								className: `px-2 py-1 rounded text-[11px] font-semibold transition ${currentUser.email === "meera.counselor@uniquesta.com" ? "bg-cyan-600 text-white shadow-sm ring-1 ring-white/50" : "bg-white/10 text-slate-300 hover:bg-white/20"}`,
								children: "Staff (Meera)"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 387,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 373,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 363,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 362,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-xl border border-primary/20 bg-primary/[0.04] p-3 text-xs flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-4 w-4 text-primary shrink-0" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 397,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Turn-Based Privacy Active:" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 399,
							columnNumber: 13
						}, this), " Applications only appear in this portal when it arrives at your desk. Applications still pending at previous levels are hidden to prevent inbox clutter."]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 398,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 396,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-[11px] font-semibold bg-white border px-2 py-0.5 rounded shadow-sm text-foreground",
					children: [
						actionNeededCount,
						" Action Required · ",
						passedCount,
						" History"
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 402,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 395,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-12 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "lg:col-span-4 flex flex-col gap-3",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "shadow-sm border-border/80 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "p-3 border-b bg-muted/40 space-y-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 415,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									placeholder: "Search in visible applications…",
									value: search,
									onChange: (e) => setSearch(e.target.value),
									className: "h-8 pl-8 text-xs bg-background"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 416,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 414,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-1 overflow-x-auto text-[11px] no-scrollbar",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => setFilterTab("turn"),
										className: `flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition whitespace-nowrap ${filterTab === "turn" ? "bg-[#E52E20] text-white shadow-sm" : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BellRing, { className: "h-3 w-3" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 422,
												columnNumber: 19
											}, this),
											" Awaiting My Turn (",
											actionNeededCount,
											")"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 421,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => setFilterTab("passed"),
										className: `px-2.5 py-1 rounded-md font-medium transition whitespace-nowrap ${filterTab === "passed" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
										children: [
											"Passed By Me (",
											passedCount,
											")"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 424,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => setFilterTab("my_submissions"),
										className: `px-2.5 py-1 rounded-md font-medium transition whitespace-nowrap ${filterTab === "my_submissions" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
										children: [
											"My Claims (",
											mySubmissionsCount,
											")"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 427,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => setFilterTab("all"),
										className: `px-2.5 py-1 rounded-md font-medium transition whitespace-nowrap ${filterTab === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
										children: [
											"All Visible (",
											visibleApprovals.length,
											")"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 430,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 420,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 413,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "divide-y divide-border/60 max-h-[720px] overflow-y-auto",
							children: filteredApprovals.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "py-12 px-4 text-center text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Receipt, { className: "mx-auto mb-2 h-8 w-8 opacity-25" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 439,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "font-semibold text-foreground",
										children: "No applications in this view"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 440,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-1 text-[11px] leading-relaxed",
										children: filterTab === "turn" ? "All clear! There are currently no applications waiting for your action. You will be alerted the moment an expense is forwarded to your portal." : "No matching applications found."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 441,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 438,
								columnNumber: 49
							}, this) : filteredApprovals.map((item) => {
								const isSelected = selectedItem?.code === item.code;
								const needsAction = isMyTurn(item, currentUser);
								const lastStepWithComment = [...item.steps || []].reverse().find((s) => s.comment);
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									onClick: () => setSelectedCode(item.code),
									className: `p-3.5 transition cursor-pointer text-left relative ${isSelected ? "bg-primary/[0.08] border-l-4 border-l-primary" : "hover:bg-muted/40 border-l-4 border-l-transparent"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-start justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-center gap-2 min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Avatar, {
													className: "h-7 w-7 text-[11px] font-bold bg-primary/10 text-primary shrink-0",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AvatarFallback, { children: item.submitted_by.split(" ").map((n) => n[0]).join("").slice(0, 2) }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 452,
														columnNumber: 29
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 451,
													columnNumber: 27
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
														className: "text-xs font-bold text-foreground truncate",
														children: item.submitted_by
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 457,
														columnNumber: 29
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
														className: "text-[10.5px] text-muted-foreground truncate",
														children: item.branch
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 458,
														columnNumber: 29
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 456,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 450,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "text-right shrink-0",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-xs font-black text-foreground",
													children: item.amount
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 463,
													columnNumber: 27
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "text-[10px] text-muted-foreground font-mono",
													children: item.code
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 464,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 462,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 449,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "mt-2",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: `text-xs font-semibold line-clamp-1 ${isSelected ? "text-primary" : "text-foreground"}`,
												children: item.title
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 469,
												columnNumber: 25
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 468,
											columnNumber: 23
										}, this),
										lastStepWithComment?.comment && /* @__PURE__ */ (void 0)("p", {
											className: "mt-1 text-[11px] text-muted-foreground line-clamp-1 italic bg-muted/30 px-2 py-0.5 rounded border border-border/40",
											children: [
												"💬 \"",
												lastStepWithComment.comment,
												"\""
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 475,
											columnNumber: 56
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "mt-2.5 flex items-center justify-between gap-1 flex-wrap",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
												variant: "outline",
												className: `text-[9.5px] font-semibold py-0.5 ${item.status.includes("CEO") ? "bg-purple-50 text-purple-700 border-purple-200" : item.status.includes("Director") ? "bg-blue-50 text-blue-700 border-blue-200" : item.status.includes("Approved") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`,
												children: item.status
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 480,
												columnNumber: 25
											}, this), needsAction ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "inline-flex items-center gap-1 rounded-full bg-red-100 text-[#E52E20] font-bold px-2 py-0.5 text-[9.5px] animate-pulse border border-red-200",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-1.5 w-1.5 rounded-full bg-[#E52E20]" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 485,
													columnNumber: 29
												}, this), " Your Turn"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 484,
												columnNumber: 40
											}, this) : alreadyApprovedByMe ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[10px] text-emerald-700 font-semibold flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-3 w-3" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 487,
													columnNumber: 29
												}, this), " Passed"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 486,
												columnNumber: 59
											}, this) : null]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 479,
											columnNumber: 23
										}, this)
									]
								}, item.id, true, {
									fileName: _jsxFileName,
									lineNumber: 448,
									columnNumber: 22
								}, this);
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 437,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 411,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 410,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "lg:col-span-8 flex flex-col gap-4",
					children: selectedItem ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "border-border/80 shadow-sm overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "p-5 border-b bg-gradient-to-r from-muted/60 via-muted/30 to-background",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-wrap items-start justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "min-w-0 space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
														className: "bg-primary/10 text-primary border border-primary/20 font-bold hover:bg-primary/10",
														children: selectedItem.category
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 505,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "font-mono text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded",
														children: selectedItem.code
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 508,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
														variant: "outline",
														className: "text-[11px] font-semibold border-amber-300 bg-amber-50 text-amber-800",
														children: selectedItem.status
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 511,
														columnNumber: 25
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 504,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
												className: "text-xl font-black text-foreground pt-1",
												children: selectedItem.title
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 516,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "text-xs text-muted-foreground",
												children: [
													"Submitted by ",
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "font-semibold text-foreground",
														children: selectedItem.submitted_by
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 519,
														columnNumber: 38
													}, this),
													" (",
													selectedItem.branch,
													") · ",
													selectedItem.submitted_date
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 518,
												columnNumber: 23
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 503,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-right bg-white p-3 rounded-xl border border-border/80 shadow-sm min-w-[150px]",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[10.5px] uppercase font-bold text-muted-foreground tracking-wider block",
												children: "Claim Amount"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 524,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-2xl font-black text-foreground tracking-tight flex items-center justify-end gap-0.5 text-emerald-600",
												children: selectedItem.amount
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 527,
												columnNumber: 23
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[10px] text-muted-foreground block mt-0.5 font-medium",
												children: [selectedItem.attachments || 4, " verified invoices attached"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 530,
												columnNumber: 23
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 523,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 502,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 501,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-muted/20 text-xs border-b",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[10px] uppercase font-bold text-muted-foreground",
										children: "Period / Dates"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 540,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "font-semibold text-foreground mt-0.5",
										children: selectedItem.period || "18 Jul – 21 Jul 2026"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 541,
										columnNumber: 21
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 539,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[10px] uppercase font-bold text-muted-foreground",
										children: "Cost Centre / Branch"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 544,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "font-semibold text-foreground mt-0.5",
										children: selectedItem.branch
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 545,
										columnNumber: 21
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 543,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[10px] uppercase font-bold text-muted-foreground",
										children: "Current Authority"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 548,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "font-semibold text-primary mt-0.5 flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Clock, { className: "h-3 w-3" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 550,
												columnNumber: 23
											}, this),
											" ",
											activeStep ? `${activeStep.name} (${activeStep.role})` : "Final Payout"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 549,
										columnNumber: 21
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 547,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[10px] uppercase font-bold text-muted-foreground",
										children: "Audit Compliance"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 554,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "font-semibold text-emerald-600 mt-0.5 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 556,
											columnNumber: 23
										}, this), " ISO-9001 Compliant"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 555,
										columnNumber: 21
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 553,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 538,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "p-4 bg-background border-b",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CheckCheck, { className: "h-4 w-4 text-primary" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 565,
												columnNumber: 23
											}, this),
											" Staged Approval Sequence (Stage ",
											selectedItem.current_stage || 1,
											" of 5)"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 564,
										columnNumber: 21
									}, this), myTurnNow && /* @__PURE__ */ (void 0)("span", {
										className: "text-[11px] font-bold text-[#E52E20] bg-red-50 border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1",
										children: [/* @__PURE__ */ (void 0)(CircleAlert, { className: "h-3 w-3" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 568,
											columnNumber: 25
										}, this), " It is your turn to review & pass"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 567,
										columnNumber: 35
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 563,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-6 gap-2",
									children: steps.map((st, idx) => {
										const isDone = st.status === "approved" || st.status === "released";
										const isActive = st.status === "current";
										return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: `flex flex-col items-center text-center p-2 rounded-lg border transition ${isActive ? "bg-primary/10 border-primary ring-2 ring-primary/20" : isDone ? "bg-emerald-50/70 border-emerald-200 text-emerald-800" : "bg-muted/40 border-border/50 text-muted-foreground"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: `h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 shadow-sm ${isActive ? "bg-primary text-primary-foreground animate-pulse" : isDone ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`,
													children: isDone ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-4 w-4" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 579,
														columnNumber: 39
													}, this) : idx + 1
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 578,
													columnNumber: 27
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-[11px] font-bold truncate max-w-full leading-tight",
													children: idx === 0 ? "Submitter" : idx === 1 ? "Branch Head" : idx === 2 ? "Finance" : idx === 3 ? "Director" : idx === 4 ? "CEO" : "Payout"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 581,
													columnNumber: 27
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-[9.5px] truncate max-w-full text-muted-foreground mt-0.5",
													children: st.name
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 584,
													columnNumber: 27
												}, this)
											]
										}, st.name + idx, true, {
											fileName: _jsxFileName,
											lineNumber: 577,
											columnNumber: 26
										}, this);
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 573,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 562,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "p-5 space-y-4 bg-muted/10",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between border-b pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
											className: "text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageSquare, { className: "h-4 w-4 text-primary" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 596,
												columnNumber: 23
											}, this), " Approval Discussion & Remarks Thread"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 595,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[11px] text-muted-foreground",
											children: "Sequential Reviewer Messages"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 598,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 594,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-3",
										children: steps.filter((st) => st.status === "approved" || st.status === "current" && st.comment || st.status === "rejected").map((st, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "rounded-xl border border-border/80 bg-white p-4 shadow-sm space-y-2.5 transition hover:border-primary/40",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-start justify-between gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Avatar, {
														className: "h-9 w-9 text-xs font-bold bg-primary/10 text-primary border",
														children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AvatarFallback, { children: st.initials || st.name.slice(0, 2).toUpperCase() }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 607,
															columnNumber: 33
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 606,
														columnNumber: 31
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
															className: "text-xs font-bold text-foreground",
															children: st.name
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 611,
															columnNumber: 35
														}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
															variant: "outline",
															className: "text-[10px] py-0 px-1.5 bg-muted font-normal text-muted-foreground",
															children: st.role
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 612,
															columnNumber: 35
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 610,
														columnNumber: 33
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
														className: "text-[10.5px] text-muted-foreground mt-0.5 flex items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Clock, { className: "h-3 w-3" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 617,
																columnNumber: 35
															}, this),
															" ",
															st.time
														]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 616,
														columnNumber: 33
													}, this)] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 609,
														columnNumber: 31
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 605,
													columnNumber: 29
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
													className: `text-[10px] font-semibold ${st.status === "approved" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-300" : st.status === "rejected" ? "bg-red-100 text-red-800 hover:bg-red-100" : "bg-blue-100 text-blue-800"}`,
													children: idx === 0 ? "Application Filed" : "Passed & Endorsed"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 622,
													columnNumber: 29
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 604,
												columnNumber: 27
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "pl-11",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-800 border border-slate-200/80 font-normal",
													children: st.comment || "Approved without additional comments."
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 629,
													columnNumber: 29
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 628,
												columnNumber: 27
											}, this)]
										}, st.name + idx, true, {
											fileName: _jsxFileName,
											lineNumber: 602,
											columnNumber: 153
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 601,
										columnNumber: 19
									}, this),
									myTurnNow ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
										className: "border-2 border-primary/30 bg-white rounded-xl shadow-md overflow-hidden mt-6",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-4 py-3 border-b flex flex-wrap items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Forward, { className: "h-4 w-4 text-primary" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 640,
													columnNumber: 27
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-xs font-bold text-foreground",
													children: "Pass & Forward to Next Approval Authority"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 641,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 639,
												columnNumber: 25
											}, this), nextStep && /* @__PURE__ */ (void 0)("span", {
												className: "text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20",
												children: [
													"Next in line: ",
													nextStep.name,
													" (",
													nextStep.role,
													")"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 645,
												columnNumber: 38
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 638,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
											className: "p-4 space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "p-2.5 rounded-lg text-xs flex items-center justify-between gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "flex items-center gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-4 w-4 text-emerald-600 shrink-0" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 653,
															columnNumber: 29
														}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
															"Active Turn: ",
															/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: currentUser.name }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 655,
																columnNumber: 44
															}, this),
															" (",
															currentUser.role?.replace(/_/g, " ").toUpperCase(),
															"). Add your message and pass."
														] }, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 654,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 652,
														columnNumber: 27
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "text-[10.5px] font-mono uppercase bg-white px-2 py-0.5 rounded border",
														children: ["Stage ", selectedItem.current_stage]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 658,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 651,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
														className: "text-[11px] font-semibold text-muted-foreground flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "h-3 w-3 text-amber-500" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 666,
															columnNumber: 29
														}, this), " Quick Message Presets (1-Click Fill):"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 665,
														columnNumber: 27
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "flex flex-wrap gap-1.5",
														children: presetChips.map((chip, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
															type: "button",
															onClick: () => setPassMessage(chip),
															className: "text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-1 rounded-md border border-slate-200 transition text-left",
															children: [
																"+ ",
																chip.slice(0, 42),
																"…"
															]
														}, idx, true, {
															fileName: _jsxFileName,
															lineNumber: 669,
															columnNumber: 61
														}, this))
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 668,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 664,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
														htmlFor: "passMsg",
														className: "text-xs font-semibold text-foreground",
														children: "Your Approval Remarks / Message to Next Reviewer:"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 677,
														columnNumber: 27
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
														id: "passMsg",
														rows: 3,
														value: passMessage,
														onChange: (e) => setPassMessage(e.target.value),
														placeholder: "Write message to pass with this application...",
														className: "text-xs leading-relaxed resize-none"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 680,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 676,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "flex flex-wrap items-center justify-between gap-2 pt-1 border-t",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
															type: "button",
															variant: "outline",
															size: "sm",
															onClick: () => passMut.mutate({
																action: "send_back",
																message: passMessage
															}),
															disabled: passMut.isPending,
															className: "gap-1.5 text-xs text-amber-700 border-amber-300 hover:bg-amber-50",
															children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CornerUpLeft, { className: "h-3.5 w-3.5" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 690,
																columnNumber: 31
															}, this), " Send Back with Remarks"]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 686,
															columnNumber: 29
														}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
															type: "button",
															variant: "outline",
															size: "sm",
															onClick: () => passMut.mutate({
																action: "reject",
																message: passMessage
															}),
															disabled: passMut.isPending,
															className: "gap-1.5 text-xs text-red-700 border-red-300 hover:bg-red-50",
															children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-3.5 w-3.5" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 696,
																columnNumber: 31
															}, this), " Reject Application"]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 692,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 685,
														columnNumber: 27
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
														type: "button",
														size: "sm",
														onClick: () => passMut.mutate({
															action: "approve",
															message: passMessage
														}),
														disabled: passMut.isPending,
														className: "gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm px-4",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 704,
															columnNumber: 29
														}, this), passMut.isPending ? "Passing..." : selectedItem.current_stage >= 4 ? "Authorize Final CEO Sign-off & Payout ➔" : `Pass & Forward to ${nextStep ? nextStep.name : "Next Stage"} ➔`]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 700,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 684,
													columnNumber: 25
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 650,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 637,
										columnNumber: 32
									}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
										className: "border border-slate-200 bg-slate-50/80 rounded-xl p-5 text-center mt-6",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex flex-col items-center justify-center space-y-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shadow-sm",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, { className: "h-5 w-5" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 713,
														columnNumber: 27
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 712,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
													className: "text-xs font-bold text-foreground uppercase tracking-wide",
													children: "Action Locked · Not Your Turn"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 715,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "text-xs text-muted-foreground max-w-md",
													children: alreadyApprovedByMe ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "You have already reviewed and forwarded this application from your portal. You can view the message thread above as subsequent authorities complete their review." }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 719,
														columnNumber: 50
													}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
														"This application is currently awaiting review by",
														" ",
														/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
															className: "text-foreground",
															children: [
																activeStep?.name,
																" (",
																activeStep?.role,
																")"
															]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 723,
															columnNumber: 31
														}, this),
														". Each authority can only respond and enter comments when the application reaches their portal."
													] }, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 721,
														columnNumber: 39
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 718,
													columnNumber: 25
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 711,
											columnNumber: 23
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 710,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 593,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 500,
						columnNumber: 15
					}, this) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 498,
						columnNumber: 27
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "p-12 text-center text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Receipt, { className: "mx-auto mb-3 h-10 w-10 opacity-30" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 731,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-sm font-semibold",
								children: "No expense applications currently awaiting your action."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 732,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Applications will automatically land in your portal when passed to your desk by the preceding reviewer."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 733,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 730,
						columnNumber: 19
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 497,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 408,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
							className: "text-base font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Receipt, { className: "h-4 w-4 text-[#E52E20]" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 745,
								columnNumber: 15
							}, this), " New Reimbursement Claim"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 744,
							columnNumber: 13
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 743,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-3.5 py-1 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs font-semibold",
										children: "Purpose / Title *"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 751,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "e.g. Pune University Fair — Travel & Accommodation",
										value: createForm.title,
										onChange: (e) => setCreateForm({
											...createForm,
											title: e.target.value
										}),
										className: "text-xs"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 752,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 750,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs font-semibold",
											children: "Total Amount (₹) *"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 760,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											placeholder: "e.g. 34,500",
											value: createForm.amount,
											onChange: (e) => setCreateForm({
												...createForm,
												amount: e.target.value
											}),
											className: "text-xs"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 761,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 759,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs font-semibold",
											children: "Category"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 768,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
											value: createForm.category,
											onChange: (e) => setCreateForm({
												...createForm,
												category: e.target.value
											}),
											className: "w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
													value: "Travel & Meals",
													children: "Travel & Meals"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 773,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
													value: "Marketing & Events",
													children: "Marketing & Events"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 774,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
													value: "Client Fair Advance",
													children: "Client Fair Advance"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 775,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
													value: "Office Supplies",
													children: "Office Supplies"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 776,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
													value: "Student Pickup Fleet",
													children: "Student Pickup Fleet"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 777,
													columnNumber: 19
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 769,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 767,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 758,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs font-semibold",
											children: "Branch *"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 784,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
											value: createForm.branch,
											onChange: (e) => {
												const newBranch = e.target.value;
												const branchStaff = (allEmployeesData || []).filter((emp) => emp.branch === newBranch || emp.branch?.includes(newBranch));
												setCreateForm({
													...createForm,
													branch: newBranch,
													submitted_by: branchStaff.length ? branchStaff[0].name : currentUser.name
												});
											},
											className: "w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm font-medium",
											children: (branchesData && branchesData.length > 0 ? branchesData : [
												{
													branch: "Mumbai",
													head: "Rahul Deshmukh"
												},
												{
													branch: "Delhi NCR",
													head: "Karan Mehta"
												},
												{
													branch: "Bengaluru",
													head: "Divya Rao"
												},
												{
													branch: "Hyderabad",
													head: "Rahul Reddy"
												},
												{
													branch: "Guwahati HQ",
													head: "Mohammad Iqbal"
												}
											]).map((b) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
												value: b.branch,
												children: [
													b.branch,
													" (Head: ",
													b.head,
													")"
												]
											}, b.branch, true, {
												fileName: _jsxFileName,
												lineNumber: 809,
												columnNumber: 37
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 785,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 783,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs font-semibold",
											children: "Claim Submitter (Staff) *"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 816,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
											value: createForm.submitted_by,
											onChange: (e) => setCreateForm({
												...createForm,
												submitted_by: e.target.value
											}),
											className: "w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
												value: currentUser.name,
												children: [
													"Logged-in: ",
													currentUser.name,
													" (",
													currentUser.role?.replace(/_/g, " "),
													")"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 821,
												columnNumber: 19
											}, this), (allEmployeesData || []).filter((emp) => emp.branch === createForm.branch || emp.branch?.includes(createForm.branch)).map((emp) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
												value: emp.name,
												children: [
													emp.name,
													" · ",
													emp.role
												]
											}, emp.id, true, {
												fileName: _jsxFileName,
												lineNumber: 822,
												columnNumber: 161
											}, this))]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 817,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 815,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 782,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs font-semibold",
											children: "Period / Date"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 831,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											value: createForm.period,
											onChange: (e) => setCreateForm({
												...createForm,
												period: e.target.value
											}),
											className: "text-xs"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 832,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 830,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs font-semibold",
											children: "Assigned Branch Head"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 839,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "h-9 px-3 py-2 bg-slate-100 rounded-md border text-slate-700 text-xs font-semibold flex items-center truncate",
											children: ["👑 ", (branchesData || []).find((b) => b.branch === createForm.branch)?.head || (createForm.branch.includes("Delhi") ? "Karan Mehta" : createForm.branch.includes("Bengaluru") ? "Divya Rao" : createForm.branch.includes("Hyderabad") ? "Rahul Reddy" : "Rahul Deshmukh")]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 840,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 838,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 829,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs font-semibold",
										children: "Submission Notes & Receipts Summary"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 847,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
										rows: 2,
										placeholder: "Itemised taxi bills, hotel receipt #402, client meet agenda attached.",
										value: createForm.notes,
										onChange: (e) => setCreateForm({
											...createForm,
											notes: e.target.value
										}),
										className: "text-xs resize-none"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 848,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 846,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "rounded-lg bg-blue-50 p-2.5 text-[11px] text-blue-700 border border-blue-200",
									children: [
										"ℹ️ On submission, this claim will automatically route to ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: (branchesData || []).find((b) => b.branch === createForm.branch)?.head || "Branch Head" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 855,
											columnNumber: 72
										}, this),
										" for initial branch sanction, then ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Anjali Kapoor (Finance)" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 855,
											columnNumber: 218
										}, this),
										", ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Vivek Ramanathan (Director)" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 855,
											columnNumber: 260
										}, this),
										", and ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "Mohammad Iqbal (CEO)" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 855,
											columnNumber: 310
										}, this),
										"."
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 854,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 749,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setCreateOpen(false),
								children: "Cancel"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 860,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								disabled: !createForm.title || !createForm.amount || createMut.isPending,
								onClick: () => createMut.mutate(),
								className: "bg-[#E52E20] hover:bg-[#c92418] text-white font-bold",
								children: createMut.isPending ? "Submitting..." : "Submit Claim ➔"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 863,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 859,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 742,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 741,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 350,
		columnNumber: 10
	}, this);
}
//#endregion
export { ApprovalsPage as component };
