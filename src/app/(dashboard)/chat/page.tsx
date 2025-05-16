import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { UserProvider } from '@/app/context/userContext'
import { Viewport } from "next";
const ChatComponent = dynamic(() => import('@/components/ChatComponent'), {
  ssr: false,
})

export const metadata = {
  title: "Class-Unity | Chat"
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function ChatPage() {
  return (
    <UserProvider>
      <div className="flex-1 flex flex-col w-full px-4 sm:px-6 lg:px-8">
        <ChatComponent />
      </div>
    </UserProvider>
  )
}
