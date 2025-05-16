import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import 'react-toastify/dist/ReactToastify.css';
import "stream-chat-react/dist/css/v2/index.css";  // Version 2 and above
import '@fortawesome/fontawesome-svg-core/styles.css';
// import './clerk-theme.css';  // Add this line
import { ToastContainer } from "react-toastify";
const inter = Inter({ subsets: ["latin"] });
import InstallPWA from '@/components/InstallPWA';
export const metadata: Metadata = {
  title: "Class-Unity School Management System",
  description: "Next.js School Management System",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Class-Unity School Management System',
  },
  formatDetection: {
    telephone: false,
  },
  // themeColor: '#000000',
  // viewport: {
  //   width: 'device-width',
  //   initialScale: 1,
  //   maximumScale: 1,
  // },
  icons: [
    { rel: 'apple-touch-icon', url: '/cpu-logo-192.png' },
    { rel: 'icon', url: '/cpu-logo-512.png' },
  ],
};

// export const viewport: Viewport = {
//   width: 'device-width',
//   initialScale: 1,
//   minimumScale: 1,
//   viewportFit: 'cover',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="stylesheet" href="/globals.css" /> 
        </head>
        <body className={`${inter.className} antialiased`} suppressHydrationWarning>
          <ServiceWorkerRegistration />
          <InstallPWA />
          {children}
          <ToastContainer position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
