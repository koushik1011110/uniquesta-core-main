import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = (typeof process !== "undefined" && (process as any).env?.JWT_SECRET) || "uniquesta_dev_secret_change_in_prod_32chars";
const JWT_EXPIRES = "7d";

export interface JwtPayload {
  id: number;
  email?: string;
  role: string;
  name: string;
  branch?: string;
  reports_to?: string;
  phone?: string;
  vehicle_number?: string;
  designation?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload as any, JWT_SECRET as any, { expiresIn: JWT_EXPIRES } as any);
}
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  const cookie = req.headers.get("cookie") ?? "";
  const m = cookie.match(/(?:^|;\s*)token=([^;]+)/);
  if (m) return decodeURIComponent(m[1]);
  return null;
}
export function authMiddleware(req: Request): JwtPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}
export function requireAuth(req: Request): JwtPayload {
  const payload = authMiddleware(req);
  if (!payload) throw jsonError(401, "Unauthorized: missing or invalid token");
  return payload;
}
export function jsonError(status: number, message: string, details?: any) {
  const err: any = new Error(message);
  err.status = status;
  err.details = details;
  return err;
}
