// pages/api/student/[id].ts

import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const studentId = Array.isArray(id) ? id[0] : id;

  try {
    // Fetch the student's results from the database by studentId
    const results = await prisma.result.findMany({
      where: { studentId },
      select: {
        courseName: true,
        score: true,
        midexam: true,
        assignmentRe: true,
        creditHour: true,
      },
    });

    // Return the results as JSON
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching student results:", error);
    res.status(500).json({ error: "Error fetching data." });
  }
}



// pages/api/student/[id].ts
// import prisma from "@/lib/prisma";
// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const {
//     query: { id },
//   } = req;

//   if (req.method === "GET") {
//     try {
//       // Fetch the student's result from the database
//       const result = await prisma.studentResult.findUnique({
//         where: { studentId: String(id) },  // Use the correct relation name here
//         select: {
//           studentId: true,
//           assignmentScore: true,
//           midExamScore: true,
//           finalExamScore: true,
//         },
//       });

//       if (!result) {
//         return res.status(404).json({ message: "Result not found" });
//       }

//       return res.status(200).json(result);
//     } catch (error) {
//       console.error("Error fetching student result:", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   }

//   // Handle other HTTP methods (POST, PUT, etc.) if needed
//   return res.status(405).json({ message: "Method not allowed" });
// }
