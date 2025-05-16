// import { Day, PrismaClient, UserSex } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
  
//   // ADMIN
//   await prisma.admin.create({
//     data: {
//       username: "admin1",
//     },
//   });
//   await prisma.admin.create({
//     data: {
//       username: "admin2",
//     },
//   });

//   // DEPARTMENT
//   for (let i = 1; i <= 6; i++) {
//     await prisma.department.create({
//       data: {
//         name: `Department ${i}`,
//       },
//     });
//   }

//   // CLASS
//   for (let i = 1; i <= 6; i++) {
//     await prisma.class.create({
//       data: {
//         name: `Section ${i}`, 
//         departmentId: i, 
//         capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
//       },
//     });
//   }

//   // COURSE
//   const CourseData = [
//     { name: "Introduction to Computer Science" },
//     { name: "Fundamentals of Data Base" },
//     { name: "Introduction to C++" },
//     { name: "Introduction to Java Programming" },
//     { name: "Computer Networks and Communications" },
//     { name: "Introduction to AI" },
//     { name: "Automata and Compiler Design" },
//     { name: "Computer Security" },
//     { name: "Emerging Technologies" },
//     { name: "Software Engineering" },
//   ];

//   for (const course of CourseData) {
//     await prisma.course.create({ data: course });
//   }

//   // TEACHER
//   for (let i = 1; i <= 15; i++) {
//     await prisma.teacher.create({
//       data: {
//         id: `teacher${i}`, // Unique ID for the teacher
//         username: `teacher${i}`,
//         name: `TName${i}`,
//         surname: `TSurname${i}`,
//         email: `teacher${i}@example.com`,
//         phone: `123-456-789${i}`,
//         address: `Address${i}`,
//         sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
//         courses: { connect: [{ id: (i % 10) + 1 }] }, 
//         classes: { connect: [{ id: (i % 6) + 1 }] }, 
//         birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
//       },
//     });
//   }

//   // CHAPTER
//   for (let i = 1; i <= 8; i++) {
//     await prisma.chapter.create({
//       data: {
//         name: `Chapter${i}`, 
//         day: Day[
//           Object.keys(Day)[
//             Math.floor(Math.random() * Object.keys(Day).length)
//           ] as keyof typeof Day
//         ], 
//         startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
//         endTime: new Date(new Date().setHours(new Date().getHours() + 3)), 
//         courseId: (i % 10) + 1, 
//         classId: (i % 6) + 1, 
//         teacherId: `teacher${(i % 15) + 1}`, 
//       },
//     });
//   }

//   // STUDENT
//   for (let i = 1; i <= 50; i++) {
//     await prisma.student.create({
//       data: {
//         id: `student${i}`, 
//         username: `student${i}`, 
//         name: `SName${i}`,
//         surname: `SSurname ${i}`,
//         email: `student${i}@example.com`,
//         phone: `987-654-321${i}`,
//         address: `Address${i}`,
//         sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
//         departmentId: (i % 6) + 1, 
//         classId: (i % 6) + 1, 
//         birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
//       },
//     });
//   }

//   // EXAM
//   for (let i = 1; i <= 10; i++) {
//     await prisma.exam.create({
//       data: {
//         title: `Exam ${i}`, 
//         startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
//         endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
//         chapterId: (i % 8) + 1, 
//       },
//     });
//   }

//   // ASSIGNMENT
//   for (let i = 1; i <= 10; i++) {
//     await prisma.assignment.create({
//       data: {
//         title: `Assignment ${i}`, 
//         startDate: new Date(new Date().setHours(new Date().getHours() + 1)), 
//         dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), 
//         chapterId: (i % 8) + 1, 
//       },
//     });
//   }

//   // RESULT
//   for (let i = 1; i <= 10; i++) {
//     await prisma.result.create({
//       data: {
//         score: 90, 
//         studentId: `student${i}`, 
//         ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }), 
//       },
//     });
//   }

//   // EVENT
//   for (let i = 1; i <= 5; i++) {
//     await prisma.event.create({
//       data: {
//         title: `Event ${i}`, 
//         description: `Description for Event ${i}`, 
//         startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
//         endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
//         classId: (i % 5) + 1, 
//       },
//     });
//   }

//   // ANNOUNCEMENT
//   for (let i = 1; i <= 5; i++) {
//     await prisma.announcement.create({
//       data: {
//         title: `Announcement ${i}`, 
//         description: `Description for Announcement ${i}`, 
//         date: new Date(), 
//         classId: (i % 5) + 1, 
//       },
//     });
//   }

//   console.log("Seeding completed successfully.");
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
