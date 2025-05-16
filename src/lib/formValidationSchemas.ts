import { z } from "zod";

export const courseSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "course name is required!" }),
  creditHour: z.coerce.number().min(0, { message: "credit Hour must be a positive number" }),
  teachers: z.array(z.string()), //teacher ids
});

export type CourseSchema = z.infer<typeof courseSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Course name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity name is required!" }),
  departmentId: z.coerce.number().min(1, { message: "Department name is required!" }),
  supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  // bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  courses: z.array(z.string()).optional(), // course ids
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  // bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  departmentId: z.coerce.number().min(1, { message: "Department is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  // parentId: z.string().min(1, { message: "Parent Id is required!" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  chapterId: z.coerce.number({ message: "Chapter is required!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;



// I HAVE TO WRITE THE OTHER FORM VALIDATIONS....
// lib/formValidationSchemas.ts

export const AssignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  chapterId: z.coerce.number(),
});

export type AssignmentSchema = z.infer<typeof AssignmentSchema>;

export const chapterSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Chapter name is required!" }),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], {
    message: "Day is required!",
  }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  courseId: z.coerce.number({ message: "Course is required!" }),
  classId: z.coerce.number({ message: "Class is required!" }),
  teacherId: z.string({ message: "Teacher is required!" }),
});

export type ChapterSchema = z.infer<typeof chapterSchema>;

// Add this to the existing schemas
export const ResultSchema = z.object({
  id: z.coerce.number().optional(),
  score: z.coerce.number().min(0, { message: "Score must be a positive number" }),
  examId: z.coerce.number().optional(),
  assignmentId: z.coerce.number().optional(),
  studentId: z.string().min(1, { message: "Student is required" }),
  courseName: z.string().optional(),
  midexam: z.number().optional(),
  creditHour: z.coerce.number().optional(),
  assignmentRe: z.number().optional(),
});

export type ResultSchema = z.infer<typeof ResultSchema>;

export const EventSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  startTime: z.coerce.date({ message: "Start time is required" }),
  endTime: z.coerce.date({ message: "End time is required" }),
  classId: z.union([z.coerce.number().nullable(), z.literal("")]).optional(),
});

export type EventSchema = z.infer<typeof EventSchema>;

// Add this to the existing schemas
export const AnnouncementSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  date: z.coerce.date({ message: "Date is required" }),
  classId: z.union([z.coerce.number().nullable(), z.literal("")]).optional(),
});

export type AnnouncementSchema = z.infer<typeof AnnouncementSchema>;
