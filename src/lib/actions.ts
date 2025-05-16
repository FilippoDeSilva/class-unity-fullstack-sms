"use server";

import { revalidatePath } from "next/cache";
import {
  ClassSchema,
  ExamSchema,
  StudentSchema,
  CourseSchema,
  TeacherSchema,
  AssignmentSchema,
  ChapterSchema,
  ResultSchema,
  EventSchema,
  AnnouncementSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

// Create Course
export const createCourse = async (
  currentState: CurrentState,
  data: CourseSchema
) => {
  try {
    await prisma.course.create({
      data: {
        name: data.name,
        creditHour: data.creditHour,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // Uncomment the next line to revalidate the path after creating the course
    revalidatePath("/list/courses");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating course:", err);
    return { success: false, error: true };
  }
};

// Update Course
export const updateCourse = async (
  currentState: CurrentState,
  data: CourseSchema
) => {
  try {
    await prisma.course.update({
      where: { id: data.id },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // Uncomment the next line to revalidate the path after updating the course
    revalidatePath("/list/courses");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating course:", err);
    return { success: false, error: true };
  }
};

// Delete Course
export const deleteCourse = async (
  currentState: CurrentState,
  data: { id: number }
) => {
  try {
    await prisma.course.delete({
      where: { id: data.id },
    });
    revalidatePath("/list/courses");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting course:", err);
    return { success: false, error: true };
  }
};

// Create Class
export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.create({ data });

    // Uncomment the next line to revalidate the path after creating the class
    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating class:", err);
    return { success: false, error: true };
  }
};

// Update Class
export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
      where: { id: data.id },
      data,
    });

    // Uncomment the next line to revalidate the path after updating the class
    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating class:", err);
    return { success: false, error: true };
  }
};

// Delete Class
export const deleteClass = async (
  currentState: CurrentState,
  data: { id: number }
) => {
  try {
    await prisma.class.delete({
      where: { id: data.id },
    });
    revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting class:", err);
    return { success: false, error: true };
  }
};

// Create Teacher
export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    const user = await clerkClient().users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "teacher" },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        sex: data.sex,
        birthday: data.birthday,
        courses: {
          connect: data.courses?.map((courseId: string) => ({
            id: parseInt(courseId),
          })),
        },
      },
    });

    // Uncomment the next line to revalidate the path after creating the teacher
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating teacher:", err);
    return { success: false, error: true };
  }
};

// Update Teacher
export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    console.error("No teacher ID provided for update.");
    return { success: false, error: true };
  }

  try {
    const user = await clerkClient().users.updateUser(data.id, {
      username: data.username,
      ...(data.password && { password: data.password }), // Only include if password is not empty
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: { id: data.id },
      data: {
        ...(data.password && { password: data.password }), // Only include if password is not empty
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        sex: data.sex,
        birthday: data.birthday,
        courses: {
          set: data.courses?.map((courseId: string) => ({
            id: parseInt(courseId),
          })),
        },
      },
    });

    // Uncomment the next line to revalidate the path after updating the teacher
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating teacher:", err);
    return { success: false, error: true };
  }
};

// Delete Teacher
export const deleteTeacher = async (
  currentState: CurrentState,
  data: { id: string }
) => {
  try {
    await clerkClient.users.deleteUser(data.id);
    await prisma.teacher.delete({
      where: { id: data.id },
    });
    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting teacher:", err);
    return { success: false, error: true };
  }
};

// Create Student
export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log("Creating student with data:", data);
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    // Check for class capacity before creating the student
    if (classItem && classItem.capacity === classItem._count.students) {
      console.error("Class capacity reached for class ID:", data.classId);
      return { success: false, error: true };
    }

    const user = await clerkClient().users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        sex: data.sex,
        birthday: data.birthday,
        departmentId: data.departmentId,
        classId: data.classId,
      },
    });

    // Uncomment the next line to revalidate the path after creating the student
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating student:", err);
    return { success: false, error: true };
  }
};

// Update Student
// Update Student
export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    console.error("No student ID provided for update.");
    return { success: false, error: true };
  }

  try {
    // Use the clerkClient as a function
    const user = await clerkClient().users.updateUser(data.id, {
      username: data.username,
      ...(data.password && { password: data.password }), // Only include if password is provided
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.student.update({
      where: { id: data.id },
      data: {
        ...(data.password && { password: data.password }), // Only include if password is provided
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        sex: data.sex,
        birthday: data.birthday,
        departmentId: data.departmentId,
        classId: data.classId,
      },
    });

    // Uncomment the next line to revalidate the path after updating the student
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating student:", err);
    return { success: false, error: true };
  }
};


// Delete Student
export const deleteStudent = async (
  currentState: CurrentState,
  data: { id: string }
) => {
  try {
    await clerkClient.users.deleteUser(data.id);
    await prisma.student.delete({
      where: { id: data.id },
    });
    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting student:", err);
    return { success: false, error: true };
  }
};

// Create Exam
export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  try {
    // Uncomment the following block to include teacher validation
    /*
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }
    */

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        chapterId: data.chapterId,
      },
    });

    // Uncomment the next line to revalidate the path after creating the exam
    // revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating exam:", err);
    return { success: false, error: true };
  }
};

// Update Exam
export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  try {
    // Uncomment the following block to include teacher validation
    /*
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }
    */

    await prisma.exam.update({
      where: { id: data.id },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        chapterId: data.chapterId,
      },
    });

    // Uncomment the next line to revalidate the path after updating the exam
    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating exam:", err);
    return { success: false, error: true };
  }
};

// Delete Exam
export const deleteExam = async (
  currentState: CurrentState,
  data: { id: number }
) => {
  try {
    await prisma.exam.delete({
      where: { id: data.id },
    });
    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting exam:", err);
    return { success: false, error: true };
  }
};






// TRIAL

export const createAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  try {
    await prisma.assignment.create({ data });
    return { ...currentState, success: true, error: false };
  } catch (err) {
    console.error("Error creating assignment:", err);
    return { ...currentState, success: false, error: true };
  }
};

export const updateAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema & { id: number }
) => {
  try {
    const { id, ...updateData } = data;
    await prisma.assignment.update({
      where: { id },
      data: updateData,
    });
    return { ...currentState, success: true, error: false };
  } catch (err) {
    console.error("Error updating assignment:", err);
    return { ...currentState, success: false, error: true };
  }
};

export const deleteAssignment = async (
  currentState: CurrentState,
  data: { id: number }
) => {
  try {
    await prisma.assignment.delete({
      where: { id: data.id },
    });
    revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting assignment:", err);
    return { success: false, error: true };
  }
};



export async function createChapter(data: ChapterSchema) {
  try {
    const { startTime, endTime, ...restData } = data;
    const chapter = await prisma.chapter.create({
      data: {
        ...restData,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });
    revalidatePath("/chapters");
    return { success: true, data: chapter };
  } catch (error) {
    console.error("Failed to create chapter:", error);
    return { success: false, error: "Failed to create chapter" };
  }
}

export async function updateChapter(data: ChapterSchema) {
  try {
    const { id, startTime, endTime, ...restData } = data;
    const chapter = await prisma.chapter.update({
      where: { id },
      data: {
        ...restData,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });
    revalidatePath("/chapters");
    return { success: true, data: chapter };
  } catch (error) {
    console.error("Failed to update chapter:", error);
    return { success: false, error: "Failed to update chapter" };
  }
}

export async function deleteChapter(prevState: any, data: FormData | { id: string | number }) {
  let id: string | number;

  if (data instanceof FormData) {
    const formDataId = data.get("id");
    if (typeof formDataId !== "string" && typeof formDataId !== "number") {
      throw new Error("Invalid id provided in FormData");
    }
    id = formDataId;
  } else if (typeof data === "object" && data !== null && "id" in data) {
    id = data.id;
  } else {
    throw new Error("Invalid data format provided to deleteChapter");
  }

  if (!id) {
    return { success: false, error: true, message: "Chapter ID is required" };
  }

  try {
    await prisma.chapter.delete({
      where: { id: Number(id) },
    });
    revalidatePath("list/chapters");
    return { success: true, error: false };
  } catch (error) {
    console.error("Failed to delete chapter:", error);
    return { success: false, error: true };
  }
}


// Create Result

// type ActionResult = {
//   success: boolean;
//   error?: boolean;
//   message: string;
// };

//ADD THIS ONE ALSO
//: Promise<ActionResult>

export async function createResult(data: ResultSchema) {
  try {
    const result = await prisma.result.create({
      data: {
        score: data.score,
        examId: data.examId,
        assignmentId: data.assignmentId,
        studentId: data.studentId,
        courseName: data.courseName,
        midexam: data.midexam,
        assignmentRe: data.assignmentRe,
        creditHour: data.creditHour,
      },
    });

    revalidatePath("/list/results");
    return { success: true, message: "Result created successfully" };
  } catch (error) {
    console.error("Error creating result:", error);
    return { success: false, error: true, message: "Error creating result" };
  }
}

export async function updateResult(data: ResultSchema) {
  try {
    if (!data.id) {
      throw new Error("Invalid id");
    }

    const result = await prisma.result.update({
      where: { id: data.id },
      data: {
        score: data.score,
        examId: data.examId,
        assignmentId: data.assignmentId,
        studentId: data.studentId,
        courseName: data.courseName,
        midexam: data.midexam,
        assignmentRe: data.assignmentRe,
      },
    });

    revalidatePath("/list/results");
    return { success: true, message: "Result updated successfully" };
  } catch (error) {
    console.error("Error updating result:", error);
    return { success: false, error: true, message: "Error updating result" };
  }
}

// Delete Result
export const deleteResult = async (
  currentState: CurrentState,
  data: { id: number }
) => {
  try {
    await prisma.result.delete({
      where: { id: data.id },
    });
    revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting result:", err);
    return { success: false, error: true };
  }
};

// // Create Event
// export async function createEvent(prevState: any, formData: FormData) {
//   const validatedFields = EventSchema.safeParse({
//     title: formData.get("title"),
//     description: formData.get("description"),
//     startTime: formData.get("startTime"),
//     endTime: formData.get("endTime"),
//     classId: formData.get("classId"),
//   });

//   if (!validatedFields.success) {
//     return { success: false, error: true, message: "Validation failed", errors: validatedFields.error.errors };
//   }

//   try {
//     const eventData = {
//       ...validatedFields.data,
//       classId: validatedFields.data.classId === "" ? null : Number(validatedFields.data.classId),
//     };

//     // Check if the classId exists
//     if (eventData.classId !== null) {
//       const classExists = await prisma.class.findUnique({
//         where: { id: eventData.classId },
//       });
//       if (!classExists) {
//         return { success: false, error: true, message: "Selected class does not exist" };
//       }
//     }

//     const createdEvent = await prisma.event.create({ data: eventData });
//     console.log("Created event:", createdEvent);
//     revalidatePath('/list/events');
//     return { success: true, error: false };
//   } catch (error) {
//     console.error("Failed to create event:", error);
//     return { success: false, error: true, message: error instanceof Error ? error.message : "Failed to create event" };
//   }
// }

// // Update Event
// export async function updateEvent(prevState: any, formData: FormData) {
//   const validatedFields = EventSchema.safeParse({
//     id: formData.get("id"),
//     title: formData.get("title"),
//     description: formData.get("description"),
//     startTime: formData.get("startTime"),
//     endTime: formData.get("endTime"),
//     classId: formData.get("classId"),
//   });

//   if (!validatedFields.success) {
//     return { success: false, error: true, message: "Validation failed", errors: validatedFields.error.errors };
//   }

//   try {
//     const eventData = {
//       ...validatedFields.data,
//       classId: validatedFields.data.classId === "" ? null : Number(validatedFields.data.classId),
//     };

//     // Check if the classId exists
//     if (eventData.classId !== null) {
//       const classExists = await prisma.class.findUnique({
//         where: { id: eventData.classId },
//       });
//       if (!classExists) {
//         return { success: false, error: true, message: "Selected class does not exist" };
//       }
//     }

//     const updatedEvent = await prisma.event.update({
//       where: { id: Number(eventData.id) },
//       data: eventData,
//     });
//     console.log("Updated event:", updatedEvent);
//     revalidatePath('/list/events');
//     return { success: true, error: false };
//   } catch (error) {
//     console.error("Failed to update event:", error);
//     return { success: false, error: true, message: error instanceof Error ? error.message : "Failed to update event" };
//   }
// }

// // Delete Event
// export async function deleteEvent(prevState: any, data: FormData | { id: string | number }) {
//   let id: string | number;
//   if (data instanceof FormData) {
//     const formDataId = data.get("id");
//     if (typeof formDataId !== "string" && typeof formDataId !== "number") {
//       throw new Error("Invalid id provided");
//     }
//     id = formDataId;
//   } else {
//     id = data.id;
//   }

//   if (!id) {
//     return { success: false, error: true, message: "Event ID is required" };
//   }

//   try {
//     await prisma.event.delete({
//       where: { id: Number(id) },
//     });
//     revalidatePath('/list/events');
//     return { success: true, error: false, message: "Event deleted successfully" };
//   } catch (error) {
//     console.error("Failed to delete event:", error);
//     return { success: false, error: true, message: error instanceof Error ? error.message : "Failed to delete event" };
//   }
// }


// Function to create an event
export async function createEvent(prevState: any, formData: FormData) {
  const validatedFields = EventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    classId: formData.get("classId"),
  });
  if (!validatedFields.success) {
    return { success: false, error: true };
  }
  try {
    await prisma.event.create({
      data: {
        ...validatedFields.data,
        classId: validatedFields.data.classId ? Number(validatedFields.data.classId) : null,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { success: false, error: true };
  }
}

// Function to update an event
export async function updateEvent(prevState: any, formData: FormData) {
  const rawData = {
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    classId: formData.get("classId"),
  };
  console.log("Raw form data:", rawData);
  const validatedFields = EventSchema.safeParse(rawData);
  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error.errors);
    return { success: false, error: true, message: "Validation failed", errors: validatedFields.error.errors };
  }
  try {
    const updatedEvent = await prisma.event.update({
      where: { id: Number(validatedFields.data.id) },
      data: {
        ...validatedFields.data,
        classId: validatedFields.data.classId ? Number(validatedFields.data.classId) : null,
      },
    });
    console.log("Event updated successfully:", updatedEvent);
    return { success: true, error: false };
  } catch (error) {
    console.error("Failed to update event:", error);
    return { success: false, error: true, message: error instanceof Error ? error.message : "Failed to update event" };
  }
}

// Function to delete an event with a notification
export async function deleteEvent(prevState: any, formData: FormData | { id: string | number }) {
  let id;
  if (formData instanceof FormData) {
    id = formData.get("id");
  } else {
    id = formData.id;
  }
  if (!id) {
    console.error("No id provided for event deletion");
    return { success: false, error: true, message: "No id provided for deletion" };
  }
  try {
    await prisma.event.delete({
      where: { id: Number(id) },
    });
    console.log(`Event with id ${id} deleted successfully.`);
    return { success: true, error: false, message: `Event with id ${id} deleted successfully.` };
  } catch (error) {
    console.error("Failed to delete event:", error);
    return { success: false, error: true, message: error instanceof Error ? error.message : "Failed to delete event" };
  }
}

// Create Announcement
export async function createAnnouncement(prevState: any, formData: FormData) {
  const validatedFields = AnnouncementSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    classId: formData.get("classId"),
  });

  if (!validatedFields.success) {
    return { success: false, error: true, message: "Validation failed", errors: validatedFields.error.errors };
  }

  try {
    const announcementData = {
      ...validatedFields.data,
      classId: validatedFields.data.classId ? Number(validatedFields.data.classId) : null,
    };

    const createdAnnouncement = await prisma.announcement.create({ data: announcementData });
    console.log("Created announcement:", createdAnnouncement);
    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (error) {
    console.error("Failed to create announcement:", error);
    return { success: false, error: true, message: error instanceof Error ? error.message : "Failed to create announcement" };
  }
}

// Update Announcement
export async function updateAnnouncement(prevState: any, formData: FormData) {
  const validatedFields = AnnouncementSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    classId: formData.get("classId"),
  });

  if (!validatedFields.success) {
    return { success: false, error: true, message: "Validation failed", errors: validatedFields.error.errors };
  }

  try {
    const announcementData = {
      ...validatedFields.data,
      classId: validatedFields.data.classId ? Number(validatedFields.data.classId) : null,
    };

    const updatedAnnouncement = await prisma.announcement.update({
      where: { id: Number(announcementData.id) },
      data: announcementData,
    });
    console.log("Updated announcement:", updatedAnnouncement);
    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (error) {
    console.error("Failed to update announcement:", error);
    return { success: false, error: true, message: error instanceof Error ? error.message : "Failed to update announcement" };
  }
}

// Delete Announcement
export async function deleteAnnouncement(prevState: any, formData: FormData | { id: string | number }) {
  let id;
  if (formData instanceof FormData) {
    id = formData.get("id");
  } else {
    id = formData.id;
  }

  if (!id) {
    console.error("No id provided for announcement deletion");
    return { success: false, error: true, message: "No id provided for deletion" };
  }

  try {
    await prisma.announcement.delete({
      where: { id: Number(id) },
    });
    console.log(`Announcement with id ${id} deleted successfully.`);
    revalidatePath("/list/announcements");
    return { success: true, error: false, message: `Announcement with id ${id} deleted successfully.` };
  } catch (error) {
    console.error("Failed to delete announcement:", error);
    return { success: false, error: true, message: error instanceof Error ? error.message : "Failed to delete announcement" };
  }
}
