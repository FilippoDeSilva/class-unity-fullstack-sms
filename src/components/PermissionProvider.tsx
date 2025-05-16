import React from 'react'
import { useUser } from '@/app/context/userContext'

type UserRole = 'admin' | 'teacher' | 'student'

interface PermissionProviderProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
  allowedRoles,
}) => {
  const { user } = useUser()

  if (!user || !allowedRoles.includes(user.role as UserRole)) {
    return null
  }

  return <>{children}</>
}

export default PermissionProvider
