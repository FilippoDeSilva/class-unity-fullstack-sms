// "use client";
// import Image from "next/image";
// import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";


// // const data = [
// //   { name: "Group A", value: 3.5, fill: "#C3EBFA" },
// //   { name: "Group B", value: 0.5, fill: "#FAE27C" },
// // ];

// const Performance = () => {


       
//   const [results, setResults] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const { id } = useParams(); // Get the id from the URL
//   const [cgpa, setCgpa] = useState<number | null>(null);

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

//   // Grade to Grade Point mapping
//   const gradeToGP = (grade: string) => {
//     switch (grade) {
//       case "A+":
//       case "A":
//         return 4.0;
//       case "A-":
//         return 3.7;
//       case "B+":
//         return 3.3;
//       case "B":
//         return 3.0;
//       case "B-":
//         return 2.7;
//       case "C+":
//         return 2.3;
//       case "C":
//         return 2.0;
//       case "C-":
//         return 1.7;
//       case "D":
//         return 1.0;
//       case "F":
//         return 0.0;
//       default:
//         return 0.0; // For NG or any undefined grades
//     }
//   };

//   // Calculate CGPA based on grade points and credit hours
//   const calculateCGPA = () => {
//     let totalGradePoints = 0;
//     let totalCreditHours = 0;

//     results.forEach((result) => {
//       const totalScoreForCourse = calculateTotalScore(
//         result.score,
//         result.midexam,
//         result.assignmentRe
//       );

//       const grade = calculateGrade(totalScoreForCourse);
//       const gradePoint = gradeToGP(grade);

//       if (result.creditHour) {
//         totalGradePoints += gradePoint * result.creditHour;
//         totalCreditHours += result.creditHour;
//       }
//     });

//     if (totalCreditHours > 0) {
//       const cgpaValue = totalGradePoints / totalCreditHours;
//       setCgpa(cgpaValue);
//     } else {
//       setCgpa(null);
//     }
//   };

//   // Recalculate CGPA whenever results change
//   useEffect(() => {
//     calculateCGPA();
//   }, [results]);




//   return (
//     <div className="bg-white p-4 rounded-md h-80 relative">
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold">Performance</h1>
//         <Image src="/moreDark.png" alt="" width={16} height={16} />
//       </div>
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             dataKey="value"
//             startAngle={180}
//             endAngle={0}
//             data={data}
//             cx="50%"
//             cy="50%"
//             innerRadius={70}
//             fill="#8884d8"
//           />
//         </PieChart>
//       </ResponsiveContainer>
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
//         <h1 className="text-3xl font-bold">{cgpa !== null ? cgpa.toFixed(2) : "N/A"}</h1>
//         <p className="text-xs text-gray-300">of 4 max CGPA</p>
//       </div>
//       <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">From Starting Date upto Now</h2>
//     </div>
//   );
// };

// export default Performance;


"use client";
import Image from "next/image";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const Performance = () => {
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams(); // Get the id from the URL
  const [cgpa, setCgpa] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      const fetchResults = async () => {
        try {
          const response = await axios.get(`/api/student/${id}`); // Fetch data with Axios
          setResults(response.data); // Update state with fetched data
          setError(null); // Clear any previous errors
        } catch (error: any) {
          console.error("Error fetching results:", error);
          setError(error.response?.data?.error || "Failed to fetch results.");
        }
      };

      fetchResults();
    }
  }, [id]); // Refetch when id changes

  const calculateTotalScore = (score: number, midExam: number, assignmentRe: number) => {
    if (score == null || midExam == null || assignmentRe == null) {
      return null;
    }
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

  // Grade to Grade Point mapping
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
        return 0.0; // For NG or any undefined grades
    }
  };

  // Calculate CGPA based on grade points and credit hours
  const calculateCGPA = () => {
    let totalGradePoints = 0;
    let totalCreditHours = 0;

    results.forEach((result) => {
      const totalScoreForCourse = calculateTotalScore(
        result.score,
        result.midexam,
        result.assignmentRe
      );

      const grade = calculateGrade(totalScoreForCourse);
      const gradePoint = gradeToGP(grade);

      if (result.creditHour) {
        totalGradePoints += gradePoint * result.creditHour;
        totalCreditHours += result.creditHour;
      }
    });

    if (totalCreditHours > 0) {
      const cgpaValue = totalGradePoints / totalCreditHours;
      setCgpa(cgpaValue);
    } else {
      setCgpa(null);
    }
  };

  // Recalculate CGPA whenever results change
  useEffect(() => {
    calculateCGPA();
  }, [results]);

  // Prepare chart data once CGPA is calculated
  const chartData = cgpa !== null ? [
    { name: "Group A", value: cgpa, fill: cgpa <= 2 ? "#FF4B4B" :  cgpa < 3.2 ? "#FFCC00" : "#4CAF50"  }, 
    { name: "Group B", value: (4 - cgpa), fill: "#D3D3D3" }, 
  ] : [];
  return (
    <div className="bg-white p-4 rounded-md h-80 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Performance</h1>
        <Image src="/moreDark.png" alt="" width={16} height={16} />
      </div>
      {cgpa !== null && (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              fill="#8884d8"
            />
          </PieChart>
        </ResponsiveContainer>
      )}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-bold">{cgpa !== null ? cgpa.toFixed(2) : "N/A"}</h1>
        <p className="text-xs text-gray-300">of 4 max CGPA</p>
      </div>
      <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">From Starting Date upto Now</h2>
    </div>
  );
};

export default Performance;




