//#region node_modules/.nitro/vite/services/ssr/assets/api-06dRWXHB.js
var BASE = "/api";
function getToken() {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("uniquesta_token");
}
async function request(path, opts = {}) {
	const headers = {
		"Content-Type": "application/json",
		...opts.headers || {}
	};
	const token = getToken();
	if (token) headers["Authorization"] = `Bearer ${token}`;
	const res = await fetch(`${BASE}${path}`, {
		...opts,
		headers
	});
	const text = await res.text();
	let json = {};
	try {
		json = text ? JSON.parse(text) : {};
	} catch {
		json = {
			success: false,
			error: text
		};
	}
	if (!res.ok) throw new Error(json.error || json.message || `Request failed ${res.status}`);
	return json;
}
var api = {
	login: (email, password) => request("/auth/login", {
		method: "POST",
		body: JSON.stringify({
			email,
			password
		})
	}),
	register: (data) => request("/auth/register", {
		method: "POST",
		body: JSON.stringify(data)
	}),
	me: () => request("/auth/me"),
	health: () => request("/health"),
	get: (path, params) => {
		return request(`${path}${params ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== void 0 && v !== "").map(([k, v]) => [k, String(v)])).toString() : ""}`);
	},
	post: (path, body) => request(path, {
		method: "POST",
		body: JSON.stringify(body)
	}),
	put: (path, body) => request(path, {
		method: "PUT",
		body: JSON.stringify(body)
	}),
	del: (path) => request(path, { method: "DELETE" }),
	students: { list: (params) => request("/students", { method: "GET" }).then((r) => r) }
};
//#endregion
export { api as t };
