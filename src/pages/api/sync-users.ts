import { NextApiRequest, NextApiResponse } from 'next';
import { clerkClient } from '@clerk/nextjs/server';
import { StreamChat } from 'stream-chat';

// This is a cron job that syncs the users from Clerk to Stream Chat
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API;
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ message: 'Server configuration error' });
  }

  try {
    const serverClient = StreamChat.getInstance(apiKey, apiSecret);
    
    // Fetch all users from Clerk
    let clerkUsers;
    try {
      const clerkUsersResponse = await clerkClient.users.getUserList();
      clerkUsers = clerkUsersResponse.data;
    } catch (clerkError) {
      console.error('Error fetching users from Clerk:', clerkError);
      throw clerkError;
    }

    // Sync each user to Stream Chat
    for (const user of clerkUsers) {
      try {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        await serverClient.upsertUser({
          id: user.id,
          name: fullName || user.username || '',
          role: (user.publicMetadata.role as string) || 'student',
          image: user.imageUrl || 'Undefined',
        });
      } catch (streamError) {
        console.error('Error upserting user to Stream:', streamError);
        console.error('User data:', JSON.stringify(user, null, 2));
        throw streamError;
      }
    }

    res.status(200).json({ message: 'Users synced successfully' });
  } catch (error) {
    console.error('Error syncing users:', error);
    res.status(500).json({ message: 'Error syncing users', error: (error as Error).message });
  }
}
