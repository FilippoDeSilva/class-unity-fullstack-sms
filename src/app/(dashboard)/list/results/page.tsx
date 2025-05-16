// import FormContainer from "@/components/FormContainer";
// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import ResultTable from "@/components/ResultsTable";
// import prisma from "@/lib/prisma";
// import Link from "next/link";
// import { ITEM_PER_PAGE } from "@/lib/settings";
// import { Prisma } from "@prisma/client";
// import Image from "next/image";
// import { auth } from "@clerk/nextjs/server";
// import { Viewport } from "next";
// // import { courseSchema } from "@/lib/formValidationSchemas";

// export const metadata = {
//   title: "Class-Unity | Results",
// };

// export const viewport: Viewport = {
//   width: "device-width",
//   initialScale: 1,
// };

// type ResultList = {
//   id: number;
//   title: string;
//   studentName: string;
//   studentSurname: string;
//   teacherName: string;
//   teacherSurname: string;
//   score: number;
//   className: string;
//   startTime: Date;
//   midexam: number;
//   assignmentRe: number;
//   courseName: string;
//   totalScore: string | number;
//   grade: string;
// };

// const ResultListPage = async ({
//   searchParams,
// }: {
//   searchParams: { [key: string]: string | undefined };
// }) => {
//   const { userId, sessionClaims } = auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;
//   const currentUserId = userId;

//   const columns = [
//     {
//       header: "Title",
//       accessor: "courseName",
//     },
//     // {
//     //   header: "Student",
//     //   accessor: "student",
//     // },
//     // {
//     //   header: "Section",
//     //   accessor: "class",
//     //   className: "hidden md:table-cell",
//     // },
//     (role === "admin" || role === "teacher"
//       ? [
//           {
//             header: "Section",
//             accessor: "class",
//             className: "hidden md:table-cell",
//           },
//         ]
//       : []),
//     {
//       header: "Teacher",
//       accessor: "teacher",
//       className: "hidden md:table-cell",
//     },
    
//     {
//       header: "Assignment",
//       accessor: "assignmentRe",
//       className: "hidden md:table-cell",
//     },
//     {
//       header: "Mid-Exam",
//       accessor: "midexam",
//       className: "hidden md:table-cell",
//     },
//     {
//       header: "Final-Exam",
//       accessor: "score",
//       className: "hidden md:table-cell",
//     },
//     {
//       header: "Total Score",
//       accessor: "totalScore",
//       // className: "flex items-center",
//     },
//     {
//       header: "Grade",
//       accessor: "grade",
//       // className: "flex items-center" ,
//     },
//     {
//       header: "Date",
//       accessor: "date",
//       className: "hidden md:table-cell",
//     },
//     ...(role === "admin" || role === "teacher"
//       ? [
//           {
//             header: "Actions",
//             accessor: "action",
//           },
//         ]
//       : []),
//   ];

//   // const renderRow = (item: ResultList) => {
//   //   // Calculate totalScore and grade
//   //   const totalScore = item.score + item.midexam + item.assignmentRe;
//   //   const grade = calculateGrade(totalScore);

//   const renderRow = (item: ResultList) => {
//     // Add checks to ensure item and its properties are not null
//     if (!item || item.score == null || item.midexam == null || item.assignmentRe == null) {
//       return null; // Return null or a fallback row for invalid data
//     }
  
//     // Calculate totalScore and grade only if item is valid
//     const totalScore = item.score + item.midexam + item.assignmentRe;
//     const grade = calculateGrade(totalScore);

//     return (
//       <tr
//         key={item.id}
//         className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
//       >
//         <td className="flex items-center gap-4 p-4">{item.courseName}</td>
//         {/* <td>{item.studentName + " " + item.studentSurname}</td> */}
//         <td className="hidden md:table-cell">

//         <div>
//             {(role === "admin" || role === "teacher") && (
//               <>
//                 {item.className}
//               </>
//             )}
//           </div>
//         </td>
//         <td className="hidden md:table-cell">
//           {item.teacherName + " " + item.teacherSurname}
//         </td>
//         <td className="hidden md:table-cell">{item.assignmentRe}</td>
//         <td className="hidden md:table-cell">{item.midexam}</td>
//         <td className="hidden md:table-cell">{item.score}</td>
//         <td>{totalScore}</td>
//         <td>{grade}</td>
//         <td className="hidden md:table-cell">
//           {new Intl.DateTimeFormat("en-US").format(item.startTime)}
//         </td>
//         <td>
//           <div className="flex items-center gap-2">
//             {(role === "admin" || role === "teacher") && (
//               <>
//                 <FormContainer table="result" type="update" data={item} />
//                 <FormContainer table="result" type="delete" id={item.id} />
//               </>
//             )}
//           </div>
//         </td>
//       </tr>
//     );
//   };

//   // Function to calculate grade based on total score
//   const calculateGrade = (totalScore: number) => {
//     if (totalScore >= 95) return "A+";
//     if (totalScore >= 80) return "A";
//     if (totalScore >= 78) return "A-";
//     if (totalScore >= 75) return "B+";
//     if (totalScore >= 70) return "B";
//     if (totalScore >= 65) return "B-";
//     if (totalScore >= 60) return "C+";
//     if (totalScore >= 50) return "C";
//     if (totalScore >= 45) return "C-";
//     if (totalScore >= 35) return "D";
//     return "F";
//   };

  

//   const { page, ...queryParams } = searchParams;
//   const p = page ? parseInt(page) : 1;

//   const query: Prisma.ResultWhereInput = {};

//   if (queryParams) {
//     for (const [key, value] of Object.entries(queryParams)) {
//       if (value !== undefined) {
//         switch (key) {
//           case "studentId":
//             query.studentId = value;
//             break;
//           case "search":
//             query.OR = [
//               { student: { name: { contains: value, mode: "insensitive" } } },
//             ];
//             break;
//           default:
//             break;
//         }
//       }
//     }
//   }

//   switch (role) {
//     case "admin":
//       break;
//     case "teacher":
//       query.OR = [
//         { exam: { chapter: { teacherId: currentUserId! } } },
//         { assignment: { chapter: { teacherId: currentUserId! } } },
//       ];
//       break;

//     case "student":
//       query.studentId = currentUserId!;
//       break;
//     default:
//       break;
//   }

//   const [dataRes, count] = await prisma.$transaction([
//     prisma.result.findMany({
//       where: query,
//       include: {
//         student: { select: { name: true, surname: true } },
//         assignment: {
//           include: {
//             chapter: {
//               select: {
//                 class: { select: { name: true } },
//                 teacher: { select: { name: true, surname: true } },
//               },
//             },
//           },
//         },
//       },
//       take: ITEM_PER_PAGE,
//       skip: ITEM_PER_PAGE * (p - 1),
//     }),
//     prisma.result.count({ where: query }),
//   ]);

//   const data = dataRes.map((item) => {
//     const assessment = item.exam || item.assignment;

//     if (!assessment) return null;

//     const isExam = "startTime" in assessment;

//     const totalScore = item.score + item.midexam + item.assignmentRe;
//     const grade = calculateGrade(totalScore);

//     return {
//       id: item.id,
//       title: assessment.title,
//       // studentName: item.student.name,
//       // studentSurname: item.student.surname,
//       teacherName: assessment.chapter.teacher.name,
//       teacherSurname: assessment.chapter.teacher.surname,
//       score: item.score,
//       className: assessment.chapter.class.name,
//       startTime: isExam ? assessment.startTime : assessment.startDate,
//       courseName: item.courseName,
//       midexam: item.midexam,
//       assignmentRe: item.assignmentRe,
//       totalScore, // Add totalScore to the data
//       grade, // Add grade to the data
//     };
//   });

//   return (
//     <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//       {/* TOP */}
//       <div className="flex items-center justify-between">
//         <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
//         <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
//           <TableSearch />
//           <div className="flex items-center gap-4 self-end">
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
//               <Image src="/filter.png" alt="" width={14} height={14} />
//             </button>
//             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
//               <Image src="/sort.png" alt="" width={14} height={14} />
//             </button>
//             {(role === "admin" || role === "teacher") && (
//               <FormContainer table="result" type="create" />
//             )}
//           </div>
//         </div>
//       </div>
//       {/* LIST */}
//       <Table columns={columns} renderRow={renderRow} data={data} />
//       {/* PAGINATION */}
//       <Pagination page={p} count={count} />
//     </div>
//   );
// };

// export default ResultListPage;

import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { Viewport } from "next";

export const metadata = {
  title: "Class-Unity | Results",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

type ResultList = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
  midexam: number;
  assignmentRe: number;
  courseName: string;
};

const ResultListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Course",
      accessor: "courseName",
    },
    {
      header: "Student",
      accessor: "student",
    },
    {
      header: "Final-Exam",
      accessor: "score",
      className: "hidden md:table-cell",
    },
    {
      header: "Mid-Exam",
      accessor: "midexam",
      className: "hidden md:table-cell",
    },
    {
      header: "Assignment",
      accessor: "assignmentRe",
      className: "hidden md:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: ResultList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.courseName}</td>
      <td>{item.studentName + " " + item.studentSurname}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden md:table-cell">{item.midexam}</td>
      <td className="hidden md:table-cell">{item.assignmentRe}</td>
      <td className="hidden md:table-cell">
        {item.teacherName + " " + item.teacherSurname}
      </td>
      <td className="hidden md:table-cell">{item.className}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.startTime)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table="result" type="update" data={item} />
              <FormContainer table="result" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Build query conditions
  const query: Prisma.ResultWhereInput = {};
  const orConditions: Prisma.ResultWhereInput[] = [];

  for (const [key, value] of Object.entries(queryParams)) {
    if (!value) continue;
    if (key === "studentId") {
      query.studentId = value;
    } else if (key === "search") {
      orConditions.push({
        student: { name: { contains: value, mode: "insensitive" } },
      });
    }
  }

  // Add role-based conditions
  if (role === "teacher") {
    orConditions.push(
      // { exam: { chapter: { teacherId: currentUserId! } } },
      { assignment: { chapter: { teacherId: currentUserId! } } }
    );
  } else if (role === "student") {
    query.studentId = currentUserId!;
  }

  if (orConditions.length > 0) {
    query.OR = orConditions;
  }

  // Fetch data
  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        assignment: {
          include: {
            chapter: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.result.count({ where: query }),
  ]);

  const data = dataRes.map((item) => {
    const assignmentChapter = item.assignment?.chapter;

    return {
      id: item.id,
      title: item.courseName ?? "N/A",
      studentName: item.student.name,
      studentSurname: item.student.surname,
      teacherName: assignmentChapter?.teacher?.name ?? "N/A",
      teacherSurname: assignmentChapter?.teacher?.surname ?? "",
      score: item.score ?? 0,
      className: assignmentChapter?.class?.name ?? "N/A",
      startTime: item.assignment?.startDate ?? new Date(),
      courseName: item.courseName ?? "N/A",
      midexam: item.midexam ?? 0,
      assignmentRe: item.assignmentRe ?? 0,
    };
  });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && (
              <FormContainer table="result" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ResultListPage;
