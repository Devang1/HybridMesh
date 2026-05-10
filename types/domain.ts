export type TransportType = "cloud" | "mesh" | "queue";
export type MessageStatus = "sending" | "sent" | "pending" | "relaying" | "delivered" | "seen" | "synced" | "failed";
export type PresenceState = "online" | "offline" | "typing" | "recording";
export type AttachmentType = "image" | "video" | "document" | "voice" | "location";

export type User = {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  publicKey: string;
  lastSeen: string;
};

export type Contact = {
  id: string;
  name: string;
  phoneNumbers: string[];
  normalizedPhones: string[];
  avatarUrl?: string;
  isRegistered: boolean;
  userId?: string;
  lastSeen?: string;
  presence: PresenceState;
};

export type Chat = {
  id: string;
  title: string;
  subtitle: string;
  unread: number;
  isGroup: boolean;
  isEmergency?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  groupDescription?: string;
  groupImageUri?: string;
  admins?: string[];
  typingUserIds?: string[];
  participants: string[];
  lastMessageAt: string;
};

export type MessageAttachment = {
  id: string;
  type: AttachmentType;
  uri: string;
  name?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  uploadProgress?: number;
  cachedUri?: string;
};

export type MessageReaction = {
  userId: string;
  emoji: string;
  createdAt: string;
};

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
  status: MessageStatus;
  transport: TransportType;
  routeHistory: string[];
  mediaUri?: string;
  voiceUri?: string;
  encryptedPayload?: string;
  replyToMessageId?: string;
  deliveredTo?: string[];
  seenBy?: string[];
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
};

export type NearbyPeer = {
  id: string;
  name: string;
  signalStrength: number;
  batteryLevel: number;
  hopCount: number;
  transport: "BLE_SIM" | "WIFI_DIRECT_SIM" | "CLOUD";
  lastSeen: string;
};

export type EmergencyAlert = {
  id: string;
  title: string;
  body: string;
  locationLabel: string;
  priority: "high" | "critical";
  createdAt: string;
  status: "broadcasting" | "relayed" | "resolved";
};

export type CommunityChannel = {
  id: string;
  name: string;
  description: string;
  members: number;
  unread: number;
  mode: "online" | "hybrid" | "offline";
};

export type RelayPacket = {
  id: string;
  messageId: string;
  chatId: string;
  status: "queued" | "relaying" | "acknowledged" | "synced";
  hops: string[];
  acknowledgements: string[];
  createdAt: string;
};

export type StatusStory = {
  id: string;
  userId: string;
  authorName: string;
  mediaUri?: string;
  text?: string;
  createdAt: string;
  expiresAt: string;
  viewedBy: string[];
  reactions: MessageReaction[];
};

export type CallSession = {
  id: string;
  chatId: string;
  type: "voice" | "video" | "emergency";
  status: "ringing" | "connecting" | "ended";
  startedAt: string;
};
