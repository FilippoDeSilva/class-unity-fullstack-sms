'use client';

import React, { createContext, useContext } from 'react'
import { useUser as useClerkUser } from '@clerk/nextjs'

export interface User {
  id: string
  name: string
  role: string
  imageUrl?: string
}

interface UserContextType {
  user: User | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useClerkUser()

  const user: User | null = isLoaded && clerkUser ? {
    id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.username || clerkUser.id,
    role: (clerkUser.publicMetadata.role as string) || 'student',
    imageUrl: clerkUser.imageUrl || undefined
  } : null

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
