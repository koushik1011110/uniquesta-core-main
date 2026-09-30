import * as db from "./db";
import * as auth from "./auth";
import * as v from "./validation";

function json(data: any, status = 200, extraHeaders: Record<string,string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "access-control-allow-origin":"*", "access-control-allow-headers":"*", "access-control-allow-methods":"*", ...extraHeaders },
  });
}
function errJson(status: number, message: string, details?: any) {
  return json({ success:false, error:message, details }, status);
}
async function parseBody(req: Request) {
  try { return await req.json(); } catch { return {}; }
}
function qp(url: URL, key: string, fallback: string="") { return url.searchParams.get(key) ?? fallback; }
function pagination(url: URL) {
  const page = Math.max(1, parseInt(qp(url,"page","1"),10)||1);
  const limit = Math.min(100, Math.max(1, parseInt(qp(url,"limit","20"),10)||20));
  const offset = (page-1)*limit;
  return { page, limit, offset };
}
function genCode(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-6)}${Math.floor(Math.random()*90+10)}`;
}

// ensure DB initialized once
let dbReady = false;
async function ensureDb() {
  if (!dbReady) { await db.initDb(); dbReady = true; }
}

export async function handleApi(req: Request): Promise<Response|null> {
  const url = new URL(req.url);
  if (!url.pathname.startsWith("/api")) return null;
  await ensureDb();
  const method = req.method.toUpperCase();
  const path = url.pathname;

  // CORS preflight
  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: {
      "access-control-allow-origin":"*",
      "access-control-allow-headers":"Content-Type, Authorization",
      "access-control-allow-methods":"GET,POST,PUT,PATCH,DELETE,OPTIONS",
    }});
  }

  try {
    // health
    if (path === "/api/health" && method === "GET") {
      return json({ success:true, status:"ok", db: db.isMemoryMode() ? "memory" : "mysql", ts: new Date().toISOString() });
    }

    // ---- AUTH ----
    if (path === "/api/auth/register" && method === "POST") {
      const body = await parseBody(req);
      const data = v.parseOrThrow(v.registerSchema, body);
      const isMem = db.isMemoryMode();
      let existing: any = null;
      if (isMem) existing = db.getMemStore()["users"]?.get(data.email) ?? null;
      else existing = await db.queryOne("SELECT id FROM users WHERE email=?", [data.email]);
      if (existing) return errJson(409, "Email already registered");
      const hash = await auth.hashPassword(data.password);
      let user: any;
      if (isMem) {
        user = db.memCreate("users", { name:data.name, email:data.email, password_hash:hash, role:data.role||"admin", branch:data.branch||"Guwahati HQ" });
      } else {
        const res = await db.execute("INSERT INTO users (name,email,password_hash,role,branch) VALUES (?,?,?,?,?)", [data.name, data.email, hash, data.role||"admin", data.branch||"Guwahati HQ"]);
        const id = (res as any).insertId;
        user = await db.queryOne("SELECT id,name,email,role,branch,created_at FROM users WHERE id=?", [id]);
      }
      const token = auth.signToken({ id:user.id, email:user.email, role:user.role, name:user.name });
      return json({ success:true, data:{ user:{ id:user.id, name:user.name, email:user.email, role:user.role, branch:user.branch }, token } }, 201);
    }
    if (path === "/api/auth/login" && method === "POST") {
      const body = await parseBody(req);
      const data = v.parseOrThrow(v.loginSchema, body);
      const isMem = db.isMemoryMode();
      let user: any = null;
      if (isMem) {
        user = db.getMemStore()["users"]?.get(data.email) ?? null;
        // fallback search by email value
        if (!user) {
          const all = db.memList("users");
          user = all.find((u:any)=>u.email===data.email) ?? null;
        }
      } else {
        user = await db.queryOne("SELECT * FROM users WHERE email=?", [data.email]);
      }
      if (!user) return errJson(401, "Invalid credentials");
      const ok = await auth.verifyPassword(data.password, user.password_hash);
      if (!ok) return errJson(401, "Invalid credentials");
      const token = auth.signToken({ id:user.id, email:user.email, role:user.role, designation:user.designation, name:user.name, branch:user.branch, reports_to:user.reports_to });
      return json({ success:true, data:{ user:{ id:user.id, name:user.name, email:user.email, role:user.role, designation:user.designation, branch:user.branch, reports_to:user.reports_to }, token } });
    }
    if (path === "/api/auth/me" && method === "GET") {
      const payload = auth.requireAuth(req);
      const isMem = db.isMemoryMode();
      let user: any = null;
      if (isMem) {
        user = db.memGet("users", payload.id) ?? (payload.email ? db.getMemStore()["users"]?.get(payload.email) : null) ?? null;
        if (!user) {
          const all = db.memList("users");
          user = all.find((u:any)=>u.id===payload.id) ?? null;
        }
      } else {
        user = await db.queryOne("SELECT id,name,email,role,designation,branch,reports_to,phone,created_at FROM users WHERE id=?", [payload.id]);
      }
      if (!user) return errJson(404, "User not found");
      return json({ success:true, data: { id:user.id, name:user.name, email:user.email, role:user.role, designation:user.designation, branch:user.branch, reports_to:user.reports_to, phone:user.phone } });
    }
    if (path === "/api/auth/logout" && method === "POST") {
      return json({ success:true, message:"Logged out" });
    }

    // ═══════════════════════════════════════════════════════════════
    // DRIVER PORTAL AUTH & DATA
    // ═══════════════════════════════════════════════════════════════
    if (path === "/api/auth/driver-login" && method === "POST") {
      const body = await parseBody(req);
      const phoneInput = (body.phone || body.email || "").toString().trim();
      const password = (body.password || body.pin || "").toString().trim();

      if (!phoneInput) return errJson(400, "Phone number or email required");
      
      const cleanInput = phoneInput.replace(/[^0-9]/g, "").slice(-10);
      const isMem = db.isMemoryMode();
      let driver: any = null;

      if (isMem) {
        const all = db.memList("travel_drivers") || [];
        driver = all.find((d: any) => {
          const dPhone = (d.phone || "").replace(/[^0-9]/g, "").slice(-10);
          return (cleanInput && dPhone === cleanInput) || d.email === phoneInput || d.name?.toLowerCase() === phoneInput.toLowerCase();
        });
      } else {
        const rows = await db.query(
          "SELECT * FROM travel_drivers WHERE REPLACE(REPLACE(REPLACE(phone, ' ', ''), '+91', ''), '-', '') LIKE ? OR phone LIKE ? OR name LIKE ? OR email = ?",
          [`%${cleanInput || phoneInput}%`, `%${cleanInput || phoneInput}%`, `%${phoneInput}%`, phoneInput]
        );
        driver = rows[0] ?? null;
      }

      if (!driver) {
        return errJson(401, "Driver account not found. Please contact fleet admin.");
      }

      // Password verification (accepts 'driver123', '1234', driver.pin, or matched hash if configured)
      const isDefault = password === "driver123" || password === "1234" || !driver.password_hash;
      const pinMatches = Boolean(driver.pin && driver.pin.toString().trim() === password);
      if (!isDefault && !pinMatches) {
        const ok = await auth.verifyPassword(password, driver.password_hash);
        if (!ok) return errJson(401, "Invalid password or PIN for driver");
      }

      const token = auth.signToken({
        id: driver.id,
        role: "driver",
        name: driver.name,
        phone: driver.phone,
        vehicle_number: driver.vehicle_number,
      });

      return json({
        success: true,
        data: {
          token,
          driver: {
            id: driver.id,
            name: driver.name,
            phone: driver.phone,
            vehicle_type: driver.vehicle_type,
            vehicle_number: driver.vehicle_number,
            experience: driver.experience || "5 years",
            rating: driver.rating || 4.9,
            status: driver.status || "Available",
          },
        },
      });
    }

    if (path === "/api/driver/me" && method === "GET") {
      const payload = auth.requireAuth(req);
      if (payload.role !== "driver" && payload.role !== "admin" && payload.role !== "super_admin") {
        return errJson(403, "Access denied: Driver portal only");
      }
      const isMem = db.isMemoryMode();
      let driver: any = null;
      if (isMem) {
        driver = db.memGet("travel_drivers", payload.id) || (db.memList("travel_drivers") || []).find((d: any) => d.id === payload.id || d.name === payload.name);
      } else {
        driver = await db.queryOne("SELECT * FROM travel_drivers WHERE id = ? OR name = ?", [payload.id, payload.name]);
      }
      return json({ success: true, data: driver || payload });
    }

    if (path === "/api/driver/my-trips" && method === "GET") {
      const payload = auth.requireAuth(req);
      const driverName = payload.name;
      const driverPhoneClean = (payload.phone || "").replace(/[^0-9]/g, "").slice(-10);

      const isMem = db.isMemoryMode();
      let trips: any[] = [];
      if (isMem) {
        const all = db.memList("travel_bookings") || [];
        trips = all.filter((b: any) => {
          const bDriver = b.assigned_driver || "";
          const bPhone = (b.driver_phone || "").replace(/[^0-9]/g, "").slice(-10);
          return bDriver.toLowerCase().includes(driverName.toLowerCase()) || (driverPhoneClean && bPhone === driverPhoneClean);
        });
      } else {
        trips = await db.query(
          "SELECT * FROM travel_bookings WHERE assigned_driver LIKE ? OR driver_phone LIKE ? ORDER BY id DESC",
          [`%${driverName}%`, `%${driverPhoneClean || driverName}%`]
        );
      }
      return json({ success: true, data: trips });
    }

    if (path.startsWith("/api/driver/trips/") && path.endsWith("/status") && method === "PUT") {
      const payload = auth.requireAuth(req);
      const tripId = path.split("/")[4];
      const body = await parseBody(req);
      const status = body.status || "On Trip";

      const isMem = db.isMemoryMode();
      if (isMem) {
        const numId = Number(tripId);
        const updated = db.memUpdate("travel_bookings", isNaN(numId) ? tripId : numId, { trip_status: status });
        return json({ success: true, data: updated });
      }

      await db.execute("UPDATE travel_bookings SET trip_status = ? WHERE id = ? OR booking_ref = ?", [status, tripId, tripId]);
      const row = await db.queryOne("SELECT * FROM travel_bookings WHERE id = ? OR booking_ref = ?", [tripId, tripId]);
      return json({ success: true, data: row });
    }

    // ═══════════════════════════════════════════════════════════════
    // TRAVELER / CUSTOMER PORTAL AUTH & DATA
    // ═══════════════════════════════════════════════════════════════
    if (path === "/api/auth/traveler-login" && method === "POST") {
      const body = await parseBody(req);
      const phoneOrRef = (body.phone || body.booking_ref || body.email || "").toString().trim();
      const codeOrPass = (body.password || body.booking_ref || body.code || "").toString().trim();

      if (!phoneOrRef) return errJson(400, "Mobile number or Booking Reference required");

      const cleanInput = phoneOrRef.replace(/[^0-9]/g, "").slice(-10);
      const isMem = db.isMemoryMode();
      let bookings: any[] = [];

      if (isMem) {
        const all = db.memList("travel_bookings") || [];
        bookings = all.filter((b: any) => {
          const bPhone = (b.phone || "").replace(/[^0-9]/g, "").slice(-10);
          const bRef = (b.booking_ref || "").toUpperCase();
          const target = phoneOrRef.toUpperCase();
          return (cleanInput && bPhone === cleanInput) || bRef === target || b.email?.toLowerCase() === phoneOrRef.toLowerCase();
        });
      } else {
        bookings = await db.query(
          "SELECT * FROM travel_bookings WHERE REPLACE(REPLACE(REPLACE(phone, ' ', ''), '+91', ''), '-', '') LIKE ? OR phone LIKE ? OR booking_ref = ? OR email = ? ORDER BY id DESC",
          [`%${cleanInput || phoneOrRef}%`, `%${cleanInput || phoneOrRef}%`, phoneOrRef.toUpperCase(), phoneOrRef]
        );
      }

      if (!bookings || bookings.length === 0) {
        return errJson(401, "No booking found with this phone number or reference. Please check your ticket details.");
      }

      const primary = bookings[0];
      const token = auth.signToken({
        id: primary.id,
        role: "traveler",
        name: primary.passenger_name,
        phone: primary.phone,
        email: primary.email,
      });

      return json({
        success: true,
        data: {
          token,
          traveler: {
            name: primary.passenger_name,
            phone: primary.phone,
            email: primary.email,
          },
          bookings,
        },
      });
    }

    if (path === "/api/traveler/me" && method === "GET") {
      const payload = auth.requireAuth(req);
      if (payload.role !== "traveler" && payload.role !== "admin" && payload.role !== "super_admin") {
        return errJson(403, "Access denied: Traveler portal only");
      }
      return json({ success: true, data: payload });
    }

    if (path === "/api/traveler/my-trips" && method === "GET") {
      const payload = auth.requireAuth(req);
      const phoneClean = (payload.phone || "").replace(/[^0-9]/g, "").slice(-10);
      const isMem = db.isMemoryMode();
      let trips: any[] = [];

      if (isMem) {
        const all = db.memList("travel_bookings") || [];
        trips = all.filter((b: any) => {
          const bPhone = (b.phone || "").replace(/[^0-9]/g, "").slice(-10);
          return (phoneClean && bPhone === phoneClean) || b.passenger_name?.toLowerCase() === payload.name?.toLowerCase();
        });
      } else {
        trips = await db.query(
          "SELECT * FROM travel_bookings WHERE phone LIKE ? OR passenger_name LIKE ? ORDER BY id DESC",
          [`%${phoneClean}%`, `%${payload.name}%`]
        );
      }
      return json({ success: true, data: trips });
    }

    // protected check for all other /api except health/auth login/register
    const openPaths = [
      "/api/health",
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/driver-login",
      "/api/auth/traveler-login"
    ];
    const isOpen = openPaths.some(p=>path===p) || path.startsWith("/api/dashboard") || path.startsWith("/api/settings");
    // Dashboard and some reads are public for demo but ideally protected — allow without auth for now
    // Uncomment to enforce: if (!isOpen && !auth.authMiddleware(req)) return errJson(401,"Unauthorized");

    // ---- Branches ----
    if (path === "/api/branches") {
      if (method === "GET") {
        const isMem = db.isMemoryMode();
        let rows: any[];
        if (isMem) rows = db.memList("branches");
        else rows = await db.query("SELECT * FROM branches ORDER BY id ASC");
        return json({ success:true, data: rows });
      }
      if (method === "POST") {
        const userPayload = auth.authMiddleware(req);
        if (userPayload && userPayload.role !== "super_admin") {
          return errJson(403, "Access restricted: Only Super Admin can add new branches.");
        }
        const body:any = await parseBody(req);
        if (!body.name || !body.city) return errJson(400,"name and city required");
        const isMem=db.isMemoryMode();
        let row:any;
        if (isMem) row = db.memCreate("branches", { name:body.name, city:body.city, region:body.region||"North", head:body.head||"", revenue:body.revenue||0, students:body.students||0 });
        else {
          const res=await db.execute("INSERT INTO branches (name,city,region,head,revenue,students) VALUES (?,?,?,?,?,?)",[body.name,body.city,body.region||"North",body.head||"",body.revenue||0,body.students||0]);
          row = await db.queryOne("SELECT * FROM branches WHERE id=?",[(res as any).insertId]);
        }
        return json({ success:true, data:row },201);
      }
    }
    const mBranch = path.match(/^\/api\/branches\/(\d+)$/);
    if (mBranch) {
      const id = parseInt(mBranch[1],10);
      const isMem=db.isMemoryMode();
      if (method==="GET") {
        const row = isMem? db.memGet("branches",id) : await db.queryOne("SELECT * FROM branches WHERE id=?",[id]);
        if (!row) return errJson(404,"Branch not found");
        return json({ success:true, data:row });
      }
      if (method==="PUT"||method==="PATCH") {
        const body:any=await parseBody(req);
        if (isMem) {
          const upd=db.memUpdate("branches",id,body);
          if (!upd) return errJson(404,"Branch not found");
          return json({ success:true, data:upd });
        } else {
          const fields=[]; const vals:any[]=[];
          for (const k of ["name","city","region","head","revenue","students"]) if (body[k]!==undefined){fields.push(`${k}=?`); vals.push(body[k]);}
          if (!fields.length) return errJson(400,"No fields to update");
          vals.push(id);
          await db.execute(`UPDATE branches SET ${fields.join(",")} WHERE id=?`, vals);
          const row=await db.queryOne("SELECT * FROM branches WHERE id=?",[id]);
          return json({ success:true, data:row });
        }
      }
      if (method==="DELETE") {
        if (isMem){ if(!db.memDelete("branches",id)) return errJson(404,"Not found"); }
        else { const r=await db.execute("DELETE FROM branches WHERE id=?",[id]); if((r as any).affectedRows===0) return errJson(404,"Not found"); }
        return json({ success:true, message:"Deleted" });
      }
    }

    // ---- Helper for generic CRUD ----
    // We'll handle each resource with similar pattern

    // STUDENTS
    if (path === "/api/students") {
      if (method==="GET") {
        const { page, limit, offset } = pagination(url);
        const search = qp(url,"search","").toLowerCase();
        const country = qp(url,"country","");
        const branch = qp(url,"branch","");
        const status = qp(url,"status","");
        const isMem=db.isMemoryMode();
        if (isMem) {
          let rows:any[] = db.memList("students");
          if (search) rows=rows.filter((r:any)=> (r.name?.toLowerCase().includes(search)||r.email?.toLowerCase().includes(search)||r.code?.toLowerCase().includes(search)));
          if (country) rows=rows.filter((r:any)=>r.country===country);
          if (branch) rows=rows.filter((r:any)=>r.branch===branch);
          if (status) rows=rows.filter((r:any)=>r.status===status);
          const total=rows.length;
          rows=rows.slice(offset, offset+limit);
          return json({ success:true, data:rows, pagination:{ page, limit, total, totalPages:Math.ceil(total/limit)} });
        } else {
          let where=" WHERE 1=1"; const params:any[]=[];
          if (search){ where+=" AND (name LIKE ? OR email LIKE ? OR code LIKE ?)"; params.push(`%${search}%`,`%${search}%`,`%${search}%`); }
          if (country){ where+=" AND country=?"; params.push(country); }
          if (branch){ where+=" AND branch=?"; params.push(branch); }
          if (status){ where+=" AND status=?"; params.push(status); }
          const cnt:any = await db.queryOne(`SELECT COUNT(*) as total FROM students${where}`, params);
          const total=cnt.total;
          const rows=await db.query(`SELECT * FROM students${where} ORDER BY id DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
          return json({ success:true, data:rows, pagination:{ page, limit, total, totalPages:Math.ceil(total/limit)} });
        }
      }
      if (method==="POST") {
        const body=await parseBody(req);
        const data=v.parseOrThrow(v.studentSchema, body);
        const isMem=db.isMemoryMode();
        const code = body.code || genCode("UQ");
        let row:any;
        if (isMem) row=db.memCreate("students",{ code, ...data, lead_score:data.lead_score??50, stage:data.stage||"Lead", stage_index:data.stage_index??0, status:data.status||"Active" });
        else {
          const res=await db.execute("INSERT INTO students (code,name,email,phone,dob,passport,country,course,university,intake,counselor,branch,lead_score,stage,stage_index,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [code,data.name,data.email,data.phone,data.dob||null,data.passport||null,data.country,data.course,data.university,data.intake,data.counselor||null,data.branch,data.lead_score??50,data.stage||"Lead",data.stage_index??0,data.status||"Active"]);
          row=await db.queryOne("SELECT * FROM students WHERE id=?",[(res as any).insertId]);
        }
        return json({ success:true, data:row },201);
      }
    }
    const mStudId = path.match(/^\/api\/students\/([^\/]+)$/);
    if (mStudId && !path.includes("/tasks") && !path.includes("/notes")) {
      const key=mStudId[1];
      const isMem=db.isMemoryMode();
      const find = async():Promise<any>=>{
        if (isMem){ return db.memGet("students",key) ?? db.memGet("students", parseInt(key,10)) ?? db.memList("students").find((s:any)=>s.code===key) ?? null; }
        else { if (/^\d+$/.test(key)) return await db.queryOne("SELECT * FROM students WHERE id=?",[key]); else return await db.queryOne("SELECT * FROM students WHERE code=?",[key]); }
      };
      if (method==="GET"){ const row=await find(); if(!row) return errJson(404,"Student not found"); return json({ success:true, data:row }); }
      if (method==="PUT"||method==="PATCH"){ const body:any=await parseBody(req); if(isMem){ const existing=await find(); if(!existing) return errJson(404,"Not found"); const upd=db.memUpdate("students", existing.id, body); return json({ success:true, data:upd }); } else { const existing=await find(); if(!existing) return errJson(404,"Not found"); const fields=[]; const vals:any[]=[]; const map:any={ name:"name", email:"email", phone:"phone", dob:"dob", passport:"passport", country:"country", course:"course", university:"university", intake:"intake", counselor:"counselor", branch:"branch", lead_score:"lead_score", stage:"stage", stage_index:"stage_index", status:"status"}; for(const k in map) if(body[k]!==undefined){fields.push(`${map[k]}=?`); vals.push(body[k]);} if(!fields.length) return errJson(400,"No fields"); vals.push(existing.id); await db.execute(`UPDATE students SET ${fields.join(",")} WHERE id=?`,vals); const row=await db.queryOne("SELECT * FROM students WHERE id=?",[existing.id]); return json({ success:true, data:row}); } }
      if (method==="DELETE"){ const existing=await find(); if(!existing) return errJson(404,"Not found"); if(isMem) db.memDelete("students",existing.id); else await db.execute("DELETE FROM students WHERE id=?",[existing.id]); return json({ success:true, message:"Deleted"}); }
    }

    const mSub = path.match(/^\/api\/students\/([^\/]+)\/(tasks|documents|notes|followups|comms)(?:\/([^\/]+))?$/);
    if (mSub) {
      const key = mSub[1];
      const resource = mSub[2];
      const itemId = mSub[3];
      const isMem = db.isMemoryMode();
      const findStudent = async(): Promise<any> => {
        if (isMem) {
          return db.memGet("students", key) ?? db.memGet("students", parseInt(key, 10)) ?? db.memList("students").find((s: any) => s.code === key) ?? null;
        } else {
          if (/^\d+$/.test(key)) return await db.queryOne("SELECT * FROM students WHERE id=?", [key]);
          else return await db.queryOne("SELECT * FROM students WHERE code=?", [key]);
        }
      };

      const stud = await findStudent();
      if (!stud) return errJson(404, "Student not found");
      const sid = stud.id;
      const tblName = `student_${resource}`;

      if (method === "GET") {
        if (isMem) {
          const rows = db.memList(tblName).filter((r: any) => Number(r.student_id) === Number(sid));
          return json({ success: true, data: rows });
        } else {
          const rows = await db.query(`SELECT * FROM ${tblName} WHERE student_id=? ORDER BY id DESC`, [sid]);
          return json({ success: true, data: rows });
        }
      }

      if (method === "POST") {
        const body: any = await parseBody(req);
        if (isMem) {
          const row = db.memCreate(tblName, { ...body, student_id: sid });
          return json({ success: true, data: row }, 201);
        } else {
          if (resource === "tasks") {
            const res = await db.execute(
              "INSERT INTO student_tasks (student_id, title, due_date, owner, priority, status) VALUES (?, ?, ?, ?, ?, ?)",
              [sid, body.title || "New Task", body.due_date || "Today", body.owner || "Meera Shah", body.priority || "Medium", body.status || "Open"]
            );
            const row = await db.queryOne("SELECT * FROM student_tasks WHERE id=?", [(res as any).insertId]);
            return json({ success: true, data: row }, 201);
          } else if (resource === "documents") {
            const res = await db.execute(
              "INSERT INTO student_documents (student_id, name, size, status) VALUES (?, ?, ?, ?)",
              [sid, body.name || "Document.pdf", body.size || "1.0 MB", body.status || "Verified"]
            );
            const row = await db.queryOne("SELECT * FROM student_documents WHERE id=?", [(res as any).insertId]);
            return json({ success: true, data: row }, 201);
          } else if (resource === "notes") {
            const res = await db.execute(
              "INSERT INTO student_notes (student_id, author, content) VALUES (?, ?, ?)",
              [sid, body.author || "Meera Shah", body.content || ""]
            );
            const row = await db.queryOne("SELECT * FROM student_notes WHERE id=?", [(res as any).insertId]);
            return json({ success: true, data: row }, 201);
          } else if (resource === "followups") {
            const res = await db.execute(
              "INSERT INTO student_followups (student_id, scheduled_at, channel, note, status) VALUES (?, ?, ?, ?, ?)",
              [sid, body.scheduled_at || "Tomorrow", body.channel || "Phone call", body.note || "", body.status || "Pending"]
            );
            const row = await db.queryOne("SELECT * FROM student_followups WHERE id=?", [(res as any).insertId]);
            return json({ success: true, data: row }, 201);
          } else if (resource === "comms") {
            const res = await db.execute(
              "INSERT INTO student_comms (student_id, channel, direction, subject) VALUES (?, ?, ?, ?)",
              [sid, body.channel || "Call", body.direction || "Outbound", body.subject || ""]
            );
            const row = await db.queryOne("SELECT * FROM student_comms WHERE id=?", [(res as any).insertId]);
            return json({ success: true, data: row }, 201);
          }
        }
      }

      if (method === "PATCH" || method === "PUT") {
        if (!itemId) return errJson(400, "Missing item id");
        const body: any = await parseBody(req);
        if (isMem) {
          const upd = db.memUpdate(tblName, itemId, body);
          return json({ success: true, data: upd });
        } else {
          if (resource === "tasks") {
            if (body.status !== undefined) {
              await db.execute("UPDATE student_tasks SET status=? WHERE id=? AND student_id=?", [body.status, itemId, sid]);
            }
            const row = await db.queryOne("SELECT * FROM student_tasks WHERE id=?", [itemId]);
            return json({ success: true, data: row });
          } else if (resource === "documents") {
            if (body.status !== undefined) {
              await db.execute("UPDATE student_documents SET status=? WHERE id=? AND student_id=?", [body.status, itemId, sid]);
            }
            const row = await db.queryOne("SELECT * FROM student_documents WHERE id=?", [itemId]);
            return json({ success: true, data: row });
          } else if (resource === "followups") {
            if (body.status !== undefined) {
              await db.execute("UPDATE student_followups SET status=? WHERE id=? AND student_id=?", [body.status, itemId, sid]);
            }
            const row = await db.queryOne("SELECT * FROM student_followups WHERE id=?", [itemId]);
            return json({ success: true, data: row });
          }
        }
      }

      if (method === "DELETE") {
        if (!itemId) return errJson(400, "Missing item id");
        if (isMem) {
          db.memDelete(tblName, itemId);
          return json({ success: true, message: "Deleted" });
        } else {
          await db.execute(`DELETE FROM ${tblName} WHERE id=? AND student_id=?`, [itemId, sid]);
          return json({ success: true, message: "Deleted" });
        }
      }
    }

    // LEADS
    if (path==="/api/leads") {
      if (method==="GET"){
        const { page, limit, offset }=pagination(url);
        const search=qp(url,"search","").toLowerCase();
        const status=qp(url,"status","");
        const isMem=db.isMemoryMode();
        if(isMem){
          let rows=db.memList("leads");
          if(search) rows=rows.filter((r:any)=>r.name.toLowerCase().includes(search)||r.city.toLowerCase().includes(search)||r.source.toLowerCase().includes(search));
          if(status) rows=rows.filter((r:any)=>r.status===status);
          const total=rows.length;
          rows=rows.slice(offset, offset+limit);
          return json({ success:true, data:rows, pagination:{page,limit,total, totalPages:Math.ceil(total/limit)} });
        } else {
          let where=" WHERE 1=1"; const params:any[]=[];
          if(search){ where+=" AND (name LIKE ? OR city LIKE ? OR source LIKE ?)"; params.push(`%${search}%`,`%${search}%`,`%${search}%`);}
          if(status){ where+=" AND status=?"; params.push(status); }
          const cnt:any=await db.queryOne(`SELECT COUNT(*) as total FROM leads${where}`,params);
          const rows=await db.query(`SELECT * FROM leads${where} ORDER BY id DESC LIMIT ? OFFSET ?`,[...params, limit, offset]);
          return json({ success:true, data:rows, pagination:{page,limit,total:cnt.total, totalPages:Math.ceil(cnt.total/limit)} });
        }
      }
      if(method==="POST"){
        const body=await parseBody(req);
        const data=v.parseOrThrow(v.leadSchema, body);
        const isMem=db.isMemoryMode();
        let row:any;
        if(isMem) row=db.memCreate("leads",{ ...data, score:data.score??60, status:data.status||"New Enquiry"});
        else { const res=await db.execute("INSERT INTO leads (name,email,phone,source,score,city,status,assigned_to,branch) VALUES (?,?,?,?,?,?,?,?,?)",[data.name,data.email||null,data.phone||null,data.source,data.score??60,data.city,data.status||"New Enquiry",data.assigned_to||null,data.branch||null]); row=await db.queryOne("SELECT * FROM leads WHERE id=?",[(res as any).insertId]); }
        return json({ success:true, data:row },201);
      }
    }
    const mLeadConvert=path.match(/^\/api\/leads\/(\d+)\/convert$/);
    if(mLeadConvert && method==="POST"){
      const leadId=parseInt(mLeadConvert[1],10);
      const isMem=db.isMemoryMode();
      const body:any=await parseBody(req);
      const lead:any=isMem?db.memGet("leads",leadId):await db.queryOne("SELECT * FROM leads WHERE id=?",[leadId]);
      if(!lead) return errJson(404,"Lead not found");

      // Check if student already exists for this lead
      let existingStudent:any=null;
      if (lead.student_id) {
        existingStudent = isMem ? db.memGet("students", lead.student_id) : await db.queryOne("SELECT * FROM students WHERE id=?", [lead.student_id]);
      }
      if (!existingStudent && lead.email) {
        existingStudent = isMem ? db.memList("students").find((s:any)=>s.email===lead.email) : await db.queryOne("SELECT * FROM students WHERE email=?", [lead.email]);
      }

      if (existingStudent) {
        if (!isMem) {
          await db.execute("UPDATE leads SET status='Qualified', student_id=?, student_code=? WHERE id=?", [existingStudent.id, existingStudent.code, leadId]);
        }
        return json({ success:true, message:"Lead already converted to Student", student: existingStudent });
      }

      const code = genCode("UQ");
      const name = lead.name;
      const email = lead.email || `${lead.name.toLowerCase().replace(/[^a-z0-9]/g,"")}@example.com`;
      const phone = lead.phone || null;
      const country = body.country || "United Kingdom";
      const course = body.course || "BSc / MSc Studies";
      const university = body.university || "To be finalized";
      const intake = body.intake || "Fall 2026";
      const counselor = lead.assigned_to || "Mohammad Iqbal";
      const branch = lead.branch || "Guwahati HQ";
      const lead_score = lead.score || 85;
      const stage = "Counselling";
      const stage_index = 1;
      const status = "Active";

      let createdStudent: any;
      if (isMem) {
        createdStudent = db.memCreate("students", { code, name, email, phone, dob:null, passport:null, country, course, university, intake, counselor, branch, lead_score, stage, stage_index, status });
        db.memUpdate("leads", leadId, { status: "Qualified", student_id: createdStudent.id, student_code: code });
      } else {
        const res = await db.execute(
          "INSERT INTO students (code, name, email, phone, dob, passport, country, course, university, intake, counselor, branch, lead_score, stage, stage_index, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [code, name, email, phone, null, null, country, course, university, intake, counselor, branch, lead_score, stage, stage_index, status]
        );
        const stuId = (res as any).insertId;
        createdStudent = await db.queryOne("SELECT * FROM students WHERE id=?", [stuId]);
        await db.execute("UPDATE leads SET status='Qualified', student_id=?, student_code=? WHERE id=?", [stuId, code, leadId]);
      }

      return json({ success:true, message:"Lead successfully converted to Student Admission!", student: createdStudent }, 201);
    }
    const mLead=path.match(/^\/api\/leads\/(\d+)$/);
    if(mLead){
      const id=parseInt(mLead[1],10);
      const isMem=db.isMemoryMode();
      if(method==="GET"){ const row=isMem?db.memGet("leads",id):await db.queryOne("SELECT * FROM leads WHERE id=?",[id]); if(!row) return errJson(404,"Lead not found"); return json({ success:true, data:row});}
      if(method==="PUT"||method==="PATCH"){ const body:any=await parseBody(req); if(isMem){ const upd=db.memUpdate("leads",id,body); if(!upd) return errJson(404,"Not found"); return json({ success:true, data:upd}); } else { const fields=[]; const vals:any[]=[]; for(const k of ["name","email","phone","source","score","city","status","assigned_to","branch","student_id","student_code"]) if(body[k]!==undefined){fields.push(`${k}=?`); vals.push(body[k]);} if(!fields.length) return errJson(400,"No fields"); vals.push(id); await db.execute(`UPDATE leads SET ${fields.join(",")} WHERE id=?`,vals); const row=await db.queryOne("SELECT * FROM leads WHERE id=?",[id]); return json({ success:true, data:row});}}
      if(method==="DELETE"){ if(isMem){ if(!db.memDelete("leads",id)) return errJson(404,"Not found"); } else { const r=await db.execute("DELETE FROM leads WHERE id=?",[id]); if((r as any).affectedRows===0) return errJson(404,"Not found"); } return json({ success:true, message:"Deleted"}); }
    }

    // APPLICATIONS
    if(path==="/api/applications"){
      if(method==="GET"){
        const {page,limit,offset}=pagination(url);
        const search=qp(url,"search","").toLowerCase();
        const status=qp(url,"status","");
        const isMem=db.isMemoryMode();
        if(isMem){
          let rows=db.memList("applications");
          if(search) rows=rows.filter((r:any)=>r.student.toLowerCase().includes(search)||r.university.toLowerCase().includes(search)||r.code.toLowerCase().includes(search));
          if(status) rows=rows.filter((r:any)=>r.status===status);
          const total=rows.length; rows=rows.slice(offset, offset+limit);
          return json({ success:true, data:rows, pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}});
        } else {
          let where=" WHERE 1=1"; const params:any[]=[];
          if(search){ where+=" AND (student LIKE ? OR university LIKE ? OR code LIKE ?)"; params.push(`%${search}%`,`%${search}%`,`%${search}%`); }
          if(status){ where+=" AND status=?"; params.push(status); }
          const cnt:any=await db.queryOne(`SELECT COUNT(*) as total FROM applications${where}`,params);
          const rows=await db.query(`SELECT * FROM applications${where} ORDER BY id DESC LIMIT ? OFFSET ?`,[...params, limit, offset]);
          return json({ success:true, data:rows, pagination:{page,limit,total:cnt.total, totalPages:Math.ceil(cnt.total/limit)}});
        }
      }
      if(method==="POST"){
        const body=await parseBody(req);
        const data=v.parseOrThrow(v.applicationSchema, body);
        const code=body.code||genCode("APP");
        const isMem=db.isMemoryMode();
        let row:any;
        if(isMem) row=db.memCreate("applications",{ code, ...data, stage:data.stage||"Documents", progress:data.progress??0, status:data.status||"In Progress"});
        else { const res=await db.execute("INSERT INTO applications (code,student,student_id,university,program,intake,stage,progress,status) VALUES (?,?,?,?,?,?,?,?,?)",[code,data.student,data.student_id||null,data.university,data.program,data.intake,data.stage||"Documents",data.progress??0,data.status||"In Progress"]); row=await db.queryOne("SELECT * FROM applications WHERE id=?",[(res as any).insertId]);}
        return json({ success:true, data:row},201);
      }
    }
    const mApp=path.match(/^\/api\/applications\/([^\/]+)$/);
    if(mApp){
      const key=mApp[1];
      const find=async():Promise<any>=>{ if(db.isMemoryMode()){ return db.memGet("applications",key) ?? db.memList("applications").find((a:any)=>a.code===key) ?? ( /^\d+$/.test(key)? db.memGet("applications",parseInt(key,10)):null); } else { if(/^\d+$/.test(key)) return await db.queryOne("SELECT * FROM applications WHERE id=?",[key]); else return await db.queryOne("SELECT * FROM applications WHERE code=?",[key]); } };
      if(method==="GET"){ const row=await find(); if(!row) return errJson(404,"Application not found"); return json({ success:true, data:row});}
      if(method==="PUT"||method==="PATCH"){ const body:any=await parseBody(req); const existing=await find(); if(!existing) return errJson(404,"Not found"); if(db.isMemoryMode()){ const upd=db.memUpdate("applications",existing.id,body); return json({ success:true, data:upd}); } else { const fields=[]; const vals:any[]=[]; for(const k of ["student","university","program","intake","stage","progress","status"]) if(body[k]!==undefined){fields.push(`${k}=?`); vals.push(body[k]);} if(!fields.length) return errJson(400,"No fields"); vals.push(existing.id); await db.execute(`UPDATE applications SET ${fields.join(",")} WHERE id=?`,vals); const row=await db.queryOne("SELECT * FROM applications WHERE id=?",[existing.id]); return json({ success:true, data:row}); } }
      if(method==="DELETE"){ const existing=await find(); if(!existing) return errJson(404,"Not found"); if(db.isMemoryMode()) db.memDelete("applications",existing.id); else await db.execute("DELETE FROM applications WHERE id=?",[existing.id]); return json({ success:true, message:"Deleted"}); }
    }

    // UNIVERSITIES
    if(path==="/api/universities"){
      if(method==="GET"){
        const search=qp(url,"search","").toLowerCase();
        const {page,limit,offset}=pagination(url);
        const isMem=db.isMemoryMode();
        if(isMem){
          let rows=db.memList("universities");
          if(search) rows=rows.filter((r:any)=>r.name.toLowerCase().includes(search)||r.country.toLowerCase().includes(search));
          const total=rows.length; rows=rows.slice(offset, offset+limit);
          return json({ success:true, data:rows, pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}});
        } else {
          let where=""; const params:any[]=[];
          if(search){ where=" WHERE name LIKE ? OR country LIKE ?"; params.push(`%${search}%`,`%${search}%`);}
          const cnt:any=await db.queryOne(`SELECT COUNT(*) as total FROM universities${where}`,params);
          const rows=await db.query(`SELECT * FROM universities${where} ORDER BY rating DESC LIMIT ? OFFSET ?`,[...params, limit, offset]);
          return json({ success:true, data:rows, pagination:{page,limit,total:cnt.total,totalPages:Math.ceil(cnt.total/limit)}});
        }
      }
      if(method==="POST"){
        const body=await parseBody(req);
        const data=v.parseOrThrow(v.universitySchema,body);
        const isMem=db.isMemoryMode();
        let row:any;
        if(isMem) row=db.memCreate("universities",{ ...data, tier:data.tier||"Tier 1", courses:data.courses??0, rating:data.rating??4.5});
        else { const res=await db.execute("INSERT INTO universities (name,country,city,tier,courses,intakes,commission,rating) VALUES (?,?,?,?,?,?,?,?)",[data.name,data.country,data.city,data.tier||"Tier 1",data.courses??0,data.intakes,data.commission,data.rating??4.5]); row=await db.queryOne("SELECT * FROM universities WHERE id=?",[(res as any).insertId]);}
        return json({ success:true, data:row},201);
      }
    }
    const mUni=path.match(/^\/api\/universities\/(\d+)$/);
    if(mUni){
      const id=parseInt(mUni[1],10);
      const isMem=db.isMemoryMode();
      if(method==="GET"){ const row=isMem?db.memGet("universities",id):await db.queryOne("SELECT * FROM universities WHERE id=?",[id]); if(!row) return errJson(404,"University not found"); return json({ success:true, data:row});}
      if(method==="PUT"||method==="PATCH"){ const body:any=await parseBody(req); if(isMem){ const upd=db.memUpdate("universities",id,body); if(!upd) return errJson(404,"Not found"); return json({ success:true, data:upd}); } else { const fields=[]; const vals:any[]=[]; for(const k of ["name","country","city","tier","courses","intakes","commission","rating"]) if(body[k]!==undefined){fields.push(`${k}=?`); vals.push(body[k]);} if(!fields.length) return errJson(400,"No fields"); vals.push(id); await db.execute(`UPDATE universities SET ${fields.join(",")} WHERE id=?`,vals); const row=await db.queryOne("SELECT * FROM universities WHERE id=?",[id]); return json({ success:true, data:row}); } }
      if(method==="DELETE"){ if(isMem){ if(!db.memDelete("universities",id)) return errJson(404,"Not found"); } else { const r=await db.execute("DELETE FROM universities WHERE id=?",[id]); if((r as any).affectedRows===0) return errJson(404,"Not found"); } return json({ success:true, message:"Deleted"}); }
    }

    // COLLEGES (India)
    if(path==="/api/colleges"){
      if(method==="GET"){
        const search=qp(url,"search","").toLowerCase();
        const state=qp(url,"state","");
        const {page,limit,offset}=pagination(url);
        const isMem=db.isMemoryMode();
        if(isMem){
          let rows=db.memList("colleges");
          if(search) rows=rows.filter((r:any)=>r.name.toLowerCase().includes(search));
          if(state) rows=rows.filter((r:any)=>r.state===state);
          const total=rows.length; rows=rows.slice(offset, offset+limit);
          return json({ success:true, data:rows, pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}});
        } else {
          let where=" WHERE 1=1"; const params:any[]=[];
          if(search){ where+=" AND name LIKE ?"; params.push(`%${search}%`);}
          if(state){ where+=" AND state=?"; params.push(state);}
          const cnt:any=await db.queryOne(`SELECT COUNT(*) as total FROM colleges${where}`,params);
          const rows=await db.query(`SELECT * FROM colleges${where} ORDER BY id ASC LIMIT ? OFFSET ?`,[...params, limit, offset]);
          const mapped=rows.map((r:any)=>({...r, courses_offered: typeof r.courses_offered==="string"? JSON.parse(r.courses_offered): r.courses_offered, coursesOffered: typeof r.courses_offered==="string"? JSON.parse(r.courses_offered): r.courses_offered}));
          return json({ success:true, data:mapped, pagination:{page,limit,total:cnt.total,totalPages:Math.ceil(cnt.total/limit)}});
        }
      }
      if(method==="POST"){
        const body=await parseBody(req);
        const data=v.parseOrThrow(v.collegeSchema,body);
        const code=body.code||genCode("COL");
        const isMem=db.isMemoryMode();
        let row:any;
        if(isMem) row=db.memCreate("colleges",{ code, name:data.name, state:data.state, city:data.city, affiliatedUniversity:data.affiliatedUniversity, coursesOffered:data.coursesOffered||[], annualIntake:data.annualIntake??0, deadline:data.deadline, tuitionFee:data.tuitionFee, hostelFee:data.hostelFee, contactPerson:data.contactPerson, contactNumber:data.contactNumber, email:data.email, website:data.website, status:data.status||"Active", notes:data.notes});
        else { const res=await db.execute("INSERT INTO colleges (code,name,state,city,affiliated_university,courses_offered,annual_intake,deadline,tuition_fee,hostel_fee,contact_person,contact_number,email,website,status,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[code,data.name,data.state,data.city,data.affiliatedUniversity,JSON.stringify(data.coursesOffered||[]),data.annualIntake??0,data.deadline||null,data.tuitionFee||null,data.hostelFee||null,data.contactPerson||null,data.contactNumber||null,data.email||null,data.website||null,data.status||"Active",data.notes||null]); row=await db.queryOne("SELECT * FROM colleges WHERE id=?",[(res as any).insertId]);}
        return json({ success:true, data:row},201);
      }
    }
    const mCol=path.match(/^\/api\/colleges\/([^\/]+)$/);
    if(mCol){
      const key=mCol[1];
      const find=async():Promise<any>=>{ if(db.isMemoryMode()){ return db.memGet("colleges",key) ?? db.memList("colleges").find((c:any)=>c.code===key) ?? ( /^\d+$/.test(key)? db.memGet("colleges",parseInt(key,10)):null); } else { if(/^\d+$/.test(key)) return await db.queryOne("SELECT * FROM colleges WHERE id=?",[key]); else return await db.queryOne("SELECT * FROM colleges WHERE code=?",[key]); } };
      if(method==="GET"){ const row=await find(); if(!row) return errJson(404,"College not found"); return json({ success:true, data:row});}
      if(method==="PUT"||method==="PATCH"){ const body:any=await parseBody(req); const existing=await find(); if(!existing) return errJson(404,"Not found"); if(db.isMemoryMode()){ const upd=db.memUpdate("colleges",existing.id,body); return json({ success:true, data:upd}); } else { const fields=[]; const vals:any[]=[]; const map:any={ name:"name", state:"state", city:"city", affiliatedUniversity:"affiliated_university", coursesOffered:"courses_offered", annualIntake:"annual_intake", deadline:"deadline", tuitionFee:"tuition_fee", hostelFee:"hostel_fee", contactPerson:"contact_person", contactNumber:"contact_number", email:"email", website:"website", status:"status", notes:"notes"}; for(const k in map) if(body[k]!==undefined){fields.push(`${map[k]}=?`); let v=body[k]; if(k==="coursesOffered") v=JSON.stringify(v); vals.push(v);} if(!fields.length) return errJson(400,"No fields"); vals.push(existing.id); await db.execute(`UPDATE colleges SET ${fields.join(",")} WHERE id=?`,vals); const row=await db.queryOne("SELECT * FROM colleges WHERE id=?",[existing.id]); return json({ success:true, data:row}); } }
      if(method==="DELETE"){ const existing=await find(); if(!existing) return errJson(404,"Not found"); if(db.isMemoryMode()) db.memDelete("colleges",existing.id); else await db.execute("DELETE FROM colleges WHERE id=?",[existing.id]); return json({ success:true, message:"Deleted"}); }
    }

    // COURSES
    if(path==="/api/courses"){
      if(method==="GET"){
        const {page,limit,offset}=pagination(url);
        const search=qp(url,"search","").toLowerCase();
        const category=qp(url,"category","");
        const isMem=db.isMemoryMode();
        if(isMem){
          let rows=db.memList("courses");
          if(search) rows=rows.filter((r:any)=>r.name.toLowerCase().includes(search));
          if(category) rows=rows.filter((r:any)=>r.category===category);
          const total=rows.length; rows=rows.slice(offset, offset+limit);
          return json({ success:true, data:rows, pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}});
        } else {
          let where=" WHERE 1=1"; const params:any[]=[];
          if(search){ where+=" AND name LIKE ?"; params.push(`%${search}%`);}
          if(category){ where+=" AND category=?"; params.push(category);}
          const cnt:any=await db.queryOne(`SELECT COUNT(*) as total FROM courses${where}`,params);
          const rows=await db.query(`SELECT * FROM courses${where} ORDER BY id ASC LIMIT ? OFFSET ?`,[...params, limit, offset]);
          return json({ success:true, data:rows, pagination:{page,limit,total:cnt.total,totalPages:Math.ceil(cnt.total/limit)}});
        }
      }
      if(method==="POST"){
        const body=await parseBody(req);
        const data=v.parseOrThrow(v.courseSchema,body);
        const code=body.code||genCode("CRS");
        const isMem=db.isMemoryMode();
        let row:any;
        if(isMem) row=db.memCreate("courses",{ code, ...data, seatsAvailable:data.seatsAvailable??0, totalSeats:data.totalSeats??0 });
        else { const res=await db.execute("INSERT INTO courses (code,name,category,duration,eligibility,tuition_fee,registration_fee,seats_available,total_seats,session,min_percentage,description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",[code,data.name,data.category,data.duration,data.eligibility,data.tuitionFee,data.registrationFee,data.seatsAvailable??0,data.totalSeats??0,data.session,data.minPercentage||"",data.description||null]); row=await db.queryOne("SELECT * FROM courses WHERE id=?",[(res as any).insertId]);}
        return json({ success:true, data:row},201);
      }
    }
    const mCourse=path.match(/^\/api\/courses\/([^\/]+)$/);
    if(mCourse){
      const key=mCourse[1];
      const find=async():Promise<any>=>{ if(db.isMemoryMode()){ return db.memGet("courses",key) ?? db.memList("courses").find((c:any)=>c.code===key) ?? ( /^\d+$/.test(key)? db.memGet("courses",parseInt(key,10)):null); } else { if(/^\d+$/.test(key)) return await db.queryOne("SELECT * FROM courses WHERE id=?",[key]); else return await db.queryOne("SELECT * FROM courses WHERE code=?",[key]); } };
      if(method==="GET"){ const row=await find(); if(!row) return errJson(404,"Course not found"); return json({ success:true, data:row});}
      if(method==="PUT"||method==="PATCH"){ const body:any=await parseBody(req); const existing=await find(); if(!existing) return errJson(404,"Not found"); if(db.isMemoryMode()){ const upd=db.memUpdate("courses",existing.id,body); return json({ success:true, data:upd}); } else { const fields=[]; const vals:any[]=[]; const map:any={ name:"name", category:"category", duration:"duration", eligibility:"eligibility", tuitionFee:"tuition_fee", registrationFee:"registration_fee", seatsAvailable:"seats_available", totalSeats:"total_seats", session:"session", minPercentage:"min_percentage", description:"description"}; for(const k in map) if(body[k]!==undefined){fields.push(`${map[k]}=?`); vals.push(body[k]);} if(!fields.length) return errJson(400,"No fields"); vals.push(existing.id); await db.execute(`UPDATE courses SET ${fields.join(",")} WHERE id=?`,vals); const row=await db.queryOne("SELECT * FROM courses WHERE id=?",[existing.id]); return json({ success:true, data:row}); } }
      if(method==="DELETE"){ const existing=await find(); if(!existing) return errJson(404,"Not found"); if(db.isMemoryMode()) db.memDelete("courses",existing.id); else await db.execute("DELETE FROM courses WHERE id=?",[existing.id]); return json({ success:true, message:"Deleted"}); }
    }

    // INDIA STUDENTS
    if(path==="/api/india-students"){
      if(method==="GET"){
        const {page,limit,offset}=pagination(url);
        const search=qp(url,"search","").toLowerCase();
        const isMem=db.isMemoryMode();
        if(isMem){
          let rows=db.memList("india_students");
          if(search) rows=rows.filter((r:any)=>r.name.toLowerCase().includes(search)||r.email.toLowerCase().includes(search)||r.code.toLowerCase().includes(search));
          const total=rows.length; rows=rows.slice(offset, offset+limit);
          return json({ success:true, data:rows, pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}});
        } else {
          let where=""; const params:any[]=[];
          if(search){ where=" WHERE name LIKE ? OR email LIKE ? OR code LIKE ?"; params.push(`%${search}%`,`%${search}%`,`%${search}%`);}
          const cnt:any=await db.queryOne(`SELECT COUNT(*) as total FROM india_students${where}`,params);
          const rows=await db.query(`SELECT * FROM india_students${where} ORDER BY id DESC LIMIT ? OFFSET ?`,[...params, limit, offset]);
          return json({ success:true, data:rows, pagination:{page,limit,total:cnt.total,totalPages:Math.ceil(cnt.total/limit)}});
        }
      }
      if(method==="POST"){
        const body=await parseBody(req);
        const data=v.parseOrThrow(v.indiaStudentSchema,body);
        const code=body.code||genCode("IND");
        const isMem=db.isMemoryMode();
        let row:any;
        if(isMem) row=db.memCreate("india_students",{ code, ...data, fatherName:data.fatherName, fatherPhone:data.fatherPhone, preferredState:data.preferredState, preferredCollege:data.preferredCollege, preferredCourse:data.preferredCourse, stageIndex:data.stageIndex??0, registrationFeePaid:!!data.registrationFeePaid, totalFee:data.totalFee??0, paidFee:data.paidFee??0, appliedDate:data.appliedDate||new Date().toISOString().slice(0,10) });
        else { const res=await db.execute("INSERT INTO india_students (code,name,phone,email,dob,gender,category,father_name,father_phone,address,counselor,branch,preferred_state,preferred_college,preferred_course,session,stage_index,registration_fee_paid,total_fee,paid_fee,scholarship,discount,remarks,applied_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[code,data.name,data.phone,data.email,data.dob||null,data.gender||null,data.category||null,data.fatherName||null,data.fatherPhone||null,data.address||null,data.counselor||null,data.branch,data.preferredState||null,data.preferredCollege||null,data.preferredCourse||null,data.session,data.stageIndex??0,data.registrationFeePaid?1:0,data.totalFee??0,data.paidFee??0,data.scholarship??0,data.discount??0,data.remarks||null,data.appliedDate||new Date().toISOString().slice(0,10)]); row=await db.queryOne("SELECT * FROM india_students WHERE id=?",[(res as any).insertId]);}
        return json({ success:true, data:row},201);
      }
    }
    const mIndiaSt=path.match(/^\/api\/india-students\/([^\/]+)$/);
    if(mIndiaSt){
      const key=mIndiaSt[1];
      const find=async():Promise<any>=>{ if(db.isMemoryMode()){ return db.memGet("india_students",key) ?? db.memList("india_students").find((c:any)=>c.code===key) ?? ( /^\d+$/.test(key)? db.memGet("india_students",parseInt(key,10)):null); } else { if(/^\d+$/.test(key)) return await db.queryOne("SELECT * FROM india_students WHERE id=?",[key]); else return await db.queryOne("SELECT * FROM india_students WHERE code=?",[key]); } };
      if(method==="GET"){ const row=await find(); if(!row) return errJson(404,"India student not found"); return json({ success:true, data:row});}
      if(method==="PUT"||method==="PATCH"){ const body:any=await parseBody(req); const existing=await find(); if(!existing) return errJson(404,"Not found"); if(db.isMemoryMode()){ const upd=db.memUpdate("india_students",existing.id,body); return json({ success:true, data:upd}); } else { const fields=[]; const vals:any[]=[]; const map:any={ name:"name", phone:"phone", email:"email", dob:"dob", gender:"gender", category:"category", fatherName:"father_name", fatherPhone:"father_phone", address:"address", counselor:"counselor", branch:"branch", preferredState:"preferred_state", preferredCollege:"preferred_college", preferredCourse:"preferred_course", session:"session", stageIndex:"stage_index", registrationFeePaid:"registration_fee_paid", totalFee:"total_fee", paidFee:"paid_fee", scholarship:"scholarship", discount:"discount", remarks:"remarks", appliedDate:"applied_date"}; for(const k in map) if(body[k]!==undefined){fields.push(`${map[k]}=?`); let v=body[k]; if(k==="registrationFeePaid") v=v?1:0; vals.push(v);} if(!fields.length) return errJson(400,"No fields"); vals.push(existing.id); await db.execute(`UPDATE india_students SET ${fields.join(",")} WHERE id=?`,vals); const row=await db.queryOne("SELECT * FROM india_students WHERE id=?",[existing.id]); return json({ success:true, data:row}); } }
      if(method==="DELETE"){ const existing=await find(); if(!existing) return errJson(404,"Not found"); if(db.isMemoryMode()) db.memDelete("india_students",existing.id); else await db.execute("DELETE FROM india_students WHERE id=?",[existing.id]); return json({ success:true, message:"Deleted"}); }
    }

    // INVOICES (Finance)
    if(path==="/api/invoices"){
      if(method==="GET"){
        const {page,limit,offset}=pagination(url);
        const search=qp(url,"search","").toLowerCase();
        const status=qp(url,"status","");
        const isMem=db.isMemoryMode();
        if(isMem){
          let rows=db.memList("invoices");
          if(search) rows=rows.filter((r:any)=>r.student.toLowerCase().includes(search)||r.code.toLowerCase().includes(search));
          if(status) rows=rows.filter((r:any)=>r.status===status);
          const total=rows.length; rows=rows.slice(offset, offset+limit);
          return json({ success:true, data:rows, pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}});
        } else {
          let where=" WHERE 1=1"; const params:any[]=[];
          if(search){ where+=" AND (student LIKE ? OR code LIKE ?)"; params.push(`%${search}%`,`%${search}%`);}
          if(status){ where+=" AND status=?"; params.push(status);}
          const cnt:any=await db.queryOne(`SELECT COUNT(*) as total FROM invoices${where}`,params);
          const rows=await db.query(`SELECT * FROM invoices${where} ORDER BY date DESC LIMIT ? OFFSET ?`,[...params, limit, offset]);
          return json({ success:true, data:rows, pagination:{page,limit,total:cnt.total,totalPages:Math.ceil(cnt.total/limit)}});
        }
      }
      if(method==="POST"){
        const body=await parseBody(req);
        const data=v.parseOrThrow(v.invoiceSchema,body);
        const code=body.code||genCode("INV");
        const amountVal = (data.amount_value != null ? data.amount_value : (parseInt(data.amount.replace(/\D/g,""),10) || 0));
        const isMem=db.isMemoryMode();
        let row:any;
        if(isMem) row=db.memCreate("invoices",{ code, ...data, amount_value:amountVal, currency:data.currency||"INR", status:data.status||"Pending", date:data.date||new Date().toISOString().slice(0,10) });
        else { const res=await db.execute("INSERT INTO invoices (code,student,student_id,amount,amount_value,currency,type,date,status) VALUES (?,?,?,?,?,?,?,?,?)",[code,data.student,data.student_id||null,data.amount,amountVal,data.currency||"INR",data.type,data.date||new Date().toISOString().slice(0,10),data.status||"Pending"]); row=await db.queryOne("SELECT * FROM invoices WHERE id=?",[(res as any).insertId]);}
        return json({ success:true, data:row},201);
      }
    }
    const mInv=path.match(/^\/api\/invoices\/([^\/]+)$/);
    if(mInv){
      const key=mInv[1];
      const find=async():Promise<any>=>{ if(db.isMemoryMode()){ return db.memGet("invoices",key) ?? db.memList("invoices").find((c:any)=>c.code===key) ?? ( /^\d+$/.test(key)? db.memGet("invoices",parseInt(key,10)):null); } else { if(/^\d+$/.test(key)) return await db.queryOne("SELECT * FROM invoices WHERE id=?",[key]); else return await db.queryOne("SELECT * FROM invoices WHERE code=?",[key]); } };
      if(method==="GET"){ const row=await find(); if(!row) return errJson(404,"Invoice not found"); return json({ success:true, data:row});}
      if(method==="PUT"||method==="PATCH"){ const body:any=await parseBody(req); const existing=await find(); if(!existing) return errJson(404,"Not found"); if(db.isMemoryMode()){ const upd=db.memUpdate("invoices",existing.id,body); return json({ success:true, data:upd}); } else { const fields=[]; const vals:any[]=[]; for(const k of ["student","amount","amount_value","currency","type","date","status"]) if(body[k]!==undefined){fields.push(`${k}=?`); vals.push(body[k]);} if(!fields.length) return errJson(400,"No fields"); vals.push(existing.id); await db.execute(`UPDATE invoices SET ${fields.join(",")} WHERE id=?`,vals); const row=await db.queryOne("SELECT * FROM invoices WHERE id=?",[existing.id]); return json({ success:true, data:row}); } }
      if(method==="DELETE"){ const existing=await find(); if(!existing) return errJson(404,"Not found"); if(db.isMemoryMode()) db.memDelete("invoices",existing.id); else await db.execute("DELETE FROM invoices WHERE id=?",[existing.id]); return json({ success:true, message:"Deleted"}); }
    }

    // ═══════════════════════════════════════════════════════════════
    // BRANCH & STAFF HIERARCHY API
    // ═══════════════════════════════════════════════════════════════
    if (path === "/api/staff/hierarchy" && method === "GET") {
      const userPayload = auth.authMiddleware(req);
      if (userPayload) {
        const r = (userPayload.role || "").toLowerCase();
        const isMgmt = r === "super_admin" || r === "branch_admin" || r === "admin" || r.includes("admin") || r.includes("director") || r.includes("ceo");
        if (!isMgmt) {
          return errJson(403, "Access restricted: Staff members cannot access HR organogram.");
        }
      }
      const isMem = db.isMemoryMode();
      const branchFilter = qp(url, "branch", "");

      const branches = isMem ? (db.memList("branches") || []) : await db.query("SELECT * FROM branches ORDER BY id ASC");
      const employees = isMem ? (db.memList("employees") || []) : await db.query("SELECT * FROM employees ORDER BY id ASC");

      const hierarchy = branches
        .filter((b: any) => !branchFilter || b.name === branchFilter)
        .map((b: any) => {
          const branchEmps = employees.filter((e: any) => e.branch === b.name || (e.branch && b.name && e.branch.includes(b.name)));
          const admin = branchEmps.find((e: any) => e.role === "branch_admin" || (e.role || "").toLowerCase().includes("branch admin") || (e.designation || "").toLowerCase().includes("head") || e.name === b.head) || {
            name: b.head || "Branch Admin",
            role: "branch_admin",
            designation: "Branch Head / Branch Manager",
            email: `${b.name.toLowerCase().replace(/[^a-z]/g, "")}.admin@uniquesta.com`,
            phone: "+91 98200 00000",
            branch: b.name
          };
          const staff = branchEmps.filter((e: any) => e.id !== admin.id && e.role !== "super_admin" && e.role !== "branch_admin");
          return {
            branch: b.name,
            city: b.city || b.name,
            region: b.region || "HQ",
            admin,
            staff,
            stats: {
              totalStaff: staff.length,
              counselors: staff.filter((s: any) => (s.designation || s.role || "").toLowerCase().includes("counsel")).length,
              visaOfficers: staff.filter((s: any) => (s.designation || s.role || "").toLowerCase().includes("visa")).length,
              finance: staff.filter((s: any) => (s.designation || s.role || "").toLowerCase().includes("finance") || (s.designation || s.role || "").toLowerCase().includes("account")).length,
              travel: staff.filter((s: any) => (s.designation || s.role || "").toLowerCase().includes("travel") || (s.designation || s.role || "").toLowerCase().includes("fleet")).length,
              frontDesk: staff.filter((s: any) => (s.designation || s.role || "").toLowerCase().includes("front") || (s.designation || s.role || "").toLowerCase().includes("reception")).length,
            }
          };
        });

      return json({ success: true, data: hierarchy });
    }

    if (path === "/api/branches/admins" && method === "GET") {
      const isMem = db.isMemoryMode();
      const branches = isMem ? (db.memList("branches") || []) : await db.query("SELECT * FROM branches ORDER BY id ASC");
      const employees = isMem ? (db.memList("employees") || []) : await db.query("SELECT * FROM employees ORDER BY id ASC");

      const list = branches.map((b: any) => {
        const admin = employees.find((e: any) => (e.branch === b.name || e.branch?.includes(b.name)) && (e.role === "branch_admin" || (e.role || "").toLowerCase().includes("branch admin") || (e.designation || "").toLowerCase().includes("head") || e.name === b.head));
        return {
          branch: b.name,
          head: admin?.name || b.head || "Branch Admin",
          role: "branch_admin",
          designation: admin?.designation || "Branch Head / Branch Manager",
          email: admin?.email || `${b.name.toLowerCase().replace(/[^a-z]/g, "")}.admin@uniquesta.com`,
          phone: admin?.phone || "+91 98200 00000"
        };
      });
      return json({ success: true, data: list });
    }

    // EMPLOYEES (HR & Staff Management)
    if (path === "/api/employees") {
      if (method === "GET") {
        const userPayload = auth.authMiddleware(req);
        if (userPayload) {
          const r = (userPayload.role || "").toLowerCase();
          const isMgmt = r === "super_admin" || r === "branch_admin" || r === "admin" || r.includes("admin") || r.includes("director") || r.includes("ceo");
          if (!isMgmt) {
            return errJson(403, "Access restricted: Staff members cannot access HR staff directory.");
          }
        }
        const { page, limit, offset } = pagination(url);
        const search = qp(url, "search", "").toLowerCase();
        const branch = qp(url, "branch", "");
        const role = qp(url, "role", "");
        const status = qp(url, "status", "");
        const isMem = db.isMemoryMode();

        if (isMem) {
          let rows = db.memList("employees");
          if (search) rows = rows.filter((r: any) => r.name?.toLowerCase().includes(search) || r.role?.toLowerCase().includes(search) || r.designation?.toLowerCase().includes(search) || r.email?.toLowerCase().includes(search));
          if (branch && branch !== "All Branches") rows = rows.filter((r: any) => r.branch === branch);
          if (role) rows = rows.filter((r: any) => r.role?.toLowerCase().includes(role.toLowerCase()) || r.designation?.toLowerCase().includes(role.toLowerCase()));
          if (status) rows = rows.filter((r: any) => r.status === status);
          const total = rows.length;
          rows = rows.slice(offset, offset + limit);
          return json({ success: true, data: rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
        } else {
          let where = " WHERE 1=1";
          const params: any[] = [];
          if (search) {
            where += " AND (name LIKE ? OR role LIKE ? OR designation LIKE ? OR email LIKE ?)";
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
          }
          if (branch && branch !== "All Branches") {
            where += " AND branch = ?";
            params.push(branch);
          }
          if (role) {
            where += " AND (role LIKE ? OR designation LIKE ?)";
            params.push(`%${role}%`, `%${role}%`);
          }
          if (status) {
            where += " AND status = ?";
            params.push(status);
          }
          const cnt: any = await db.queryOne(`SELECT COUNT(*) as total FROM employees${where}`, params);
          const rows = await db.query(`SELECT * FROM employees${where} ORDER BY id ASC LIMIT ? OFFSET ?`, [...params, limit, offset]);
          return json({ success: true, data: rows, pagination: { page, limit, total: cnt.total, totalPages: Math.ceil(cnt.total / limit) } });
        }
      }

      if (method === "POST") {
        const userPayload = auth.authMiddleware(req);
        const body = await parseBody(req);
        const data = v.parseOrThrow(v.employeeSchema, body);
        const isMem = db.isMemoryMode();

        // RBAC enforcement:
        // Superadmin: can add branch, admin, staff for any branch.
        // Branch admin: CANNOT add super_admin or branch_admin; can ONLY add staff for their own branch!
        if (userPayload) {
          if (userPayload.role === "branch_admin") {
            const requestedRole = (data.role || "").toLowerCase();
            const requestedDesig = (data.designation || "").toLowerCase();
            if (
              requestedRole === "super_admin" ||
              requestedRole === "branch_admin" ||
              requestedRole.includes("admin") ||
              requestedDesig.includes("admin") ||
              requestedDesig.includes("head")
            ) {
              return errJson(403, "Access restricted: Branch Admins cannot appoint Admins. Only Super Admin has this privilege.");
            }
            if (userPayload.branch && data.branch !== userPayload.branch) {
              return errJson(403, `Access restricted: Branch Admins can only add staff for their assigned branch (${userPayload.branch}).`);
            }
          } else if (userPayload.role !== "super_admin") {
            return errJson(403, "Access restricted: Only Administrators can add employees.");
          }
        }

        // 1. Determine system access role: 'super_admin' | 'branch_admin' | 'staff'
        let sysRole = "staff";
        const roleLower = (data.role || "").toLowerCase();
        if (roleLower === "super_admin" || roleLower.includes("super admin")) sysRole = "super_admin";
        else if (roleLower === "branch_admin" || roleLower.includes("branch admin") || roleLower.includes("head")) sysRole = "branch_admin";
        else sysRole = "staff";

        // 2. Determine designation (job title)
        let designation = (data.designation || "").trim();
        if (!designation) {
          if (sysRole === "branch_admin") designation = "Branch Head / Branch Manager";
          else if (sysRole === "super_admin") designation = "Super Admin / Headquarters";
          else designation = data.role || "Staff Member";
        }

        // 3. Resolve reports_to if empty
        let reportsTo = data.reports_to;
        if (!reportsTo && sysRole !== "super_admin") {
          if (isMem) {
            const branches = db.memList("branches");
            const b = branches.find((br: any) => br.name === data.branch);
            reportsTo = b?.head ? `${b.head} (Branch Admin · ${data.branch})` : `Branch Admin · ${data.branch}`;
          } else {
            const branchRow: any = await db.queryOne("SELECT head FROM branches WHERE name = ?", [data.branch]);
            reportsTo = branchRow?.head ? `${branchRow.head} (Branch Admin · ${data.branch})` : `Branch Admin · ${data.branch}`;
          }
        }

        // 4. Create or sync login account in `users`
        let userId: number | null = null;
        const shouldCreateLogin = data.create_login !== false && !!data.email;
        if (shouldCreateLogin) {
          const plainPassword = data.password?.trim() || (sysRole === "branch_admin" ? "admin123" : "staff123");
          const passwordHash = await auth.hashPassword(plainPassword);

          if (isMem) {
            let existingUser = db.memList("users").find((u: any) => u.email === data.email);
            if (existingUser) {
              existingUser = db.memUpdate("users", existingUser.id, {
                name: data.name,
                role: sysRole,
                designation: designation,
                branch: data.branch,
                reports_to: reportsTo,
                phone: data.phone || existingUser.phone,
                password_hash: passwordHash
              });
              userId = existingUser.id;
            } else {
              const newUser = db.memCreate("users", {
                name: data.name,
                email: data.email,
                password_hash: passwordHash,
                role: sysRole,
                designation: designation,
                branch: data.branch,
                reports_to: reportsTo,
                phone: data.phone || "",
                status: "Active"
              });
              userId = newUser.id;
            }
          } else {
            const existingUser: any = await db.queryOne("SELECT id FROM users WHERE email = ?", [data.email]);
            if (existingUser) {
              await db.execute(
                "UPDATE users SET name=?, password_hash=?, role=?, designation=?, branch=?, reports_to=?, phone=? WHERE id=?",
                [data.name, passwordHash, sysRole, designation, data.branch, reportsTo, data.phone || "", existingUser.id]
              );
              userId = existingUser.id;
            } else {
              const res = await db.execute(
                "INSERT INTO users (name, email, password_hash, role, designation, branch, reports_to, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active')",
                [data.name, data.email, passwordHash, sysRole, designation, data.branch, reportsTo, data.phone || ""]
              );
              userId = (res as any).insertId;
            }
          }
        }

        // 5. If branch_admin, also update head in `branches` table
        if (sysRole === "branch_admin") {
          if (isMem) {
            const br = (db.memList("branches") || []).find((b: any) => b.name === data.branch);
            if (br) db.memUpdate("branches", br.id, { head: data.name });
          } else {
            await db.execute("UPDATE branches SET head=? WHERE name=?", [data.name, data.branch]);
          }
        }

        // 6. Create record in `employees`
        let row: any;
        if (isMem) {
          row = db.memCreate("employees", {
            name: data.name,
            email: data.email || null,
            phone: data.phone || null,
            role: sysRole,
            designation: designation,
            branch: data.branch,
            reports_to: reportsTo,
            user_id: userId,
            status: data.status || "Active",
            joined_date: new Date().toISOString().slice(0, 10)
          });
        } else {
          const res = await db.execute(
            "INSERT INTO employees (name, email, phone, role, designation, branch, reports_to, user_id, status, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())",
            [data.name, data.email || null, data.phone || null, sysRole, designation, data.branch, reportsTo, userId, data.status || "Active"]
          );
          row = await db.queryOne("SELECT * FROM employees WHERE id = ?", [(res as any).insertId]);
        }

        return json({
          success: true,
          data: row,
          message: shouldCreateLogin
            ? `${sysRole === "branch_admin" ? "Branch Admin appointed" : "Staff added under " + reportsTo}. Login credentials created for ${data.email}.`
            : `${sysRole === "branch_admin" ? "Branch Admin appointed" : "Staff added under " + reportsTo}.`
        }, 201);
      }
    }

    const mEmp = path.match(/^\/api\/employees\/(\d+)$/);
    if (mEmp) {
      const id = parseInt(mEmp[1], 10);
      const isMem = db.isMemoryMode();

      if (method === "GET") {
        const row = isMem ? db.memGet("employees", id) : await db.queryOne("SELECT * FROM employees WHERE id=?", [id]);
        if (!row) return errJson(404, "Employee not found");
        return json({ success: true, data: row });
      }

      if (method === "PUT" || method === "PATCH") {
        const userPayload = auth.authMiddleware(req);
        const body: any = await parseBody(req);

        // RBAC check: Branch admin cannot elevate role
        if (userPayload && userPayload.role === "branch_admin") {
          if (body.role && (body.role === "super_admin" || body.role === "branch_admin")) {
            return errJson(403, "Access restricted: Branch Admins cannot elevate users to Admin roles.");
          }
        }

        if (isMem) {
          const upd = db.memUpdate("employees", id, body);
          if (!upd) return errJson(404, "Not found");
          return json({ success: true, data: upd });
        } else {
          const fields = [];
          const vals: any[] = [];
          for (const k of ["name", "email", "phone", "role", "designation", "branch", "reports_to", "status"]) {
            if (body[k] !== undefined) {
              fields.push(`${k}=?`);
              vals.push(body[k]);
            }
          }
          if (!fields.length) return errJson(400, "No fields to update");
          vals.push(id);
          await db.execute(`UPDATE employees SET ${fields.join(",")} WHERE id=?`, vals);

          // If password was sent, update user login
          if (body.password && body.email) {
            const hash = await auth.hashPassword(body.password);
            await db.execute("UPDATE users SET password_hash=? WHERE email=?", [hash, body.email]);
          }

          // If designation or role updated, sync to users table
          if (body.email && (body.designation || body.role)) {
            const uFields: string[] = [];
            const uVals: any[] = [];
            if (body.designation) { uFields.push("designation=?"); uVals.push(body.designation); }
            if (body.role) { uFields.push("role=?"); uVals.push(body.role); }
            uVals.push(body.email);
            await db.execute(`UPDATE users SET ${uFields.join(",")} WHERE email=?`, uVals);
          }

          const row = await db.queryOne("SELECT * FROM employees WHERE id=?", [id]);
          return json({ success: true, data: row });
        }
      }

      if (method === "DELETE") {
        const userPayload = auth.authMiddleware(req);
        if (userPayload && userPayload.role !== "super_admin" && userPayload.role !== "branch_admin") {
          return errJson(403, "Access restricted: Only Administrators can delete staff members.");
        }

        if (isMem) {
          const emp = db.memGet("employees", id);
          if (!emp) return errJson(404, "Not found");
          db.memDelete("employees", id);
          if (emp.user_id) db.memDelete("users", emp.user_id);
        } else {
          const emp: any = await db.queryOne("SELECT user_id, email, branch FROM employees WHERE id=?", [id]);
          if (!emp) return errJson(404, "Not found");
          if (userPayload && userPayload.role === "branch_admin" && userPayload.branch && emp.branch !== userPayload.branch) {
            return errJson(403, "Branch Admins can only delete staff members from their own branch.");
          }
          await db.execute("DELETE FROM employees WHERE id=?", [id]);
          if (emp.user_id) {
            // Check if super_admin before deleting user
            const user: any = await db.queryOne("SELECT role FROM users WHERE id=?", [emp.user_id]);
            if (user && user.role !== "super_admin") {
              await db.execute("DELETE FROM users WHERE id=?", [emp.user_id]);
            }
          }
        }
        return json({ success: true, message: "Staff member deleted successfully" });
      }
    }


    // APPROVALS
    if(path==="/api/approvals"){
      if(method==="GET"){
        const {page,limit,offset}=pagination(url);
        const isMem=db.isMemoryMode();
        if(isMem){
          let rows=db.memList("approvals");
          const total=rows.length; rows=rows.slice(offset, offset+limit);
          // attach steps
          const withSteps=rows.map((ap:any)=>({ ...ap, steps: db.memList("approval_steps").filter((s:any)=>s.approval_id===ap.id).sort((a:any,b:any)=>a.step_order-b.step_order) }));
          return json({ success:true, data:withSteps, pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}});
        } else {
          const cnt:any=await db.queryOne("SELECT COUNT(*) as total FROM approvals");
          const rows=await db.query("SELECT * FROM approvals ORDER BY id DESC LIMIT ? OFFSET ?",[limit, offset]);
          for(const r of rows){ (r as any).steps = await db.query("SELECT * FROM approval_steps WHERE approval_id=? ORDER BY step_order ASC",[r.id]); }
          return json({ success:true, data:rows, pagination:{page,limit,total:cnt.total,totalPages:Math.ceil(cnt.total/limit)}});
        }
      }
      if(method==="POST"){
        const body=await parseBody(req);
        const data=v.parseOrThrow(v.approvalSchema,body);
        const code=body.code||genCode("REIMB");
        const amountVal = (data.amount_value != null ? data.amount_value : (parseInt(data.amount.replace(/\D/g,""),10) || 0));
        const isMem=db.isMemoryMode();

        // Dynamically resolve real Branch Admin, Finance Lead, Director, CEO from database:
        let branchAdmin: any;
        let financeLead: any;
        let directorLead: any;
        let ceoLead: any;

        if (isMem) {
          branchAdmin = db.memList("employees").find((e: any) => (e.branch === data.branch || data.branch.includes(e.branch)) && (e.role?.includes("Branch Admin") || e.role?.includes("branch_admin")));
          financeLead = db.memList("employees").find((e: any) => e.role?.toLowerCase().includes("finance"));
          directorLead = db.memList("employees").find((e: any) => e.role?.toLowerCase().includes("director"));
          ceoLead = db.memList("employees").find((e: any) => e.role?.toLowerCase().includes("super admin") || e.role?.toLowerCase().includes("ceo"));
        } else {
          branchAdmin = await db.queryOne("SELECT * FROM employees WHERE (branch = ? OR ? LIKE CONCAT('%', branch, '%')) AND (role LIKE '%Branch Admin%' OR role LIKE '%branch_admin%') LIMIT 1", [data.branch, data.branch]);
          if (!branchAdmin) {
            branchAdmin = await db.queryOne("SELECT * FROM users WHERE (branch = ? OR ? LIKE CONCAT('%', branch, '%')) AND role = 'branch_admin' LIMIT 1", [data.branch, data.branch]);
          }
          financeLead = await db.queryOne("SELECT * FROM employees WHERE role LIKE '%finance%' LIMIT 1");
          directorLead = await db.queryOne("SELECT * FROM employees WHERE role LIKE '%director%' LIMIT 1");
          ceoLead = await db.queryOne("SELECT * FROM employees WHERE role LIKE '%super admin%' OR role LIKE '%ceo%' LIMIT 1");
        }

        const bAdminName = branchAdmin?.name || (data.branch.includes("Delhi") ? "Karan Mehta" : data.branch.includes("Bengaluru") ? "Divya Rao" : data.branch.includes("Hyderabad") ? "Rahul Reddy" : "Rahul Deshmukh");
        const bAdminEmail = branchAdmin?.email || (data.branch.includes("Delhi") ? "delhi.admin@uniquesta.com" : data.branch.includes("Bengaluru") ? "bangalore.admin@uniquesta.com" : data.branch.includes("Hyderabad") ? "hyderabad.admin@uniquesta.com" : "mumbai.admin@uniquesta.com");
        const bAdminRole = `Branch Manager · ${data.branch.split("·")[0].trim()}`;
        const bAdminInitials = bAdminName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

        const finName = financeLead?.name || "Anjali Kapoor";
        const finRole = "Finance · AP Lead";
        const finInitials = finName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

        const dirName = directorLead?.name || "Vivek Ramanathan";
        const dirRole = "Director · Operations";
        const dirInitials = dirName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

        const ceoName = ceoLead?.name || "Mohammad Iqbal";
        const ceoRole = "CEO · Executive Sign-off";
        const ceoInitials = ceoName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

        const submitter = data.submitted_by || "Meera Shah";
        const subInitials = submitter.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

        let row:any;
        if(isMem){
          row=db.memCreate("approvals",{ code, ...data, amount_value:amountVal, submitted_by:submitter, submitted_date: new Date().toLocaleDateString("en-IN") + " · " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), period:data.period||"", branch:data.branch, attachments:data.attachments??1, status:`Pending ${bAdminName} Approval`, current_stage:1 });
          const steps=[
            { approval_id:row.id, name:submitter, role:"Employee Submitter", initials:subInitials, status:"approved", time:new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" }), comment:body.notes||"Submitted expense claim with receipts.", step_order:0 },
            { approval_id:row.id, name:bAdminName, role:bAdminRole, initials:bAdminInitials, status:"current", time:"Active Review", comment:"", step_order:1 },
            { approval_id:row.id, name:finName, role:finRole, initials:finInitials, status:"upcoming", time:"Awaiting Branch Head", comment:"", step_order:2 },
            { approval_id:row.id, name:dirName, role:dirRole, initials:dirInitials, status:"upcoming", time:"Awaiting Finance", comment:"", step_order:3 },
            { approval_id:row.id, name:ceoName, role:ceoRole, initials:ceoInitials, status:"upcoming", time:"Awaiting Director", comment:"", step_order:4 },
            { approval_id:row.id, name:"Payment Released", role:"Finance · Payouts", initials:"₹", status:"released", time:"Est. 48h after CEO", comment:"NEFT direct transfer upon CEO sign-off.", step_order:5 },
          ];
          steps.forEach(s=> db.memCreate("approval_steps",s));
          row.steps=db.memList("approval_steps").filter((s:any)=>s.approval_id===row.id);
        } else {
          const res=await db.execute("INSERT INTO approvals (code,title,amount,amount_value,category,submitted_by,submitted_date,period,branch,attachments,status,current_stage) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",[code,data.title,data.amount,amountVal,data.category,submitter,new Date().toLocaleString("en-IN"),data.period||"",data.branch,data.attachments??1,`Pending ${bAdminName} Approval`,1]);
          const newId = (res as any).insertId;

          const steps = [
            [newId, submitter, "Employee Submitter", subInitials, "approved", new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" }), body.notes || "Submitted expense claim with attached bills.", 0],
            [newId, bAdminName, bAdminRole, bAdminInitials, "current", "Active Review", "", 1],
            [newId, finName, finRole, finInitials, "upcoming", "Awaiting Branch Head", "", 2],
            [newId, dirName, dirRole, dirInitials, "upcoming", "Awaiting Finance", "", 3],
            [newId, ceoName, ceoRole, ceoInitials, "upcoming", "Awaiting Director", "", 4],
            [newId, "Payment Released", "Finance · Payouts", "₹", "released", "Est. 48h after CEO", "NEFT direct transfer upon CEO sign-off.", 5],
          ];

          for (const s of steps) {
            await db.execute("INSERT INTO approval_steps (approval_id,name,role,initials,status,time,comment,step_order) VALUES (?,?,?,?,?,?,?,?)", s);
          }

          // Notify Branch Manager dynamically using their real email
          await db.execute("INSERT INTO notifications (user_email, user_role, title, message, type, reference_id, sender_name) VALUES (?, ?, ?, ?, ?, ?, ?)", [
            bAdminEmail, "branch_admin", `New Expense Claim from ${submitter}`, `${submitter} submitted ${code} (${data.amount}) for ${data.title}. Awaiting your review.`, "approval", code, submitter
          ]);

          row = await db.queryOne("SELECT * FROM approvals WHERE id=?", [newId]);
          row.steps = await db.query("SELECT * FROM approval_steps WHERE approval_id=? ORDER BY step_order ASC", [newId]);
        }
        return json({ success:true, data:row}, 201);
      }
    }

    // PASS / APPROVE / FORWARD TO NEXT LEVEL WITH MESSAGE (e.g. Director -> CEO)
    const mAprPass = path.match(/^\/api\/approvals\/([^\/]+)\/pass$/);
    if (mAprPass && method === "POST") {
      const codeOrId = mAprPass[1];
      const body = await parseBody(req);
      const action = body.action || "approve"; // 'approve' | 'send_back' | 'reject'
      const message = (body.message || "").trim();
      const approverName = body.approver_name || "Approver";
      const approverRole = body.approver_role || "Executive";
      const isMem = db.isMemoryMode();

      let ap: any;
      if (isMem) {
        ap = db.memGet("approvals", codeOrId) ?? db.memList("approvals").find((a: any) => a.code === codeOrId) ?? db.memGet("approvals", parseInt(codeOrId, 10));
      } else {
        ap = /^\d+$/.test(codeOrId) ? await db.queryOne("SELECT * FROM approvals WHERE id=?", [codeOrId]) : await db.queryOne("SELECT * FROM approvals WHERE code=?", [codeOrId]);
      }
      if (!ap) return errJson(404, "Approval not found");

      let steps: any[];
      if (isMem) {
        steps = db.memList("approval_steps").filter((s: any) => s.approval_id === ap.id).sort((a: any, b: any) => a.step_order - b.step_order);
      } else {
        steps = await db.query("SELECT * FROM approval_steps WHERE approval_id=? ORDER BY step_order ASC", [ap.id]);
      }

      const activeIdx = steps.findIndex((s: any) => s.status === "current");
      const activeStep = activeIdx >= 0 ? steps[activeIdx] : steps[ap.current_stage || 1];
      if (!activeStep) return errJson(400, "No active approval stage found for this application.");

      // Turn authorization check: ONLY the authority whose turn it currently is can approve/reject/send back
      const reqRole = (body.approver_role || "").toLowerCase();
      const reqEmail = (body.user_email || "").toLowerCase();
      const stRole = (activeStep.role || "").toLowerCase();
      const stName = (activeStep.name || "").toLowerCase();

      let isTurn = false;
      if (stRole.includes("ceo") || stName.includes("iqbal")) {
        isTurn = reqRole.includes("ceo") || reqRole === "super_admin" || reqEmail.includes("ceo") || reqEmail === "admin@uniquesta.com";
      } else if (stRole.includes("director") || stName.includes("vivek")) {
        isTurn = reqRole.includes("director") || reqEmail.includes("director");
      } else if (stRole.includes("branch manager") || stRole.includes("branch admin") || stName.includes("deshmukh") || stName.includes("mehta")) {
        isTurn = reqRole.includes("branch") || reqEmail.includes("admin");
      } else if (stRole.includes("finance") || stName.includes("anjali")) {
        isTurn = reqRole.includes("finance") || reqEmail.includes("finance");
      }

      if (!isTurn) {
        return errJson(403, `It is not your turn to act on this application. Currently awaiting: ${activeStep.name} (${activeStep.role}).`);
      }

      const nowTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " · " + new Date().toLocaleDateString("en-IN");

      if (action === "approve") {
        const nextIdx = (activeIdx >= 0 ? activeIdx : ap.current_stage) + 1;
        const nextStep = steps[nextIdx];

        // 1. Update current step
        const finalMsg = message || `Approved and forwarded to ${nextStep ? nextStep.name : "payout"}.`;
        if (isMem) {
          db.memUpdate("approval_steps", activeStep.id, {
            name: approverName || activeStep.name,
            role: approverRole || activeStep.role,
            status: "approved",
            comment: finalMsg,
            time: nowTime
          });
        } else {
          await db.execute("UPDATE approval_steps SET name=?, role=?, status='approved', comment=?, time=? WHERE id=?", [approverName || activeStep.name, approverRole || activeStep.role, finalMsg, nowTime, activeStep.id]);
        }

        // 2. Advance to next step or finish
        if (nextStep && nextStep.step_order < 5) {
          if (isMem) {
            db.memUpdate("approval_steps", nextStep.id, { status: "current", time: "Active Review" });
          } else {
            await db.execute("UPDATE approval_steps SET status='current', time='Active Review' WHERE id=?", [nextStep.id]);
          }

          let newStatus = `Pending ${nextStep.role} Approval`;
          let notifyEmail = "admin@uniquesta.com";
          let notifyRole = "super_admin";

          const nRole = nextStep.role.toLowerCase();
          if (nRole.includes("ceo")) {
            newStatus = "Pending CEO Approval";
            notifyEmail = "admin@uniquesta.com";
            notifyRole = "super_admin";
          } else if (nRole.includes("director")) {
            newStatus = "Pending Director Approval";
            notifyEmail = "director@uniquesta.com";
            notifyRole = "director";
          } else if (nRole.includes("finance")) {
            newStatus = "Pending Finance Approval";
            notifyEmail = "anjali.finance@uniquesta.com";
            notifyRole = "finance";
          }

          if (isMem) {
            db.memUpdate("approvals", ap.id, { status: newStatus, current_stage: nextIdx });
          } else {
            await db.execute("UPDATE approvals SET status=?, current_stage=? WHERE id=?", [newStatus, nextIdx, ap.id]);

            // Dispatch in-app notification to the next approver (e.g. CEO or Director)
            await db.execute(
              "INSERT INTO notifications (user_email, user_role, title, message, type, reference_id, sender_name) VALUES (?, ?, ?, ?, 'approval', ?, ?)",
              [
                notifyEmail,
                notifyRole,
                `Expense Approval Passed: ${ap.code} (${ap.amount})`,
                `${approverName} (${approverRole}) forwarded ${ap.title} to you with message: "${finalMsg}"`,
                ap.code,
                approverName
              ]
            );
          }

          return json({
            success: true,
            message: `Approved and passed to ${nextStep.name} (${nextStep.role})! Notification dispatched.`,
            nextStage: nextStep.name
          });
        } else {
          // Final stage (CEO approved -> Payment Released)
          if (isMem) {
            db.memUpdate("approvals", ap.id, { status: "CEO Approved · Ready for Payout", current_stage: 5 });
            if (nextStep) db.memUpdate("approval_steps", nextStep.id, { status: "released", time: "Queued for Payout" });
          } else {
            await db.execute("UPDATE approvals SET status='CEO Approved · Ready for Payout', current_stage=5 WHERE id=?", [ap.id]);
            if (nextStep) await db.execute("UPDATE approval_steps SET status='released', time='Queued for Payout' WHERE id=?", [nextStep.id]);

            await db.execute(
              "INSERT INTO notifications (user_email, user_role, title, message, type, reference_id, sender_name) VALUES (?, 'finance', ?, ?, 'approval', ?, ?)",
              [
                "anjali.finance@uniquesta.com",
                `CEO Approved: Payout Ready for ${ap.code}`,
                `CEO Mohammad Iqbal has authorized release of ${ap.amount} for ${ap.title}. Proceed with NEFT payment.`,
                ap.code,
                approverName
              ]
            );
          }
          return json({
            success: true,
            message: `CEO Final Sign-off complete! Payout release queued for ${ap.code}.`,
            nextStage: "Payment Released"
          });
        }
      } else if (action === "reject") {
        const rejectMsg = message || "Expense request rejected by reviewer.";
        if (isMem) {
          db.memUpdate("approval_steps", activeStep.id, { status: "rejected", comment: rejectMsg, time: nowTime });
          db.memUpdate("approvals", ap.id, { status: "Rejected" });
        } else {
          await db.execute("UPDATE approval_steps SET status='rejected', comment=?, time=? WHERE id=?", [rejectMsg, nowTime, activeStep.id]);
          await db.execute("UPDATE approvals SET status='Rejected' WHERE id=?", [ap.id]);
          await db.execute(
            "INSERT INTO notifications (user_email, user_role, title, message, type, reference_id, sender_name) VALUES (?, 'employee', ?, ?, 'alert', ?, ?)",
            [
              ap.submitted_by ? `${ap.submitted_by.toLowerCase().replace(/[^a-z]/g, "")}@uniquesta.com` : "meera.counselor@uniquesta.com",
              `Expense Request Rejected: ${ap.code}`,
              `${approverName} rejected your reimbursement request (${ap.amount}): "${rejectMsg}"`,
              ap.code,
              approverName
            ]
          );
        }
        return json({ success: true, message: `Request ${ap.code} rejected.` });
      } else if (action === "send_back") {
        const sendBackMsg = message || "Sent back for receipt clarification.";
        const prevIdx = Math.max(0, (activeIdx >= 0 ? activeIdx : ap.current_stage) - 1);
        const prevStep = steps[prevIdx];
        if (isMem) {
          db.memUpdate("approval_steps", activeStep.id, { status: "pending", comment: sendBackMsg });
          if (prevStep) db.memUpdate("approval_steps", prevStep.id, { status: "current", time: "Action Required" });
          db.memUpdate("approvals", ap.id, { status: "Revision Requested", current_stage: prevIdx });
        } else {
          await db.execute("UPDATE approval_steps SET status='pending', comment=? WHERE id=?", [sendBackMsg, activeStep.id]);
          if (prevStep) await db.execute("UPDATE approval_steps SET status='current', time='Action Required' WHERE id=?", [prevStep.id]);
          await db.execute("UPDATE approvals SET status='Revision Requested', current_stage=? WHERE id=?", [prevIdx, ap.id]);
        }
        return json({ success: true, message: `Request sent back with message: "${sendBackMsg}".` });
      }
    }

    const mApr=path.match(/^\/api\/approvals\/([^\/]+)$/);
    if(mApr && !path.includes("/steps") && !path.includes("/pass")){
      const key=mApr[1];
      const find=async():Promise<any>=>{ if(db.isMemoryMode()){ return db.memGet("approvals",key) ?? db.memList("approvals").find((a:any)=>a.code===key) ?? ( /^\d+$/.test(key)? db.memGet("approvals",parseInt(key,10)):null); } else { if(/^\d+$/.test(key)) return await db.queryOne("SELECT * FROM approvals WHERE id=?",[key]); else return await db.queryOne("SELECT * FROM approvals WHERE code=?",[key]); } };
      if(method==="GET"){ const row=await find(); if(!row) return errJson(404,"Approval not found"); let steps:any[]; if(db.isMemoryMode()) steps=db.memList("approval_steps").filter((s:any)=>s.approval_id===row.id).sort((a:any,b:any)=>a.step_order-b.step_order); else steps=await db.query("SELECT * FROM approval_steps WHERE approval_id=? ORDER BY step_order ASC",[row.id]); return json({ success:true, data:{ ...row, steps }});}
      if(method==="PUT"||method==="PATCH"){ const body:any=await parseBody(req); const existing=await find(); if(!existing) return errJson(404,"Not found"); if(db.isMemoryMode()){ const upd=db.memUpdate("approvals",existing.id,body); return json({ success:true, data:upd}); } else { const fields=[]; const vals:any[]=[]; for(const k of ["title","amount","category","branch","status","current_stage"]) if(body[k]!==undefined){fields.push(`${k}=?`); vals.push(body[k]);} if(!fields.length) return errJson(400,"No fields"); vals.push(existing.id); await db.execute(`UPDATE approvals SET ${fields.join(",")} WHERE id=?`,vals); const row=await db.queryOne("SELECT * FROM approvals WHERE id=?",[existing.id]); return json({ success:true, data:row}); } }
      if(method==="DELETE"){ const existing=await find(); if(!existing) return errJson(404,"Not found"); if(db.isMemoryMode()){ db.memDelete("approvals",existing.id); // delete steps
        db.memList("approval_steps").filter((s:any)=>s.approval_id===existing.id).forEach((s:any)=>db.memDelete("approval_steps",s.id)); } else await db.execute("DELETE FROM approvals WHERE id=?",[existing.id]); return json({ success:true, message:"Deleted"}); }
    }
    // approval steps update
    const mAprStep=path.match(/^\/api\/approvals\/([^\/]+)\/steps\/(\d+)$/);
    if(mAprStep && (method==="PUT"||method==="PATCH")){
      const apKey=mAprStep[1]; const stepId=parseInt(mAprStep[2],10);
      const body=await parseBody(req);
      const data=v.parseOrThrow(v.approvalStepUpdateSchema, body);
      const isMem=db.isMemoryMode();
      // find approval
      let ap:any;
      if(isMem) ap=db.memGet("approvals",apKey) ?? db.memList("approvals").find((a:any)=>a.code===apKey) ?? db.memGet("approvals", parseInt(apKey,10));
      else ap=/^\d+$/.test(apKey)? await db.queryOne("SELECT * FROM approvals WHERE id=?",[apKey]) : await db.queryOne("SELECT * FROM approvals WHERE code=?",[apKey]);
      if(!ap) return errJson(404,"Approval not found");
      let step:any;
      if(isMem) step=db.memGet("approval_steps",stepId);
      else step=await db.queryOne("SELECT * FROM approval_steps WHERE id=? AND approval_id=?",[stepId, ap.id]);
      if(!step) return errJson(404,"Step not found");
      if(isMem){ const upd=db.memUpdate("approval_steps",stepId,{ status:data.status, comment:data.comment??step.comment}); return json({ success:true, data:upd}); }
      else { await db.execute("UPDATE approval_steps SET status=?, comment=? WHERE id=?",[data.status, data.comment??step.comment, stepId]); const upd=await db.queryOne("SELECT * FROM approval_steps WHERE id=?",[stepId]); return json({ success:true, data:upd}); }
    }

    // ═══════════════════════════════════════════════════════════════
    // NOTIFICATIONS API
    // ═══════════════════════════════════════════════════════════════
    if (path === "/api/notifications") {
      if (method === "GET") {
        const email = qp(url, "email", "").trim();
        const isMem = db.isMemoryMode();
        if (isMem) {
          let list = db.memList("notifications") || [];
          if (email) {
            list = list.filter((n: any) => !n.user_email || n.user_email === email || (email === "admin@uniquesta.com" && n.user_email === "ceo@uniquesta.com"));
          }
          const unreadCount = list.filter((n: any) => !n.read_status).length;
          return json({ success: true, data: list, unreadCount });
        } else {
          let where = "";
          const params: any[] = [];
          if (email) {
            where = " WHERE user_email = ? OR (user_email = 'ceo@uniquesta.com' AND ? = 'admin@uniquesta.com') OR user_email = 'all'";
            params.push(email, email);
          }
          const rows = await db.query(`SELECT * FROM notifications${where} ORDER BY id DESC LIMIT 50`, params);
          const unread = await db.queryOne(`SELECT COUNT(*) as c FROM notifications${where ? where + " AND read_status = 0" : " WHERE read_status = 0"}`, params);
          return json({ success: true, data: rows, unreadCount: unread?.c || 0 });
        }
      }
    }

    const mNotifRead = path.match(/^\/api\/notifications\/(\d+)\/read$/);
    if (mNotifRead && method === "PUT") {
      const id = parseInt(mNotifRead[1], 10);
      if (db.isMemoryMode()) {
        db.memUpdate("notifications", id, { read_status: true });
      } else {
        await db.execute("UPDATE notifications SET read_status = 1 WHERE id = ?", [id]);
      }
      return json({ success: true, message: "Notification marked read" });
    }

    if (path === "/api/notifications/mark-all-read" && method === "POST") {
      const body = await parseBody(req);
      const email = body.email || "";
      if (db.isMemoryMode()) {
        const list = db.memList("notifications") || [];
        list.forEach((n: any) => { if (!email || n.user_email === email) n.read_status = true; });
      } else {
        if (email) await db.execute("UPDATE notifications SET read_status = 1 WHERE user_email = ? OR (user_email = 'ceo@uniquesta.com' AND ? = 'admin@uniquesta.com')", [email, email]);
        else await db.execute("UPDATE notifications SET read_status = 1");
      }
      return json({ success: true, message: "All notifications marked read" });
    }

    // REFERRALS (partner)
    if(path==="/api/referrals"||path==="/api/partners/referrals"){
      if(method==="GET"){
        const {page,limit,offset}=pagination(url);
        const search=qp(url,"search","").toLowerCase();
        const isMem=db.isMemoryMode();
        if(isMem){
          let rows=db.memList("referral_students");
          if(search) rows=rows.filter((r:any)=>r.name.toLowerCase().includes(search)||r.email.toLowerCase().includes(search));
          const total=rows.length; rows=rows.slice(offset, offset+limit);
          return json({ success:true, data:rows, pagination:{page,limit,total,totalPages:Math.ceil(total/limit)}});
        } else {
          let where=""; const params:any[]=[];
          if(search){ where=" WHERE name LIKE ? OR email LIKE ?"; params.push(`%${search}%`,`%${search}%`);}
          const cnt:any=await db.queryOne(`SELECT COUNT(*) as total FROM referral_students${where}`,params);
          const rows=await db.query(`SELECT * FROM referral_students${where} ORDER BY id DESC LIMIT ? OFFSET ?`,[...params, limit, offset]);
          return json({ success:true, data:rows, pagination:{page,limit,total:cnt.total,totalPages:Math.ceil(cnt.total/limit)}});
        }
      }
      if(method==="POST"){
        const body=await parseBody(req);
        const data=v.parseOrThrow(v.referralSchema,body);
        const code=body.code||genCode("STU");
        const isMem=db.isMemoryMode();
        let row:any;
        if(isMem) row=db.memCreate("referral_students",{ code, ...data, status:data.status||"Application Submitted", stage:data.stage||"applications", referred_date: new Date().toISOString().slice(0,10), commission_est:data.commission_est||"₹ 50,000" });
        else { const res=await db.execute("INSERT INTO referral_students (code,name,email,country,university,program,intake,status,stage,referred_date,commission_est) VALUES (?,?,?,?,?,?,?,?,?,?,?)",[code,data.name,data.email,data.country,data.university,data.program,data.intake,data.status||"Application Submitted",data.stage||"applications",new Date().toISOString().slice(0,10),data.commission_est||"₹ 50,000"]); row=await db.queryOne("SELECT * FROM referral_students WHERE id=?",[(res as any).insertId]);}
        return json({ success:true, data:row},201);
      }
    }
    const mRef=path.match(/^\/api\/(?:referrals|partners\/referrals)\/([^\/]+)$/);
    if(mRef){
      const key=mRef[1];
      const find=async():Promise<any>=>{ if(db.isMemoryMode()){ return db.memGet("referral_students",key) ?? db.memList("referral_students").find((c:any)=>c.code===key) ?? ( /^\d+$/.test(key)? db.memGet("referral_students",parseInt(key,10)):null); } else { if(/^\d+$/.test(key)) return await db.queryOne("SELECT * FROM referral_students WHERE id=?",[key]); else return await db.queryOne("SELECT * FROM referral_students WHERE code=?",[key]); } };
      if(method==="GET"){ const row=await find(); if(!row) return errJson(404,"Referral not found"); return json({ success:true, data:row});}
      if(method==="PUT"||method==="PATCH"){ const body:any=await parseBody(req); const existing=await find(); if(!existing) return errJson(404,"Not found"); if(db.isMemoryMode()){ const upd=db.memUpdate("referral_students",existing.id,body); return json({ success:true, data:upd}); } else { const fields=[]; const vals:any[]=[]; for(const k of ["name","email","country","university","program","intake","status","stage","commission_est"]) if(body[k]!==undefined){fields.push(`${k}=?`); vals.push(body[k]);} if(!fields.length) return errJson(400,"No fields"); vals.push(existing.id); await db.execute(`UPDATE referral_students SET ${fields.join(",")} WHERE id=?`,vals); const row=await db.queryOne("SELECT * FROM referral_students WHERE id=?",[existing.id]); return json({ success:true, data:row}); } }
      if(method==="DELETE"){ const existing=await find(); if(!existing) return errJson(404,"Not found"); if(db.isMemoryMode()) db.memDelete("referral_students",existing.id); else await db.execute("DELETE FROM referral_students WHERE id=?",[existing.id]); return json({ success:true, message:"Deleted"}); }
    }

    // ═══════════════════════════════════════════════════════════════
    // B2B PARTNERS & PROFIT SHARING API (ADMIN CONTROL)
    // ═══════════════════════════════════════════════════════════════
    if (path === "/api/b2b-partners" || path.startsWith("/api/b2b-partners/")) {
      const userPayload = auth.authMiddleware(req);
      if (userPayload) {
        const role = (userPayload.role || "").toLowerCase();
        const email = (userPayload.email || "").toLowerCase();
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
        if (!isManagementOrAdmin) {
          return errJson(403, "Access restricted: Partner Profit Sharing is only available to Management & Administrators");
        }
      }
    }

    if (path === "/api/b2b-partners") {
      if (method === "GET") {
        const { page, limit, offset } = pagination(url);
        const search = qp(url, "search", "").toLowerCase();
        const branch = qp(url, "branch", "");
        const tier = qp(url, "tier", "");
        const status = qp(url, "status", "");
        const isMem = db.isMemoryMode();

        if (isMem) {
          let rows = db.memList("b2b_partners") || [];
          if (search) rows = rows.filter((p: any) => p.name?.toLowerCase().includes(search) || p.company_name?.toLowerCase().includes(search) || p.city?.toLowerCase().includes(search));
          if (branch && branch !== "All Branches") rows = rows.filter((p: any) => p.branch === branch);
          if (tier && tier !== "All Tiers") rows = rows.filter((p: any) => p.tier?.toLowerCase().includes(tier.toLowerCase()));
          if (status) rows = rows.filter((p: any) => p.status === status);

          const total = rows.length;
          const stats = {
            totalPartners: (db.memList("b2b_partners") || []).length,
            totalRevenue: (db.memList("b2b_partners") || []).reduce((acc: number, p: any) => acc + (parseInt(p.total_revenue, 10) || 0), 0),
            partnerEarnings: (db.memList("b2b_partners") || []).reduce((acc: number, p: any) => acc + (parseInt(p.partner_earnings, 10) || 0), 0),
            adminEarnings: (db.memList("b2b_partners") || []).reduce((acc: number, p: any) => acc + (parseInt(p.admin_earnings, 10) || 0), 0),
            payoutBalance: (db.memList("b2b_partners") || []).reduce((acc: number, p: any) => acc + (parseInt(p.payout_balance, 10) || 0), 0),
          };

          rows = rows.slice(offset, offset + limit);
          return json({ success: true, data: rows, stats, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
        } else {
          let where = " WHERE 1=1";
          const params: any[] = [];
          if (search) {
            where += " AND (company_name LIKE ? OR name LIKE ? OR city LIKE ? OR code LIKE ?)";
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
          }
          if (branch && branch !== "All Branches") {
            where += " AND branch = ?";
            params.push(branch);
          }
          if (tier && tier !== "All Tiers") {
            where += " AND tier LIKE ?";
            params.push(`%${tier}%`);
          }
          if (status) {
            where += " AND status = ?";
            params.push(status);
          }

          const cnt: any = await db.queryOne(`SELECT COUNT(*) as total FROM b2b_partners${where}`, params);
          const statRow: any = await db.queryOne(`SELECT 
            COUNT(*) as totalPartners,
            COALESCE(SUM(total_revenue), 0) as totalRevenue,
            COALESCE(SUM(partner_earnings), 0) as partnerEarnings,
            COALESCE(SUM(admin_earnings), 0) as adminEarnings,
            COALESCE(SUM(payout_balance), 0) as payoutBalance
            FROM b2b_partners`);

          const rows = await db.query(`SELECT * FROM b2b_partners${where} ORDER BY id ASC LIMIT ? OFFSET ?`, [...params, limit, offset]);

          return json({
            success: true,
            data: rows,
            stats: statRow,
            pagination: { page, limit, total: cnt.total, totalPages: Math.ceil(cnt.total / limit) }
          });
        }
      }

      if (method === "POST") {
        const body = await parseBody(req);
        const data = v.parseOrThrow(v.b2bPartnerSchema, body);
        const code = body.code || genCode("PRT");
        const partnerShare = data.partner_share_pct !== undefined ? data.partner_share_pct : 25.00;
        const adminShare = 100 - partnerShare;
        const isMem = db.isMemoryMode();

        const partnerData = {
          code,
          name: data.name,
          company_name: data.company_name,
          email: data.email,
          phone: data.phone,
          city: data.city,
          branch: data.branch || "Mumbai",
          profit_share_type: data.profit_share_type || "percentage",
          partner_share_pct: partnerShare,
          admin_share_pct: adminShare,
          flat_rate_amount: data.flat_rate_amount || 25000,
          tier: data.tier || `${partnerShare}% Partner Share`,
          status: data.status || "Active",
          total_students: 0,
          total_revenue: 0,
          partner_earnings: 0,
          admin_earnings: 0,
          payout_balance: 0,
          notes: data.notes || ""
        };

        if (isMem) {
          const created = db.memCreate("b2b_partners", partnerData);
          return json({ success: true, data: created }, 201);
        } else {
          const res = await db.execute(
            `INSERT INTO b2b_partners
             (code, name, company_name, email, phone, city, branch, profit_share_type, partner_share_pct, admin_share_pct, flat_rate_amount, tier, status, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              code, data.name, data.company_name, data.email, data.phone, data.city,
              partnerData.branch, partnerData.profit_share_type, partnerShare, adminShare,
              partnerData.flat_rate_amount, partnerData.tier, partnerData.status, partnerData.notes
            ]
          );
          const row = await db.queryOne("SELECT * FROM b2b_partners WHERE id = ?", [(res as any).insertId]);
          return json({ success: true, data: row }, 201);
        }
      }
    }

    // UPDATE PROFIT SHARE CONFIGURATION FOR A PARTNER
    const mPartnerProfit = path.match(/^\/api\/b2b-partners\/(\d+)\/profit-share$/);
    if (mPartnerProfit && (method === "PUT" || method === "PATCH")) {
      const id = parseInt(mPartnerProfit[1], 10);
      const body: any = await parseBody(req);
      const isMem = db.isMemoryMode();

      const partnerShare = parseFloat(body.partner_share_pct ?? 25);
      const adminShare = 100 - partnerShare;
      const profitType = body.profit_share_type || "percentage";
      const flatRate = parseInt(body.flat_rate_amount ?? 25000, 10);
      const tier = body.tier || `${partnerShare}% Profit Share`;

      if (isMem) {
        const existing = db.memGet("b2b_partners", id);
        if (!existing) return errJson(404, "Partner not found");

        const rev = parseInt(existing.total_revenue, 10) || 0;
        const newPartnerEarnings = Math.round(rev * (partnerShare / 100));
        const newAdminEarnings = rev - newPartnerEarnings;

        const updated = db.memUpdate("b2b_partners", id, {
          partner_share_pct: partnerShare,
          admin_share_pct: adminShare,
          profit_share_type: profitType,
          flat_rate_amount: flatRate,
          tier,
          partner_earnings: newPartnerEarnings,
          admin_earnings: newAdminEarnings
        });
        return json({ success: true, data: updated, message: `Profit share set to ${partnerShare}% Partner / ${adminShare}% UniQuesta` });
      } else {
        const existing: any = await db.queryOne("SELECT * FROM b2b_partners WHERE id = ?", [id]);
        if (!existing) return errJson(404, "Partner not found");

        const rev = parseInt(existing.total_revenue, 10) || 0;
        const newPartnerEarnings = Math.round(rev * (partnerShare / 100));
        const newAdminEarnings = rev - newPartnerEarnings;

        await db.execute(
          `UPDATE b2b_partners SET 
           partner_share_pct = ?, admin_share_pct = ?, profit_share_type = ?, flat_rate_amount = ?, tier = ?,
           partner_earnings = ?, admin_earnings = ?
           WHERE id = ?`,
          [partnerShare, adminShare, profitType, flatRate, tier, newPartnerEarnings, newAdminEarnings, id]
        );

        const row = await db.queryOne("SELECT * FROM b2b_partners WHERE id = ?", [id]);
        return json({ success: true, data: row, message: `Profit share set to ${partnerShare}% Partner / ${adminShare}% UniQuesta` });
      }
    }

    const mPartnerSingle = path.match(/^\/api\/b2b-partners\/(\d+)$/);
    if (mPartnerSingle) {
      const id = parseInt(mPartnerSingle[1], 10);
      const isMem = db.isMemoryMode();

      if (method === "GET") {
        const row = isMem ? db.memGet("b2b_partners", id) : await db.queryOne("SELECT * FROM b2b_partners WHERE id = ?", [id]);
        if (!row) return errJson(404, "Partner not found");
        return json({ success: true, data: row });
      }

      if (method === "PUT" || method === "PATCH") {
        const body: any = await parseBody(req);
        if (isMem) {
          const upd = db.memUpdate("b2b_partners", id, body);
          if (!upd) return errJson(404, "Partner not found");
          return json({ success: true, data: upd });
        } else {
          const fields = [];
          const vals: any[] = [];
          for (const k of ["name", "company_name", "email", "phone", "city", "branch", "profit_share_type", "partner_share_pct", "admin_share_pct", "flat_rate_amount", "tier", "status", "notes"]) {
            if (body[k] !== undefined) {
              fields.push(`${k} = ?`);
              vals.push(body[k]);
            }
          }
          if (!fields.length) return errJson(400, "No fields to update");
          vals.push(id);
          await db.execute(`UPDATE b2b_partners SET ${fields.join(",")} WHERE id = ?`, vals);
          const row = await db.queryOne("SELECT * FROM b2b_partners WHERE id = ?", [id]);
          return json({ success: true, data: row });
        }
      }

      if (method === "DELETE") {
        if (isMem) {
          if (!db.memDelete("b2b_partners", id)) return errJson(404, "Partner not found");
        } else {
          const r = await db.execute("DELETE FROM b2b_partners WHERE id = ?", [id]);
          if ((r as any).affectedRows === 0) return errJson(404, "Partner not found");
        }
        return json({ success: true, message: "Partner deleted" });
      }
    }

    // COMMISSIONS
    if(path==="/api/commissions"){
      if(method==="GET"){
        const isMem=db.isMemoryMode();
        const rows=isMem? db.memList("commissions") : await db.query("SELECT * FROM commissions ORDER BY id DESC");
        return json({ success:true, data:rows});
      }
      if(method==="POST"){
        const body:any=await parseBody(req);
        if(!body.student || !body.amount) return errJson(400,"student and amount required");
        const inv_id=body.inv_id||genCode("COMM");
        const isMem=db.isMemoryMode();
        let row:any;
        if(isMem) row=db.memCreate("commissions",{ inv_id, student:body.student, university:body.university||"", intake:body.intake||"", course_fee:body.course_fee||"", rate:body.rate||"", amount:body.amount, status:body.status||"Eligible", paid_date:body.paid_date||null, utr:body.utr||null });
        else { const res=await db.execute("INSERT INTO commissions (inv_id,student,university,intake,course_fee,rate,amount,status,paid_date,utr) VALUES (?,?,?,?,?,?,?,?,?,?)",[inv_id,body.student,body.university||"",body.intake||"",body.course_fee||"",body.rate||"",body.amount,body.status||"Eligible",body.paid_date||null,body.utr||null]); row=await db.queryOne("SELECT * FROM commissions WHERE id=?",[(res as any).insertId]);}
        return json({ success:true, data:row},201);
      }
    }

    // PAYMENT REQUESTS
    if(path==="/api/payment-requests"){
      if(method==="GET"){
        const isMem=db.isMemoryMode();
        const rows=isMem? db.memList("payment_requests") : await db.query("SELECT * FROM payment_requests ORDER BY id DESC");
        return json({ success:true, data:rows});
      }
      if(method==="POST"){
        const body:any=await parseBody(req);
        if(!body.amount) return errJson(400,"amount required");
        const req_id=body.req_id||genCode("PR");
        const isMem=db.isMemoryMode();
        let row:any;
        if(isMem) row=db.memCreate("payment_requests",{ req_id, date:body.date||new Date().toISOString().slice(0,10), amount:body.amount, bank:body.bank||"HDFC Bank (**** 4921)", status:body.status||"Processing", utr:body.utr||"Pending Finance Approval", notes:body.notes||"" });
        else { const res=await db.execute("INSERT INTO payment_requests (req_id,date,amount,bank,status,utr,notes) VALUES (?,?,?,?,?,?,?)",[req_id,body.date||new Date().toISOString().slice(0,10),body.amount,body.bank||"HDFC Bank (**** 4921)",body.status||"Processing",body.utr||"Pending Finance Approval",body.notes||null]); row=await db.queryOne("SELECT * FROM payment_requests WHERE id=?",[(res as any).insertId]);}
        return json({ success:true, data:row},201);
      }
    }

    // SETTINGS
    if(path==="/api/settings"){
      if(method==="GET"){
        const isMem=db.isMemoryMode();
        let row:any;
        if(isMem) row=db.memGet("settings",1) ?? { id:1, legal_name:"Uniquesta Overseas Pvt Ltd", support_email:"care@uniquesta.com", two_factor:true, whatsapp_notify:true };
        else row=await db.queryOne("SELECT * FROM settings WHERE id=1");
        if(!row) row={ id:1, legal_name:"Uniquesta Overseas Pvt Ltd", support_email:"care@uniquesta.com", two_factor:true, whatsapp_notify:true };
        return json({ success:true, data:row});
      }
      if(method==="PUT"||method==="PATCH"||method==="POST"){
        const body:any=await parseBody(req);
        const isMem=db.isMemoryMode();
        if(isMem){
          const existing=db.memGet("settings",1) ?? { id:1, legal_name:"Uniquesta Overseas Pvt Ltd", support_email:"care@uniquesta.com", two_factor:true, whatsapp_notify:true };
          const upd={ ...existing, legal_name:body.legal_name ?? existing.legal_name, support_email:body.support_email ?? existing.support_email, two_factor: body.two_factor ?? existing.two_factor, whatsapp_notify: body.whatsapp_notify ?? existing.whatsapp_notify };
          db.memCreate("settings", upd); // upsert
          // ensure get returns updated
          const tbl=db.getMemStore()["settings"]; if(tbl) tbl.set(1, upd);
          return json({ success:true, data:upd});
        } else {
          await db.execute("INSERT INTO settings (id,legal_name,support_email,two_factor,whatsapp_notify) VALUES (1,?,?,?,?) ON DUPLICATE KEY UPDATE legal_name=VALUES(legal_name), support_email=VALUES(support_email), two_factor=VALUES(two_factor), whatsapp_notify=VALUES(whatsapp_notify)",[body.legal_name||"Uniquesta Overseas Pvt Ltd", body.support_email||"care@uniquesta.com", body.two_factor?1:0, body.whatsapp_notify?1:0]);
          // if only partial, preserve
          if(body.legal_name===undefined || body.support_email===undefined){
            const row=await db.queryOne("SELECT * FROM settings WHERE id=1");
            // patch missing
            const patch:any={};
            if(body.legal_name!==undefined) patch.legal_name=body.legal_name;
            if(body.support_email!==undefined) patch.support_email=body.support_email;
            if(body.two_factor!==undefined) patch.two_factor=body.two_factor?1:0;
            if(body.whatsapp_notify!==undefined) patch.whatsapp_notify=body.whatsapp_notify?1:0;
            if(Object.keys(patch).length){
              const sets=Object.keys(patch).map(k=>`${k}=?`).join(",");
              await db.execute(`UPDATE settings SET ${sets} WHERE id=1`, Object.values(patch));
            }
          }
          const row=await db.queryOne("SELECT * FROM settings WHERE id=1");
          return json({ success:true, data:row});
        }
      }
    }

    // DASHBOARD STATS
    if(path==="/api/dashboard/stats" && method==="GET"){
      const isMem=db.isMemoryMode();
      let stats:any={};
      if(isMem){
        const students=db.memList("students").length;
        const leads=db.memList("leads").length;
        const apps=db.memList("applications").length;
        const invoices=db.memList("invoices");
        const revenue = invoices.filter((i:any)=>i.status==="Paid").reduce((a:any,c:any)=>a+ (parseInt(String(c.amount_value),10)||0),0);
        stats={ totalStudents: students, totalBranches: db.memList("branches").length||14, activeApplications: apps, offerLetters: apps, revenue: revenue, pendingApprovals: db.memList("approvals").length, employeeCount: db.memList("employees").length, totalLeads: leads };
      } else {
        const s:any=await db.queryOne("SELECT COUNT(*) as c FROM students");
        const l:any=await db.queryOne("SELECT COUNT(*) as c FROM leads");
        const a:any=await db.queryOne("SELECT COUNT(*) as c FROM applications");
        const b:any=await db.queryOne("SELECT COUNT(*) as c FROM branches");
        const e:any=await db.queryOne("SELECT COUNT(*) as c FROM employees");
        const ap:any=await db.queryOne("SELECT COUNT(*) as c FROM approvals");
        const rev:any=await db.queryOne("SELECT COALESCE(SUM(amount_value),0) as total FROM invoices WHERE status='Paid'");
        stats={ totalStudents:s.c, totalBranches:b.c, activeApplications:a.c, offerLetters:a.c, revenue:rev.total, pendingApprovals:ap.c, employeeCount:e.c, totalLeads:l.c };
      }
      // also include revenue trend, branch performance etc could be static
      return json({ success:true, data:stats });
    }

    // Reports
    if(path==="/api/reports" && method==="GET"){
      return json({ success:true, data:[
        { title:"Admissions Funnel", desc:"Lead → Enrolled conversion by branch", tag:"Sales" },
        { title:"Revenue by Destination", desc:"Country-wise revenue and margin", tag:"Finance" },
        { title:"Counsellor Productivity", desc:"Applications and offers per counsellor", tag:"HR" },
      ]});
    }

    // ═══════════════════════════════════════════════════════════════
    // UNIQUESTA TOURS & TRAVELS API
    // ═══════════════════════════════════════════════════════════════
    if (path === "/api/travel/bookings") {
      if (method === "GET") {
        const isMem = db.isMemoryMode();
        if (isMem) {
          let list = db.memList("travel_bookings") || [];
          return json({ success: true, data: list });
        }
        const rows = await db.query("SELECT * FROM travel_bookings ORDER BY id DESC");
        return json({ success: true, data: rows });
      }
      if (method === "POST") {
        const body: any = await parseBody(req);
        if (!body.passenger_name || !body.destination) return errJson(400, "passenger_name and destination required");
        const ref = body.booking_ref || `UQ-TRV-${Date.now().toString().slice(-4)}`;
        const customerPrice = parseInt(body.customer_price ?? body.amount_value ?? 0, 10);
        const agencyCost = parseInt(body.agency_cost ?? 0, 10);
        const adminMargin = body.admin_margin !== undefined ? parseInt(body.admin_margin, 10) : (customerPrice - agencyCost);
        const formattedTotal = body.total_amount || `₹ ${customerPrice.toLocaleString("en-IN")}`;
        
        const bookingData = {
          booking_ref: ref,
          passenger_name: body.passenger_name,
          email: body.email || "",
          phone: body.phone || "",
          travel_type: body.travel_type || "Bus & Fleet Trip",
          vehicle_type: body.vehicle_type || "32-Seater Luxury AC Bus",
          origin: body.origin || "Guwahati",
          destination: body.destination,
          departure_date: body.departure_date || new Date().toISOString().slice(0, 10),
          return_date: body.return_date || null,
          airline_carrier: body.airline_carrier || "",
          pnr: body.pnr || `PNR-${Math.floor(10000 + Math.random() * 90000)}`,
          passengers_count: parseInt(body.passengers_count || 1, 10),
          customer_price: customerPrice,
          agency_cost: agencyCost,
          admin_margin: adminMargin,
          total_amount: formattedTotal,
          amount_value: customerPrice,
          payment_status: body.payment_status || "Pending",
          agency_payment_status: body.agency_payment_status || "Pending",
          assigned_agency: body.assigned_agency || "Direct Customer (In-house / Direct)",
          agency_contact: body.agency_contact || "+91 98200 11111",
          assigned_driver: body.assigned_driver || "Unassigned",
          driver_phone: body.driver_phone || "",
          vehicle_number: body.vehicle_number || "",
          trip_status: body.trip_status || (body.assigned_driver && body.assigned_driver !== "Unassigned" ? "Assigned to Driver" : "Booking Confirmed"),
          notes: body.notes || "",
          status: body.status || "Active",
        };

        const isMem = db.isMemoryMode();
        if (isMem) {
          const row = db.memCreate("travel_bookings", bookingData);
          return json({ success: true, data: row }, 201);
        }
        await db.execute(
          `INSERT INTO travel_bookings (
            booking_ref, passenger_name, email, phone, travel_type, vehicle_type,
            origin, destination, departure_date, return_date, airline_carrier, pnr,
            passengers_count, customer_price, agency_cost, admin_margin, total_amount,
            amount_value, payment_status, agency_payment_status, assigned_agency,
            agency_contact, assigned_driver, driver_phone, vehicle_number, trip_status,
            notes, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            bookingData.booking_ref, bookingData.passenger_name, bookingData.email, bookingData.phone,
            bookingData.travel_type, bookingData.vehicle_type, bookingData.origin, bookingData.destination,
            bookingData.departure_date, bookingData.return_date, bookingData.airline_carrier, bookingData.pnr,
            bookingData.passengers_count, bookingData.customer_price, bookingData.agency_cost, bookingData.admin_margin,
            bookingData.total_amount, bookingData.amount_value, bookingData.payment_status, bookingData.agency_payment_status,
            bookingData.assigned_agency, bookingData.agency_contact, bookingData.assigned_driver, bookingData.driver_phone,
            bookingData.vehicle_number, bookingData.trip_status, bookingData.notes, bookingData.status
          ]
        );
        const row = await db.queryOne("SELECT * FROM travel_bookings WHERE booking_ref = ?", [ref]);
        return json({ success: true, data: row }, 201);
      }
    }

    if (path.startsWith("/api/travel/bookings/") && (method === "PUT" || method === "PATCH")) {
      const idOrRef = path.split("/").pop();
      const body: any = await parseBody(req);
      const isMem = db.isMemoryMode();
      
      if (body.customer_price !== undefined || body.agency_cost !== undefined) {
        const cust = parseInt(body.customer_price ?? 0, 10);
        const agen = parseInt(body.agency_cost ?? 0, 10);
        if (body.admin_margin === undefined && cust && agen) {
          body.admin_margin = cust - agen;
        }
        if (cust && !body.total_amount) {
          body.total_amount = `₹ ${cust.toLocaleString("en-IN")}`;
        }
      }

      if (isMem) {
        const numId = Number(idOrRef);
        const updated = db.memUpdate("travel_bookings", isNaN(numId) ? idOrRef! : numId, body);
        return json({ success: true, data: updated });
      }

      // MySQL update
      const allowedCols = [
        "passenger_name", "email", "phone", "travel_type", "vehicle_type",
        "origin", "destination", "departure_date", "return_date", "passengers_count",
        "customer_price", "agency_cost", "admin_margin", "total_amount", "amount_value",
        "payment_status", "agency_payment_status", "assigned_agency", "agency_contact",
        "assigned_driver", "driver_phone", "vehicle_number", "trip_status", "notes", "status"
      ];
      const updates: string[] = [];
      const vals: any[] = [];
      for (const k of allowedCols) {
        if (body[k] !== undefined) {
          updates.push(`${k} = ?`);
          vals.push(body[k]);
        }
      }
      if (updates.length > 0) {
        vals.push(idOrRef, idOrRef);
        await db.execute(`UPDATE travel_bookings SET ${updates.join(", ")} WHERE id = ? OR booking_ref = ?`, vals);
      }
      const row = await db.queryOne("SELECT * FROM travel_bookings WHERE id = ? OR booking_ref = ?", [idOrRef, idOrRef]);
      return json({ success: true, data: row });
    }

    if (path.startsWith("/api/travel/bookings/") && method === "DELETE") {
      const idOrRef = path.split("/").pop();
      const isMem = db.isMemoryMode();
      if (isMem) {
        const numId = Number(idOrRef);
        db.memDelete("travel_bookings", isNaN(numId) ? idOrRef! : numId);
      } else {
        await db.execute("DELETE FROM travel_bookings WHERE id = ? OR booking_ref = ?", [idOrRef, idOrRef]);
      }
      return json({ success: true, message: "Booking deleted" });
    }

    // Drivers endpoint
    if (path === "/api/travel/drivers") {
      if (method === "GET") {
        const isMem = db.isMemoryMode();
        if (isMem) return json({ success: true, data: db.memList("travel_drivers") || [] });
        const rows = await db.query("SELECT * FROM travel_drivers ORDER BY id ASC");
        return json({ success: true, data: rows });
      }
      if (method === "POST") {
        const body: any = await parseBody(req);
        const isMem = db.isMemoryMode();
        const pin = (body.pin || body.password || "1234").toString().trim();
        let password_hash: string | null = null;
        if (body.password) {
          try {
            password_hash = await auth.hashPassword(body.password);
          } catch {}
        }
        if (isMem) {
          return json({ success: true, data: db.memCreate("travel_drivers", { ...body, pin, password_hash }) }, 201);
        }
        try {
          await db.execute(
            `INSERT INTO travel_drivers (name, phone, vehicle_type, vehicle_number, experience, rating, status, pin, email, password_hash)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              body.name,
              body.phone,
              body.vehicle_type,
              body.vehicle_number,
              body.experience || "5 years",
              body.rating || 4.8,
              body.status || "Available",
              pin,
              body.email || null,
              password_hash,
            ]
          );
        } catch {
          await db.execute(
            `INSERT INTO travel_drivers (name, phone, vehicle_type, vehicle_number, experience, rating, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [body.name, body.phone, body.vehicle_type, body.vehicle_number, body.experience || "5 years", body.rating || 4.8, body.status || "Available"]
          );
        }
        const row = await db.queryOne("SELECT * FROM travel_drivers WHERE vehicle_number = ? ORDER BY id DESC LIMIT 1", [body.vehicle_number]);
        return json({ success: true, data: row }, 201);
      }
    }

    if (path.startsWith("/api/travel/drivers/") && !path.includes("check")) {
      const driverId = path.split("/").pop();
      const isMem = db.isMemoryMode();

      if (method === "GET") {
        if (isMem) {
          const d = db.memGet("travel_drivers", driverId) || (db.memList("travel_drivers") || []).find((x: any) => String(x.id) === String(driverId));
          return d ? json({ success: true, data: d }) : errJson(404, "Driver not found");
        }
        const row = await db.queryOne("SELECT * FROM travel_drivers WHERE id = ?", [driverId]);
        return row ? json({ success: true, data: row }) : errJson(404, "Driver not found");
      }

      if (method === "PUT" || method === "PATCH") {
        const body: any = await parseBody(req);
        if (isMem) {
          const upd = db.memUpdate("travel_drivers", driverId, body);
          return json({ success: true, data: upd });
        }
        const fields: string[] = [];
        const vals: any[] = [];
        for (const k of ["name", "phone", "vehicle_type", "vehicle_number", "experience", "rating", "status", "pin", "email"]) {
          if (body[k] !== undefined) {
            fields.push(`${k} = ?`);
            vals.push(body[k]);
          }
        }
        if (body.password) {
          try {
            const hash = await auth.hashPassword(body.password);
            fields.push("password_hash = ?");
            vals.push(hash);
          } catch {}
        }
        if (fields.length > 0) {
          vals.push(driverId);
          await db.execute(`UPDATE travel_drivers SET ${fields.join(", ")} WHERE id = ?`, vals);
        }
        const row = await db.queryOne("SELECT * FROM travel_drivers WHERE id = ?", [driverId]);
        return json({ success: true, data: row });
      }

      if (method === "DELETE") {
        if (isMem) {
          db.memDelete("travel_drivers", driverId);
          return json({ success: true, message: "Driver deleted successfully" });
        }
        await db.execute("DELETE FROM travel_drivers WHERE id = ?", [driverId]);
        return json({ success: true, message: "Driver deleted successfully" });
      }
    }

    // Agencies endpoint
    if (path === "/api/travel/agencies") {
      if (method === "GET") {
        const isMem = db.isMemoryMode();
        if (isMem) return json({ success: true, data: db.memList("travel_agencies") || [] });
        const rows = await db.query("SELECT * FROM travel_agencies ORDER BY id ASC");
        return json({ success: true, data: rows });
      }
      if (method === "POST") {
        const body: any = await parseBody(req);
        const isMem = db.isMemoryMode();
        if (isMem) return json({ success: true, data: db.memCreate("travel_agencies", body) }, 201);
        await db.execute(
          `INSERT INTO travel_agencies (name, contact_person, phone, email, city, commission_tier)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [body.name, body.contact_person || "", body.phone, body.email || "", body.city || "Guwahati", body.commission_tier || "Standard Partner"]
        );
        const row = await db.queryOne("SELECT * FROM travel_agencies WHERE name = ?", [body.name]);
        return json({ success: true, data: row }, 201);
      }
    }

    if (path === "/api/travel/destinations") {
      if (method === "GET") {
        const isMem = db.isMemoryMode();
        if (isMem) return json({ success: true, data: db.memList("travel_destinations") || [] });
        const rows = await db.query("SELECT * FROM travel_destinations ORDER BY id ASC");
        return json({ success: true, data: rows });
      }
      if (method === "POST") {
        const body: any = await parseBody(req);
        const code = body.code || `DEST-${Date.now().toString().slice(-3)}`;
        const isMem = db.isMemoryMode();
        if (isMem) return json({ success: true, data: db.memCreate("travel_destinations", { ...body, code }) }, 201);
        await db.execute(
          `INSERT INTO travel_destinations (code, title, country, duration, category, price, rating, inclusions, best_season, badge)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [code, body.title, body.country, body.duration, body.category || "Holiday Package", body.price, body.rating || 4.8, body.inclusions || "", body.best_season || "All Season", body.badge || "Featured"]
        );
        const row = await db.queryOne("SELECT * FROM travel_destinations WHERE code = ?", [code]);
        return json({ success: true, data: row }, 201);
      }
    }

    if (path === "/api/travel/services") {
      if (method === "GET") {
        const isMem = db.isMemoryMode();
        if (isMem) return json({ success: true, data: db.memList("travel_services") || [] });
        const rows = await db.query("SELECT * FROM travel_services ORDER BY id DESC");
        return json({ success: true, data: rows });
      }
      if (method === "POST") {
        const body: any = await parseBody(req);
        const req_code = body.req_code || `SRV-${Date.now().toString().slice(-4)}`;
        const isMem = db.isMemoryMode();
        if (isMem) return json({ success: true, data: db.memCreate("travel_services", { ...body, req_code }) }, 201);
        await db.execute(
          `INSERT INTO travel_services (req_code, student_name, phone, service_type, destination_country, amount_val, provider, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [req_code, body.student_name, body.phone || "", body.service_type, body.destination_country, body.amount_val, body.provider || "Partner Network", body.status || "Active"]
        );
        const row = await db.queryOne("SELECT * FROM travel_services WHERE req_code = ?", [req_code]);
        return json({ success: true, data: row }, 201);
      }
    }

    return errJson(404, `API route not found: ${method} ${path}`);
  } catch (e:any) {
    const status = e.status || 500;
    console.error("[API]", e);
    return errJson(status, e.message || "Internal server error", e.details || undefined);
  }
}
