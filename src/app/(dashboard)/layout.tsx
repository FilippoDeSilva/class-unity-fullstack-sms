// import Menu from "@/components/Menu";
// import Navbar from "@/components/Navbar";
// import Image from "next/image";
// import Link from "next/link";
// import 'stream-chat-react/dist/css/v2/index.css';  // Version 2 and above
// import { Viewport } from "next";
// export const metadata = {
//   title: "Class-Unity | Dashboard"
// }

// export const viewport: Viewport = {
//   width: "device-width",
//   initialScale: 1,
// }

// export default function DashboardLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <div className="h-screen flex flex-col">
//       <Navbar />
//       <div className="flex flex-grow">
//         {/* LEFT - Sidebar */}
//         <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 h-full overflow-y-auto">
//           <Link
//             href="#"
//             className="flex items-center justify-center lg:justify-start gap-2"
//           >
//             <Image src="/cpu-logo.jpg" alt="logo" width={32} height={32} />
//             <span className="hidden lg:block font-bold">Class-Unity</span>
//           </Link>
//           <Menu />
//         </div>
        
//         {/* RIGHT - Main Content */}
//         <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] flex flex-col h-full overflow-y-auto bg-[#F7F8FA]">
//           <div className="flex-grow">
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import "stream-chat-react/dist/css/v2/index.css"; // Version 2 and above
import { Viewport } from "next";

export const metadata = {
  title: "Class-Unity | Dashboard",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col">
      {/* Top Navbar */}
      
      <Navbar />

      {/* Main Content Area */}
      <div className="flex flex-grow">
        {/* Sidebar - Responsive Width and Equal Height */}
        <div className="flex-shrink-0 h-full bg-#F7F8FA shadow-md overflow-y-auto p-1 lg:p-4 z-10 lg:pt-2">
          {/* <Link
            href="#"
            className="flex items-center justify-center lg:justify-start gap-2 mb-4"
          >
            <Image src="/cpu-logo.jpg" alt="logo" width={32} height={32} />
            <span className="hidden lg:block font-bold">Class-Unity</span>
          </Link> */}
          <Menu />
        </div>

        {/* Right Content Area */}
        <div className="flex-grow h-full overflow-y-auto bg-[#F7F8FA] p-4 pt-1">
          {children}
        </div>
      </div>
    </div>
  );
}


