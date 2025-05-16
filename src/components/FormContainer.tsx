import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";
import ResultForm from "./forms/ResultForm";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    // | "parent"
    | "course"
    | "class"
    | "chapter"
    | "exam"
    | "assignment"
    | "result"
    // | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  if (type !== "delete") {
    switch (table) {
      case "course":
        const courseTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: courseTeachers };
        break;
      case "class":
          const classDepartments = await prisma.department.findMany({
          select: { id: true, name: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: classTeachers, departments: classDepartments };
        break;
      case "teacher":
        const teacherCourses = await prisma.course.findMany({
          select: { id: true, name: true },
        });
        relatedData = { courses: teacherCourses };
        break;
      case "student":
        const studentDepartments = await prisma.department.findMany({
          select: { id: true, name: true },
        });
        const studentclasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { classes: studentclasses, departments: studentDepartments };
        break;
      case "exam":
        const examChapters = await prisma.chapter.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { chapters: examChapters };
        break;
      case "assignment":
        const assignmentChapters = await prisma.chapter.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { chapters: assignmentChapters };
        break;
      case "chapter":
        const chapterCourses = await prisma.course.findMany({
          select: { id: true, name: true },
        });
        const chapterclasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        const chapterTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = {
          courses: chapterCourses,
          classes: chapterclasses,
          teachers: chapterTeachers,
        };
        break;
      case "result":
        if (role === "teacher") {
          // Get the teacher's chapters
          const teacherChapters = await prisma.chapter.findMany({
            where: { teacherId: currentUserId! },
            select: { id: true, classId: true },
          });

          const chapterIds = teacherChapters.map(chapter => chapter.id);
          const classIds = Array.from(new Set(teacherChapters.map(chapter => chapter.classId)));

          // Get exams for the teacher's chapters
          const resultExams = await prisma.exam.findMany({
            where: { chapterId: { in: chapterIds } },
            select: { id: true, title: true },
          });

          // Get assignments for the teacher's chapters
          const resultAssignments = await prisma.assignment.findMany({
            where: { chapterId: { in: chapterIds } },
            select: { id: true, title: true },
          });

          // Get students in the teacher's classes
          const resultStudents = await prisma.student.findMany({
            where: { classId: { in: classIds } },
            select: { id: true, name: true, surname: true },
          });

          relatedData = { exams: resultExams, assignments: resultAssignments, students: resultStudents };
        } else {
          // For admin or other roles, keep the original query
          const resultExams = await prisma.exam.findMany({
            select: { id: true, title: true },
          });
          const resultAssignments = await prisma.assignment.findMany({
            select: { id: true, title: true },
          });
          const resultStudents = await prisma.student.findMany({
            select: { id: true, name: true, surname: true },
          });
          relatedData = { exams: resultExams, assignments: resultAssignments, students: resultStudents };
        }
        break;
      case "event":
        const eventclasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        relatedData = { classes: eventclasses };
        break;
      case "announcement":
        const announcementclasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        relatedData = { classes: announcementclasses };
        break;
      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
