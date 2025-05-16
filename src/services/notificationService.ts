import { StreamChat } from 'stream-chat';

export class NotificationService {
  private client: StreamChat;

  constructor(apiKey: string, userId: string, userToken: string) {
    this.client = StreamChat.getInstance(apiKey);
    this.client.connectUser({ id: userId }, userToken);
  }

  async getUnreadCount(): Promise<number> {
    const filter = { members: { $in: [this.client.userID!] } };
    const channels = await this.client.queryChannels(filter, {}, {
      watch: true,
      state: true,
    });

    return channels.reduce((total, channel) => total + channel.state.unreadCount, 0);
  }

  subscribeToUnreadCount(callback: (count: number) => void) {
    this.client.on('notification.message_new', async () => {
      const unreadCount = await this.getUnreadCount();
      callback(unreadCount);
    });
  }

  disconnect() {
    this.client.disconnectUser();
  }
}
