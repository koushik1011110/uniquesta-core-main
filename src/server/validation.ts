import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().optional(),
  branch: z.string().optional(),
});

export const studentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  dob: z.string().optional(),
  passport: z.string().optional(),
  country: z.string().min(2),
  course: z.string().min(2),
  university: z.string().min(2),
  intake: z.string().min(2),
  counselor: z.string().optional(),
  branch: z.string().min(2),
  lead_score: z.number().min(0).max(100).optional(),
  stage: z.string().optional(),
  stage_index: z.number().optional(),
  status: z.string().optional(),
});

export const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  source: z.string().min(2),
  score: z.number().min(0).max(100).optional(),
  city: z.string().min(2),
  status: z.string().optional(),
  assigned_to: z.string().optional(),
  branch: z.string().optional(),
});

export const applicationSchema = z.object({
  student: z.string().min(2),
  student_id: z.number().optional(),
  university: z.string().min(2),
  program: z.string().min(2),
  intake: z.string().min(2),
  stage: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  status: z.string().optional(),
});

export const universitySchema = z.object({
  name: z.string().min(2),
  country: z.string().min(2),
  city: z.string().min(2),
  tier: z.string().optional(),
  courses: z.number().optional(),
  intakes: z.string().min(2),
  commission: z.string().min(1),
  rating: z.number().min(0).max(5).optional(),
});

export const collegeSchema = z.object({
  name: z.string().min(2),
  state: z.string().min(2),
  city: z.string().min(2),
  affiliatedUniversity: z.string().min(2),
  coursesOffered: z.array(z.string()).optional(),
  annualIntake: z.number().optional(),
  deadline: z.string().optional(),
  tuitionFee: z.string().optional(),
  hostelFee: z.string().optional(),
  contactPerson: z.string().optional(),
  contactNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

export const courseSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  duration: z.string().min(1),
  eligibility: z.string().min(5),
  tuitionFee: z.string().min(2),
  registrationFee: z.string().min(1),
  seatsAvailable: z.number().optional(),
  totalSeats: z.number().optional(),
  session: z.string().min(2),
  minPercentage: z.string().optional(),
  description: z.string().optional(),
});

export const indiaStudentSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  category: z.string().optional(),
  fatherName: z.string().optional(),
  fatherPhone: z.string().optional(),
  address: z.string().optional(),
  counselor: z.string().optional(),
  branch: z.string().min(2),
  preferredState: z.string().optional(),
  preferredCollege: z.string().optional(),
  preferredCourse: z.string().optional(),
  session: z.string().min(2),
  stageIndex: z.number().optional(),
  registrationFeePaid: z.boolean().optional(),
  totalFee: z.number().optional(),
  paidFee: z.number().optional(),
  scholarship: z.number().optional(),
  discount: z.number().optional(),
  remarks: z.string().optional(),
  appliedDate: z.string().optional(),
});

export const invoiceSchema = z.object({
  student: z.string().min(2),
  student_id: z.number().optional(),
  amount: z.string().min(1),
  amount_value: z.number().optional(),
  currency: z.string().optional(),
  type: z.string().min(2),
  date: z.string().optional(),
  status: z.string().optional(),
});

export const employeeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  role: z.string().min(2),
  designation: z.string().optional(),
  branch: z.string().min(2),
  reports_to: z.string().optional().nullable(),
  status: z.string().optional(),
  create_login: z.boolean().optional(),
  password: z.string().optional(),
});

export const approvalSchema = z.object({
  title: z.string().min(5),
  amount: z.string().min(1),
  amount_value: z.number().optional(),
  category: z.string().min(2),
  submitted_by: z.string().optional(),
  period: z.string().optional(),
  branch: z.string().min(2),
  attachments: z.number().optional(),
  status: z.string().optional(),
});

export const approvalStepUpdateSchema = z.object({
  status: z.enum(["approved","rejected","current","pending","upcoming","released"]),
  comment: z.string().optional(),
});

export const referralSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  country: z.string().min(2),
  university: z.string().min(2),
  program: z.string().min(2),
  intake: z.string().min(2),
  status: z.string().optional(),
  stage: z.string().optional(),
  commission_est: z.string().optional(),
});

export const b2bPartnerSchema = z.object({
  name: z.string().min(2),
  company_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  city: z.string().min(2),
  branch: z.string().optional(),
  profit_share_type: z.enum(["percentage", "flat"]).optional(),
  partner_share_pct: z.number().min(0).max(100).optional(),
  flat_rate_amount: z.number().min(0).optional(),
  tier: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

export function parseOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const res = schema.safeParse(data);
  if (!res.success) {
    const err: any = new Error("Validation failed");
    err.status = 400;
    err.details = res.error.flatten();
    throw err;
  }
  return res.data;
}
