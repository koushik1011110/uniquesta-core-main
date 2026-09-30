// frontend auth helper — localStorage token + user
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("uniquesta_token");
}
export function setToken(token: string) {
  localStorage.setItem("uniquesta_token", token);
}
export function clearToken() {
  localStorage.removeItem("uniquesta_token");
  localStorage.removeItem("uniquesta_user");
}
export function getUser(): any | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("uniquesta_user");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
export function setUser(user: any) {
  localStorage.setItem("uniquesta_user", JSON.stringify(user));
}
export function isLoggedIn(): boolean {
  return !!getToken();
}

export function isStaffRole(user?: any | null): boolean {
  const u = user !== undefined ? user : getUser();
  if (!u) return false;
  const role = (u.role || "").toLowerCase();
  const email = (u.email || "").toLowerCase();

  const isManagementOrAdmin =
    role === "super_admin" ||
    role === "branch_admin" ||
    role === "admin" ||
    role === "director" ||
    role === "executive" ||
    role.includes("admin") ||
    role.includes("director") ||
    role.includes("ceo") ||
    email === "admin@uniquesta.com" ||
    email === "director@uniquesta.com";

  return !isManagementOrAdmin;
}
