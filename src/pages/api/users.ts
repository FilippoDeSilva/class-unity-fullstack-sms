import { NextApiRequest, NextApiResponse } from 'next';
import { clerkClient, User } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const usersResponse = await clerkClient.users.getUserList();
    const simplifiedUsers = usersResponse.data.map((user: User) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
    }));
    res.status(200).json(simplifiedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
}
