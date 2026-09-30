// API-first typed client — used by all menu pages; backend-agnostic for mobile reuse
const BASE = "/api";

type Pagination = { page:number; limit:number; total:number; totalPages:number };
type ApiResp<T> = { success:boolean; data:T; pagination?:Pagination; error?:string; details?:any };

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("uniquesta_token");
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<ApiResp<T>> {
  const headers: Record<string,string> = { "Content-Type":"application/json", ...(opts.headers as any||{}) };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const text = await res.text();
  let json: any = {};
  try { json = text ? JSON.parse(text) : {}; } catch { json = { success:false, error:text }; }
  if (!res.ok) {
    throw new Error(json.error || json.message || `Request failed ${res.status}`);
  }
  return json as ApiResp<T>;
}

export const api = {
  // auth
  login: (email:string,password:string)=> request<{user:any,token:string}>("/auth/login",{method:"POST",body:JSON.stringify({email,password})}),
  register: (data:any)=> request<any>("/auth/register",{method:"POST",body:JSON.stringify(data)}),
  me: ()=> request<any>("/auth/me"),
  health: ()=> request<any>("/health"),

  // generic helpers
  get: <T>(path:string, params?:Record<string,any>)=>{
    const qs = params ? "?" + new URLSearchParams(Object.entries(params).filter(([,v])=>v!==undefined && v!=="").map(([k,v])=> [k,String(v)])).toString() : "";
    return request<T>(`${path}${qs}`);
  },
  post: <T>(path:string, body:any)=> request<T>(path,{method:"POST",body:JSON.stringify(body)}),
  put: <T>(path:string, body:any)=> request<T>(path,{method:"PUT",body:JSON.stringify(body)}),
  del: <T>(path:string)=> request<T>(path,{method:"DELETE"}),

  // domain shortcuts
  students: {
    list: (params?:any)=> request<any[]>("/students",{method:"GET"}).then(r=>r as any) as Promise<ApiResp<any[]> & {pagination:Pagination}>,
    // but we will call via get
  }
};

// typed list helpers to keep pagination shape
export async function listStudents(params?:Record<string,any>){
  const qs = params? "?" + new URLSearchParams(Object.entries(params).filter(([,v])=>v!==""&&v!==undefined).map(([k,v])=>[k,String(v)])).toString() : "";
  return request<any[]>(`/students${qs}`);
}
export async function listLeads(params?:any){ const qs=params?"?"+new URLSearchParams(Object.entries(params).filter(([,v])=>v!==""&&v!==undefined).map(([k,v])=>[k,String(v)])).toString():""; return request<any[]>(`/leads${qs}`); }
export async function listApplications(params?:any){ const qs=params?"?"+new URLSearchParams(Object.entries(params).filter(([,v])=>v!==""&&v!==undefined).map(([k,v])=>[k,String(v)])).toString():""; return request<any[]>(`/applications${qs}`); }
export async function listUniversities(params?:any){ const qs=params?"?"+new URLSearchParams(Object.entries(params).filter(([,v])=>v!==""&&v!==undefined).map(([k,v])=>[k,String(v)])).toString():""; return request<any[]>(`/universities${qs}`); }
export async function listColleges(params?:any){ const qs=params?"?"+new URLSearchParams(Object.entries(params).filter(([,v])=>v!==""&&v!==undefined).map(([k,v])=>[k,String(v)])).toString():""; return request<any[]>(`/colleges${qs}`); }
export async function listCourses(params?:any){ const qs=params?"?"+new URLSearchParams(Object.entries(params).filter(([,v])=>v!==""&&v!==undefined).map(([k,v])=>[k,String(v)])).toString():""; return request<any[]>(`/courses${qs}`); }
export async function listIndiaStudents(params?:any){ const qs=params?"?"+new URLSearchParams(Object.entries(params).filter(([,v])=>v!==""&&v!==undefined).map(([k,v])=>[k,String(v)])).toString():""; return request<any[]>(`/india-students${qs}`); }
export async function listInvoices(params?:any){ const qs=params?"?"+new URLSearchParams(Object.entries(params).filter(([,v])=>v!==""&&v!==undefined).map(([k,v])=>[k,String(v)])).toString():""; return request<any[]>(`/invoices${qs}`); }
export async function listEmployees(params?:any){ const qs=params?"?"+new URLSearchParams(Object.entries(params).filter(([,v])=>v!==""&&v!==undefined).map(([k,v])=>[k,String(v)])).toString():""; return request<any[]>(`/employees${qs}`); }
export async function listApprovals(params?:any){ const qs=params?"?"+new URLSearchParams(Object.entries(params).filter(([,v])=>v!==""&&v!==undefined).map(([k,v])=>[k,String(v)])).toString():""; return request<any[]>(`/approvals${qs}`); }
export async function listReferrals(params?:any){ const qs=params?"?"+new URLSearchParams(Object.entries(params).filter(([,v])=>v!==""&&v!==undefined).map(([k,v])=>[k,String(v)])).toString():""; return request<any[]>(`/referrals${qs}`); }

// small helper to normalize DB snake_case -> camel for frontend mapping if needed
export function normalizeRow(row:any){
  if(!row||typeof row!=="object") return row;
  const out:any={...row};
  // colleges: courses_offered -> coursesOffered
  if(out.courses_offered && !out.coursesOffered) out.coursesOffered = typeof out.courses_offered==="string"? JSON.parse(out.courses_offered): out.courses_offered;
  // map snake to camel for india_students
  const map:Record<string,string>={ affiliated_university:"affiliatedUniversity", annual_intake:"annualIntake", tuition_fee:"tuitionFee", hostel_fee:"hostelFee", contact_person:"contactPerson", contact_number:"contactNumber", courses_offered:"coursesOffered", registration_fee:"registrationFee", seats_available:"seatsAvailable", total_seats:"totalSeats", min_percentage:"minPercentage", father_name:"fatherName", father_phone:"fatherPhone", preferred_state:"preferredState", preferred_college:"preferredCollege", preferred_course:"preferredCourse", stage_index:"stageIndex", registration_fee_paid:"registrationFeePaid", total_fee:"totalFee", paid_fee:"paidFee", applied_date:"appliedDate", course_fee:"courseFee", commission_est:"commissionEst", referred_date:"referredDate", inv_id:"invId", req_id:"reqId", paid_date:"paidDate", submitted_by:"submittedBy", submitted_date:"submittedDate", amount_value:"amountValue", current_stage:"currentStage" };
  for(const [k,v] of Object.entries(map)){ if(out[k]!==undefined && out[v]===undefined){ out[v]=out[k]; } }
  return out;
}
