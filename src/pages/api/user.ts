import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // This is a mock user. In a real application, you would fetch this data from your database or authentication service
  const mockUser = {
    id: '1',
    name: 'John Doe',
    role: 'admin' as const,
  }

  res.status(200).json(mockUser)
}
