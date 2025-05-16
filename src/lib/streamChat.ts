import { StreamChat } from 'stream-chat';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey) {
  throw new Error('Stream API key is missing');
}

if (!apiSecret) {
  throw new Error('Stream API secret is missing');
}

// Use type assertion to tell TypeScript that these are definitely strings
export const serverClient = StreamChat.getInstance(apiKey as string, apiSecret as string);

let chatClient: StreamChat | null = null;

export function getOrCreateStreamChatClient() {
  if (!chatClient) {
    chatClient = StreamChat.getInstance(apiKey as string);
  }
  return chatClient;
}
