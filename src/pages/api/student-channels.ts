import { NextApiRequest, NextApiResponse } from 'next'
import { StreamChat } from 'stream-chat'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { userId } = req.query

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' })
  }

  const apiKey = process.env.STREAM_API_KEY
  const apiSecret = process.env.STREAM_API_SECRET

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ message: 'Server configuration error' })
  }

  const serverClient = StreamChat.getInstance(apiKey, apiSecret)

  try {
    const channels = await serverClient.queryChannels({
      members: { $in: [userId as string] },
      type: 'messaging',
    })

    res.status(200).json({ channels: channels.map(channel => channel.data) })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching channels', error })
  }
}
