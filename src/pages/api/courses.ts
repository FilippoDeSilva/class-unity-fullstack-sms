// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export default async function handler(req, res) {
//   try {
//     const courses = await prisma.course.findMany({
//       select: {
//         id: true,
//         courseName: true,
//         creditHour: true,
//       },
//     });
//     res.status(200).json(courses);
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     res.status(500).json({ error: "Error fetching courses" });
//   } finally {
//     await prisma.$disconnect();
//   }
// }


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    // Fetch all courses with name and creditHour
    const courses = await prisma.course.findMany({
      select: {
        name: true, // The column where the courseName is stored
        creditHour: true,
      },
    });

    // Return the courses as JSON
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Error fetching courses" });
  }
}
