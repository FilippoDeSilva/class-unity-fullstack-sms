"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { StreamChat, Channel as StreamChatChannel } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
  useChannelStateContext,
  LoadingIndicator,
  defaultReactionOptions,
} from "stream-chat-react";

import "stream-chat-react/dist/css/v2/index.css";
import "stream-chat-react/css/v2/emoji-mart.css";
import { EmojiPicker } from 'stream-chat-react/emojis';
import { useUser } from "@/app/context/userContext";
import {
  IoAdd,
  IoEllipsisVertical,
  IoImage,
  IoPersonRemove,
} from "react-icons/io5";
import Image from "next/image";
import { Viewport } from "next";
export const metadata = {
  title: "Class-Unity | Chat"
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

// Define the User type
interface User {
  id: string;
  name?: string;
  role?: string;
  imageUrl?: string; 
}

// Add these interfaces at the top of the file with your other interfaces
interface ChannelMember {
  user?: {
    id: string;
    name: string;
    image?: string;
  };
}

interface ChannelState {
  members: { [key: string]: ChannelMember };
}

const CustomChannelPreview = (props: any) => {
  const { channel, setActiveChannel } = props;
  const { messages } = channel.state;
  const lastMessage = messages[messages.length - 1];

  // Helper function to get the channel display name
  const getChannelName = () => {
    return channel.data?.name;
  };

  // Helper function to get the member name
  const getMemberName = () => {
    if (channel.data?.member_count >= 1) {
      const members = Object.values(channel.state.members as ChannelState['members']);
      return members[0]?.user?.name;
    }
    return "";
  };

  return (
    <div
      onClick={() => setActiveChannel(channel)}
      className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center border-b relative"
    >
      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3 overflow-hidden">
        {channel.data?.image ? (
          <Image
            src={channel.data.image}
            alt={getChannelName()}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        ) : channel.data?.member_count === 2 ? (
          <Image
            src={channel.state.members[Object.keys(channel.state.members)[0]]?.user?.image}
            alt={getChannelName()}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        ) : (
          getChannelName()[0]?.toUpperCase() || "#"
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="font-semibold text-gray-800 truncate">
          {getChannelName()}
        </p>
        <p className="text-sm text-gray-500 truncate">
          {getMemberName()}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {lastMessage ? lastMessage.text : "No messages yet"}
        </p>
      </div>
    </div>
  );
};

const CustomChannelHeader = () => {
  const { channel } = useChannelStateContext();
  const { user } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showRemoveUserModal, setShowRemoveUserModal] = useState(false);

  const deleteChannel = async () => {
    try {
      await channel.delete();
      setShowDeleteModal(false);
      setShowMenu(false);
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  };

  return (
    <div className="p-4 border-b flex items-center justify-between bg-white relative">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3 overflow-hidden">
          {channel.data?.image ? (
            <Image
              src={channel.data.image}
              alt={channel.data?.name ?? 'Channel image'}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : channel.data?.member_count === 2 ? (
            <img
              src={
                channel.state.members[Object.keys(channel.state.members)[0]]
                  ?.user?.image
              }
              alt={channel.data?.name ?? 'User image'}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            channel.data?.name?.[0]?.toUpperCase() || "#"
          )}
        </div>
        <div>
          <h2 className="font-bold text-lg text-gray-800">
            {channel.data?.name || "Unnamed Channel"}
          </h2>
          <p className="text-sm text-gray-500">
            {channel.data?.member_count || 1} members
          </p>
        </div>
      </div>
      {user?.role === "admin" && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <IoEllipsisVertical size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <button
                onClick={() => {
                  setShowAddUserModal(true);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-gray-100"
              >
                Add User
              </button>
              <button
                onClick={() => {
                  setShowRemoveUserModal(true);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-100"
              >
                Remove
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(true);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                Delete Channel
              </button>
            </div>
          )}
        </div>
      )}
      {showDeleteModal && user?.role === "admin" && (
        <DeleteChannelModal
          onClose={() => setShowDeleteModal(false)}
          onDelete={deleteChannel}
        />
      )}
      {showAddUserModal && user?.role !== "student" && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          channel={channel}
        />
      )}
      {showRemoveUserModal && user?.role === "admin" && (
        <RemoveUserModal
          onClose={() => setShowRemoveUserModal(false)}
          channel={channel}
        />
      )}
    </div>
  );
};

interface DeleteChannelModalProps {
  onClose: () => void;
  onDelete: () => void;
}

const DeleteChannelModal: React.FC<DeleteChannelModalProps> = ({
  onClose,
  onDelete,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-lg w-80">
      <h2 className="text-lg font-bold mb-4">Delete Channel</h2>
      <p className="mb-4">
        Are you sure you want to delete this channel? This action cannot be
        undone.
      </p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

interface AddUserModalProps {
  onClose: () => void;
  channel: StreamChatChannel;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, channel }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError("Failed to load users");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddUsers = async () => {
    if (selectedUsers.length === 0) {
      setError("Please select at least one user to add");
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      await channel.addMembers(selectedUsers);
      onClose();
    } catch (error) {
      console.error("Error adding users to channel:", error);
      setError("Failed to add users to channel. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading)
    return (
      <div className="relative flex justify-between">
        <div className="absolute right-2 mr-2 mt-0">
          <LoadingIndicator size={24} />
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Add members?</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={user.id}
                checked={selectedUsers.includes(user.id)}
                onChange={() => handleUserSelect(user.id)}
                className="mr-2"
              />
              <label htmlFor={user.id}>{user.name}</label>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleAddUsers}
            disabled={isAdding}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isAdding ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface RemoveUserModalProps {
  onClose: () => void;
  channel: StreamChatChannel;
}

const RemoveUserModal: React.FC<RemoveUserModalProps> = ({
  onClose,
  channel,
}) => {
  const [members, setMembers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await channel.queryMembers({});
        setMembers(response.members.map((member) => member.user as User));
      } catch (err) {
        setError("Failed to load channel members");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [channel]);

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleRemoveUsers = async () => {
    if (selectedUsers.length === 0) {
      setError("Please select at least one user to remove");
      return;
    }

    setIsRemoving(true);
    setError(null);

    try {
      await channel.removeMembers(selectedUsers);
      onClose();
    } catch (error) {
      console.error("Error removing users from channel:", error);
      setError("Failed to remove members from channel. Please try again.");
    } finally {
      setIsRemoving(false);
    }
  };

  if (isLoading)
    return (
      <div className="relative flex justify-between">
        <div className="absolute right-2 mr-2 mt-0">
          <LoadingIndicator size={24} />
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Remove members?</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={member.id}
                checked={selectedUsers.includes(member.id)}
                onChange={() => handleUserSelect(member.id)}
                className="mr-2"
              />
              <label htmlFor={member.id} className="flex items-center">
                {member.imageUrl && (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                )}
                {member.name || member.id}
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleRemoveUsers}
            disabled={isRemoving || selectedUsers.length === 0}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
          >
            <IoPersonRemove className="mr-2" />
            {isRemoving
              ? "Removing..."
              : `Remove ${selectedUsers.length} User${selectedUsers.length !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateChannelComponent = ({ client }: { client: StreamChat }) => {
  const { user } = useUser();
  const [newChannelName, setNewChannelName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channelImage, setChannelImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setChannelImage(e.target.files[0]);
    }
  };

  const createChannel = async () => {
    if (newChannelName.trim() && client) {
      setIsCreating(true);
      setError(null);
      try {
        const channelName = newChannelName.trim();
        if (channelName.length < 3) {
          throw new Error("Channel name must be at least 3 characters long");
        }

        let imageUrl = "";
        if (channelImage) {
          const formData = new FormData();
          formData.append("file", channelImage);
          formData.append("upload_preset", "classunity"); // Make sure this matches your Cloudinary upload preset

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error("Failed to upload image");
          }

          const data = await response.json();
          imageUrl = data.secure_url;
        }

        const channel = client.channel("messaging", channelName, {
          name: channelName,
          image: imageUrl,
          members: [client.userID!],
        });

        await channel.create();
        setNewChannelName("");
        setChannelImage(null);
        setShowModal(false);
      } catch (error) {
        console.error("Error creating channel:", error);
        setError((error as Error).message || "Failed to create channel");
      } finally {
        setIsCreating(false);
      }
    } else {
      setError("Please enter a valid channel name");
    }
  };

  return (
    <>
      {user?.role === "admin" && (
        <button
          onClick={() => setShowModal(true)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <IoAdd size={24} />
        </button>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Create New Channel</h2>
            <input
              type="text"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="Channel name"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="mb-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <IoImage className="mr-2" />
                {channelImage ? "Change Image" : "Upload Channel Image"}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              {channelImage && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {channelImage.name}
                </p>
              )}
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setError(null);
                  setNewChannelName("");
                  setChannelImage(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={createChannel}
                disabled={isCreating}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ChatSkeleton = () => (
  <div className="h-[calc(100vh-4rem)] flex flex-col sm:flex-row bg-gray-100 animate-pulse gap-2">
    <div className="w-full sm:w-1/4 border-r bg-white rounded-lg">
      <div className="p-4 border-b">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="flex-1 flex flex-col bg-white rounded-lg">
      <div className="p-4 border-b">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="flex-1 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const ChatComponent: React.FC = () => {
  const { user } = useUser();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initChat = async () => {
      if (!user || !user.id) return;

      try {
        setIsLoading(true);
        // First, sync users
        await fetch("/api/sync-users", { method: "POST" });

        // Then, get the token and initialize chat
        const response = await fetch(`/api/stream-chat-token`);
        if (!response.ok) {
          throw new Error("Failed to fetch chat token");
        }
        const { token, apiKey } = await response.json();

        const client = StreamChat.getInstance(apiKey);
        await client.connectUser(
          {
            id: user.id,
            name: user.name,
            role: user.role,
            image: user.imageUrl,
          },
          token
        );

        setChatClient(client);
      } catch (err) {
        console.error("Error initializing chat:", err);
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      initChat();
    }

    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [user]);

  const chatContent = useMemo(() => {
    if (isLoading) {
      return <ChatSkeleton />;
    }

    if (error) {
      return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
          <button 
            onClick={() => window.location.reload()} 
            className="ml-4 text-blue-500 hover:underline"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!chatClient || !user) {
      return null;
    }

    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col sm:flex-row bg-gray-100">
        <Chat client={chatClient} theme="messaging light">
          {/* Channel List - Full width on mobile, 1/4 on desktop */}
          <div className="w-full sm:w-1/4 bg-white rounded-lg mb-2 sm:mb-0 sm:mr-2 flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-lg">Channels</h2>
              {user?.role === "admin" && (
                <CreateChannelComponent client={chatClient} />
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChannelList
                filters={{ members: { $in: [user.id] } }}
                sort={{ last_message_at: -1 }}
                options={{ state: true, presence: true, limit: 2 }}
                Preview={CustomChannelPreview}
              />
            </div>
          </div>

          {/* Main Chat Area - Larger height on mobile */}
          <div className="flex-1 flex flex-col bg-white rounded-lg h-[calc(90vh-2.5rem)] sm:h-[calc(100vh-5rem)]">
            <Channel 
              EmojiPicker={EmojiPicker}
              reactionOptions={defaultReactionOptions}
            >
              <Window>
                <CustomChannelHeader />
                <MessageList />
                <MessageInput/>
              </Window>
              {/* <ReactionSelector /> */}
              <Thread />
            </Channel>
          </div>
        </Chat>
      </div>
    );
  }, [isLoading, error, chatClient, user]);

  return chatContent;
};

export default ChatComponent;
