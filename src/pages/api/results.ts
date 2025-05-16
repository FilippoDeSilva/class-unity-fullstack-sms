// // import { PrismaClient } from '@prisma/client';

// // const prisma = new PrismaClient();

// // export default async function handler(req, res) {
// //   try {
// //     // Fetch results from the database
// //     const results = await prisma.result.findMany({
// //       include: {
// //         student: { select: { name: true, surname: true } },
// //         assignment: { select: { title: true } },
// //         // You can also include other related data such as exam or courseName
// //       },
// //     });

// //     // Return the results as an array
// //     res.status(200).json(results);
// //   } catch (error) {
// //     res.status(500).json({ error: 'Error fetching results' });
// //   }
// // }



// // import { PrismaClient } from '@prisma/client';

// // const prisma = new PrismaClient();

// // export default async function handler(req, res) {
// //   try {
// //     const { id } = req.query; // Assuming the student ID is passed as a query parameter

// //     // Validate input
// //     if (!id) {
// //       return res.status(400).json({ error: 'Student ID is required' });
// //     }

// //     // Fetch results for the specific student ID
// //     const results = await prisma.result.findMany({
// //       where: { studentId: id },
// //       select: {
// //         id: true,
// //         score: true,
// //         midexam: true,
// //         assignmentRe: true,
// //         studentId: true,
// //       },
// //     });

// //     if (results.length === 0) {
// //       return res.status(404).json({ error: 'No results found for the given student ID' });
// //     }

// //     // Fetch the related student details
// //     const student = await prisma.student.findUnique({
// //       where: { id },
// //       select: { id: true, name: true, surname: true },
// //     });

// //     if (!student) {
// //       return res.status(404).json({ error: 'Student not found' });
// //     }

// //     // Combine data
// //     const formattedResults = results.map((result) => ({
// //       score: result.score,
// //       midexam: result.midexam,
// //       assignmentRe: result.assignmentRe,
// //       studentName: student.name,
// //       studentSurname: student.surname,
// //     }));

// //     // Return the results as an array
// //     res.status(200).json(formattedResults);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: 'Error fetching results' });
// //   }
// // }


// // import { PrismaClient } from '@prisma/client';

// // const prisma = new PrismaClient();

// // export default async function handler(req, res) {
// //   try {
// //     // Get studentId from query parameters
// //     const { studentId } = req.query;

// //     if (!studentId) {
// //       return res.status(400).json({ error: 'Student ID is required' });
// //     }

// //     // Fetch results for the specific student with necessary fields (score, midexam, assignmentRe, courseName)
// //     const results = await prisma.result.findMany({
// //       where: {
// //         studentId: studentId,  // Filter by the provided studentId
// //       },
// //       select: {
// //         id: true,
// //         score: true,
// //         midexam: true,
// //         assignmentRe: true,
// //         studentId: true,
// //         courseName: true,  // Directly include courseName from the Result table
// //       },
// //     });

// //     if (results.length === 0) {
// //       return res.status(404).json({ error: 'No results found for this student' });
// //     }

// //     // Fetch related student data
// //     const student = await prisma.student.findUnique({
// //       where: { id: studentId },
// //       select: { id: true, name: true, surname: true },
// //     });

// //     if (!student) {
// //       return res.status(404).json({ error: 'Student not found' });
// //     }

// //     // Combine data and format the results
// //     const formattedResults = results.map((result) => ({
// //       score: result.score,
// //       midexam: result.midexam,
// //       assignmentRe: result.assignmentRe,
// //       studentName: student.name,
// //       studentSurname: student.surname,
// //       courseName: result.courseName,  // Add the courseName directly
// //     }));

// //     // Return the results as an array
// //     res.status(200).json(formattedResults);
// //   } catch (error) {
// //     res.status(500).json({ error: 'Error fetching results' });
// //   }
// // }




// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export default async function handler(req, res) {
//   try {
//     // Fetch all results with only necessary fields (score, midexam, assignmentRe)
//     const results = await prisma.result.findMany({
//       select: {
//         id: true,
//         score: true,
//         midexam: true,
//         assignmentRe: true,
//         studentId: true,
//         courseName: true,
//       },
//     });

//     // Fetch related students
//     const studentIds = results.map((result) => result.studentId);
//     const students = await prisma.student.findMany({
//       where: { id: { in: studentIds } },
//       select: { id: true, name: true, surname: true },
//     });

//     // Combine data
//     const formattedResults = results.map((result) => {
//       const student = students.find((s) => s.id === result.studentId);
//       return {
//         score: result.score,
//         midexam: result.midexam,
//         assignmentRe: result.assignmentRe,
//         studentName: student?.name,
//         studentSurname: student?.surname,
//         courseName: result.courseName,
//       };
//     });

//     // Return the results as an array
//     res.status(200).json(formattedResults);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching results' });
//   }
// }




{/*
                    #################################################
                    ##                                             ##
                    ##                                             ##
                    ##     they work bout not fully functional     ##
                    ##                                             ##
                    ##                                             ##
                    #################################################
*/}