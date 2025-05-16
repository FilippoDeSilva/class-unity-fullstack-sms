'use client';

import { useState, useEffect } from 'react';
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from 'next/link';

const NewMessageIndicator = ({ count, onClick }: { count: number; onClick: () => void }) => {
  return (
    <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative" onClick={onClick}>
      <Link href="/chat">
        <Image src="/message.png" alt="" width={20} height={20} />
        <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
          {count}
        </div>
      </Link>
    </div>
  );
};

const Navbar = () => {
  const { user } = useUser();
  const [newMessages, setNewMessages] = useState(0);
  const [isStreamChatReady, setIsStreamChatReady] = useState(false);

  const handleMessageClick = async () => {
    if (!isStreamChatReady) {
      try {
        const response = await fetch('/api/stream-chat-token');
        if (!response.ok) {
          throw new Error('Failed to fetch StreamChat token');
        }
        const data = await response.json();
        // Here you would typically initialize StreamChat with the token
        // For example: await initializeStreamChat(data.token);
        setIsStreamChatReady(true);
      } catch (error) {
        console.error("Error fetching StreamChat token:", error);
        return; // Don't proceed if there's an error
      }
    }
    
    // Reset the message count to 0
    setNewMessages(0);
    
    // Navigate to the chat page
    window.location.href = '/chat';
  };

  useEffect(() => {
    const fetchNewMessagesCount = async () => {
      try {
        const response = await fetch('/api/new-messages-count');
        if (!response.ok) {
          throw new Error('Failed to fetch new messages count');
        }
        const data = await response.json();
        setNewMessages(data.count);
      } catch (error) {
        console.error("Error fetching new messages count:", error);
        setNewMessages(0);
      }
    };

    fetchNewMessagesCount();
    // Fetch new messages count every 5 minutes
    const interval = setInterval(fetchNewMessagesCount, 0.5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between pl-4 pr-4 pt-2">
      {/* Left Section: Logo and Title */}
      <div className="flex-shrink-0 h-full bg-#F7F8FA  overflow-y-auto lg:p-4 z-10">
      <Link
            href="#"
            className="flex items-center justify-center lg:justify-start gap-2 mb-4"
          >
            <Image src="/cpu-logo.jpg" alt="logo" width={32} height={32} />
            <span className="hidden lg:block font-bold">Class-Unity</span>
          </Link>
      </div>
  
      {/* Right Section: User Info and Actions */}
      <div className="flex items-center gap-6 justify-end w-full">
        <NewMessageIndicator count={newMessages} onClick={handleMessageClick} />
        <div className="flex flex-col text-right">
          <span className="text-xs leading-3 font-medium">
            {user?.username}
          </span>
          <span className="text-[10px] text-gray-500">
            {user?.publicMetadata?.role as string}
          </span>
        </div>
        <UserButton />
      </div>
    </div>
  );
  
};

export default Navbar;



