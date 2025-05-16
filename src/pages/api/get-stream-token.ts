// import { NextApiRequest, NextApiResponse } from 'next';
// import { StreamChat } from 'stream-chat';
// import { getAuth, clerkClient } from '@clerk/nextjs/server';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const { userId } = getAuth(req);

//   if (!userId) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   const apiKey = process.env.NEXT_PUBLIC_STREAM_API;
//   const apiSecret = process.env.STREAM_API_SECRET;

//   if (!apiKey || !apiSecret) {
//     return res.status(500).json({ message: 'Server configuration error' });
//   }

//   try {
//     const serverClient = StreamChat.getInstance(apiKey, apiSecret);
    
//     // Fetch user details from Clerk
//     const user = await clerkClient.users.getUser(userId);

//     // Create or update user in Stream Chat
//     await serverClient.upsertUser({
//       id: userId,
//       name: `${user.firstName} ${user.lastName}`,
//       // Use a default role instead of custom roles
//       role: 'user',
//     });

//     const token = serverClient.createToken(userId);

//     res.status(200).json({ token, apiKey, userId });
//   } catch (error) {
//     console.error('Error generating token:', error);
//     res.status(500).json({ message: 'Error generating token', error: (error as Error).message });
//   }
// }
