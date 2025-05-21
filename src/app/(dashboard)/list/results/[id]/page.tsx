// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";

// const ResultTable = () => {
//   const [results, setResults] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const { id } = useParams(); // Get the id from the URL

//   useEffect(() => {
//     if (id) {
//       const fetchResults = async () => {
//         try {
//           const response = await axios.get(`/api/student/${id}`); // Fetch data with Axios
//           setResults(response.data); // Update state with fetched data
//           setError(null); // Clear any previous errors
//         } catch (error: any) {
//           console.error("Error fetching results:", error);
//           setError(error.response?.data?.error || "Failed to fetch results.");
//         }
//       };

//       fetchResults();
//     }
//   }, [id]); // Refetch when id changes

//   const calculateTotalScore = (score: number, midExam: number, assignmentRe: number) => {
//     if (score == null || midExam == null || assignmentRe == null) {
//       return null;
//     }
//     return score + midExam + assignmentRe;
//   };

//   const calculateGrade = (totalScore: number | null) => {
//     if (totalScore === null) return "NG";
//     if (totalScore >= 95) return "A+";
//     if (totalScore >= 80) return "A";
//     if (totalScore >= 78 && totalScore <= 79) return "A-";
//     if (totalScore >= 75 && totalScore <= 77) return "B+";
//     if (totalScore >= 70 && totalScore <= 74) return "B";
//     if (totalScore >= 65 && totalScore <= 69) return "B-";
//     if (totalScore >= 60 && totalScore <= 64) return "C+";
//     if (totalScore >= 50 && totalScore <= 59) return "C";
//     if (totalScore >= 45 && totalScore <= 49) return "C-";
//     if (totalScore >= 35) return "D";
//     return "F";
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white shadow-lg rounded-lg">
//       <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Student Results</h1>
//       {error && (
//         <p className="text-center text-red-500 mb-4">
//           {error}
//         </p>
//       )}
//       <table className="min-w-full table-auto bg-white border-separate border-spacing-0 shadow-md rounded-lg">
//         <thead className="bg-blue-600 text-white">
//           <tr>
//             <th className="px-6 py-3 text-left text-sm font-medium">Courses</th>
//             <th className="px-6 py-3 text-center text-sm font-medium">Score</th>
//             <th className="px-6 py-3 text-center text-sm font-medium">Mid Exam</th>
//             <th className="px-6 py-3 text-center text-sm font-medium">Assignment Re</th>
//             <th className="px-6 py-3 text-center text-sm font-medium">Total Score</th>
//             <th className="px-6 py-3 text-center text-sm font-medium">Grade</th>
//           </tr>
//         </thead>
//         <tbody>
//           {results.length > 0 ? (
//             results.map((result) => {
//               const totalScore = calculateTotalScore(result.score, result.midexam, result.assignmentRe);
//               const grade = calculateGrade(totalScore);

//               return (
//                 <tr key={result.id} className="border-b hover:bg-gray-100">
//                   <td className="px-6 py-4 text-center text-sm text-gray-700">{result.courseName}</td>
//                   <td className="px-6 py-4 text-center text-sm text-gray-700">{result.score}</td>
//                   <td className="px-6 py-4 text-center text-sm text-gray-700">{result.midexam}</td>
//                   <td className="px-6 py-4 text-center text-sm text-gray-700">{result.assignmentRe}</td>
//                   <td className="px-6 py-4 text-center text-sm font-semibold text-gray-800">
//                     {totalScore !== null ? totalScore : "N/A"}
//                   </td>
//                   <td
//                     className={`px-6 py-4 text-center text-sm font-semibold ${
//                       grade === "NG"
//                         ? "text-red-500"
//                         : grade === "F"
//                         ? "text-red-600"
//                         : "text-gray-800"
//                     }`}
//                   >
//                     {grade}
//                   </td>
//                 </tr>
//               );
//             })
//           ) : (
//             <tr>
//               <td colSpan={6} className="text-center px-6 py-4 text-sm text-gray-500 italic">
//                 No results available
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ResultTable;


"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const ResultTable: React.FC = () => {
  const { id: studentId } = useParams() as { id: string };
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cgpa, setCgpa] = useState<number | null>(null);

  useEffect(() => {
    if (studentId) {
      const fetchResults = async () => {
        try {
          const response = await axios.get(`/api/student/${studentId}`);
          setResults(response.data);
          setError(null);
        } catch (error: any) {
          console.error("Error fetching results:", error);
          setError(error.response?.data?.error || "Failed to fetch results.");
        }
      };

      fetchResults();
    }
  }, [studentId]);

  const calculateTotalScore = (score: number, midExam: number, assignmentRe: number) => {
    if (score == null || midExam == null || assignmentRe == null) return null;
    return score + midExam + assignmentRe;
  };

  const calculateGrade = (totalScore: number | null) => {
    if (totalScore === null) return "NG";
    if (totalScore >= 95) return "A+";
    if (totalScore >= 80) return "A";
    if (totalScore >= 78 && totalScore <= 79) return "A-";
    if (totalScore >= 75 && totalScore <= 77) return "B+";
    if (totalScore >= 70 && totalScore <= 74) return "B";
    if (totalScore >= 65 && totalScore <= 69) return "B-";
    if (totalScore >= 60 && totalScore <= 64) return "C+";
    if (totalScore >= 50 && totalScore <= 59) return "C";
    if (totalScore >= 45 && totalScore <= 49) return "C-";
    if (totalScore >= 35) return "D";
    return "F";
  };

  const gradeToGP = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return 4.0;
      case "A-":
        return 3.7;
      case "B+":
        return 3.3;
      case "B":
        return 3.0;
      case "B-":
        return 2.7;
      case "C+":
        return 2.3;
      case "C":
        return 2.0;
      case "C-":
        return 1.7;
      case "D":
        return 1.0;
      case "F":
        return 0.0;
      default:
        return 0.0;
    }
  };

  const calculateCGPA = () => {
    let totalGradePoints = 0;
    let totalCreditHours = 0;

    results.forEach((result) => {
      const totalScore = calculateTotalScore(result.score, result.midexam, result.assignmentRe);
      const grade = calculateGrade(totalScore);
      const gradePoint = gradeToGP(grade);

      if (result.creditHour) {
        totalGradePoints += gradePoint * result.creditHour;
        totalCreditHours += result.creditHour;
      }
    });

    if (totalCreditHours > 0) {
      setCgpa(totalGradePoints / totalCreditHours);
    } else {
      setCgpa(null);
    }
  };

  useEffect(() => {
    calculateCGPA();
  }, [results]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Student Results</h1>

      {error && (
        <p className="text-center text-red-500 mb-4">
          {error}
        </p>
      )}

      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          CGPA: {cgpa !== null ? cgpa.toFixed(2) : "N/A"}
        </h2>
      </div>

      <table className="min-w-full table-auto bg-white border-separate border-spacing-0 shadow-md rounded-lg">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium">Courses</th>
            <th className="px-6 py-3 text-center text-sm font-medium">Score</th>
            <th className="px-6 py-3 text-center text-sm font-medium">Mid Exam</th>
            <th className="px-6 py-3 text-center text-sm font-medium">Assignment Re</th>
            <th className="px-6 py-3 text-center text-sm font-medium">Total Score</th>
            <th className="px-6 py-3 text-center text-sm font-medium">Grade</th>
          </tr>
        </thead>
        <tbody>
          {results.length > 0 ? (
            results.map((result) => {
              const totalScore = calculateTotalScore(result.score, result.midexam, result.assignmentRe);
              const grade = calculateGrade(totalScore);

              return (
                <tr key={result.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{result.courseName}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{result.score}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{result.midexam}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{result.assignmentRe}</td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-gray-800">
                    {totalScore !== null ? totalScore : "N/A"}
                  </td>
                  <td
                    className={`px-6 py-4 text-center text-sm font-semibold ${
                      grade === "NG"
                        ? "text-red-500"
                        : grade === "F"
                        ? "text-red-600"
                        : "text-gray-800"
                    }`}
                  >
                    {grade}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="text-center px-6 py-4 text-sm text-gray-500 italic">
                No results available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
