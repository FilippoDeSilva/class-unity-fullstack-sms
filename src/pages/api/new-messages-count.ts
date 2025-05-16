import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { serverClient } from '@/lib/streamChat';
import { ChannelSort, DefaultGenerics } from 'stream-chat';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log("Fetching unread messages for user:", userId);

    // Connect the user to the Stream Chat server
    await serverClient.connectUser({ id: userId }, serverClient.createToken(userId));

    // Get all channels the user is a member of
    const filter = { members: { $in: [userId] } };
    const sort: ChannelSort<DefaultGenerics> = { last_message_at: -1 };

    const channels = await serverClient.queryChannels(filter, sort, {
      state: true,
      watch: false,
      presence: false,
    });

    // Count unread messages across all channels
    let unreadCount = 0;
    for (const channel of channels) {
      const channelUnreadCount = channel.state.unreadCount || 0;
      console.log(`Channel: ${channel.id}, Unread Count: ${channelUnreadCount}`);
      unreadCount += channelUnreadCount;
    }

    console.log("Final unread messages count:", unreadCount);

    // Fetch the user's role from Clerk
    const user = await clerkClient.users.getUser(userId);
    const userRole = (user.publicMetadata.role as string) || 'user'; // Default to 'user' if no role is set

    // Store the unread count in the user's custom data
    await serverClient.upsertUsers([
      {
        id: userId,
        role: userRole,
        unread_messages: unreadCount,
      },
    ]);

    res.status(200).json({ count: unreadCount });

  } catch (error) {
    console.error("Error fetching unread messages count:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Disconnect the user to clean up
    await serverClient.disconnectUser();
  }
}
