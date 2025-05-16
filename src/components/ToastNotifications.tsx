// // components/ToastNotification.tsx
// "use client";

// import { useEffect } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const ToastNotification = ({ message }: { message: string }) => {
//   useEffect(() => {
//     if (message) {
//       toast.error(message);
//     }
//   }, [message]);

//   return <ToastContainer position='bottom-right'/>;
// };

// export default ToastNotification;



// // // components/ToastNotification.tsx
// "use client";

// import { useEffect } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// type ToastNotificationProps = {
//   message: string;
//   type?: 'success' | 'error'; // Allow specifying success or error
// };

// const ToastNotification = ({ message, type = 'error' }: ToastNotificationProps) => {
//   useEffect(() => {
//     if (message) {
//       if (type === 'success') {
//         toast.success(message);
//       } else {
//         toast.error(message);
//       }
//     }
//   }, [message, type]);

//   return <ToastContainer position="bottom-right" />;
// };

// export default ToastNotification;















// // // components/ToastNotification.tsx
// "use client";

// import { useEffect } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// type ToastNotificationProps = {
//   message: string;
//   type?: 'success' | 'error'; // Allow specifying success or error
// };

// const ToastNotification = ({ message, type = 'error' }: ToastNotificationProps) => {
//   useEffect(() => {
//     if (message) {
//       if (type === 'success') {
//         toast.success(message);
//       } else {
//         toast.error(message);
//       }
//     }
//   }, [message, type]);

//   return <ToastContainer position="bottom-right" />;
// };

// export default ToastNotification;




// src/components/ToastNotifications.tsx
// "use client";

// import { useEffect } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// interface ToastNotificationsProps {
//   message: string;
//   type: "success" | "error";
// }

// const ToastNotifications: React.FC<ToastNotificationsProps> = ({ message, type }) => {
//   useEffect(() => {
//     if (message) {
//       if (type === "success") {
//         toast.success(message);
//       } else {
//         toast.error(message);
//       }
//     }
//   }, [message, type]);

//   return <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />;
// };

// export default ToastNotifications;





