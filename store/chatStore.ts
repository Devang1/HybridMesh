import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  Chat,
  CommunityChannel,
  Contact,
  EmergencyAlert,
  Message,
  MessageAttachment,
  RelayPacket,
  StatusStory
} from "@/types/domain";
import { createId } from "@/utils/id";

const now = new Date().toISOString();

const seedContacts: Record<string, Contact> = {
  u2: {
    id: "contact_u2",
    userId: "u2",
    name: "Rescue Lead",
    phoneNumbers: ["+91 98765 43210"],
    normalizedPhones: ["919876543210"],
    isRegistered: true,
    presence: "online",
    lastSeen: now
  },
  u3: {
    id: "contact_u3",
    userId: "u3",
    name: "Medical Tent",
    phoneNumbers: ["+91 90000 11111"],
    normalizedPhones: ["919000011111"],
    isRegistered: true,
    presence: "typing",
    lastSeen: now
  },
  u5: {
    id: "contact_u5",
    userId: "u5",
    name: "Asha Verma",
    phoneNumbers: ["+91 91234 56789"],
    normalizedPhones: ["919123456789"],
    isRegistered: true,
    presence: "online",
    lastSeen: now
  }
};

const seedChats: Record<string, Chat> = {
  c1: {
    id: "c1",
    title: "Rescue Coordination",
    subtitle: "Safe zone opened near Gate 3.",
    unread: 2,
    isGroup: true,
    isEmergency: true,
    isPinned: true,
    participants: ["user_self", "u2", "u3"],
    admins: ["user_self", "u2"],
    typingUserIds: ["u3"],
    groupDescription: "Priority operations channel with mesh relay propagation.",
    lastMessageAt: now
  },
  c2: {
    id: "c2",
    title: "Campus Mesh",
    subtitle: "Testing offline relay simulation.",
    unread: 0,
    isGroup: true,
    participants: ["user_self", "u4"],
    admins: ["user_self"],
    typingUserIds: [],
    groupDescription: "Local campus peer network.",
    lastMessageAt: now
  },
  c3: {
    id: "c3",
    title: "Asha Verma",
    subtitle: "Online via cloud",
    unread: 0,
    isGroup: false,
    participants: ["user_self", "u5"],
    typingUserIds: [],
    lastMessageAt: now
  }
};

const seedMessages: Record<string, Message> = {
  m1: {
    id: "m1",
    chatId: "c1",
    senderId: "u2",
    content: "Safe zone opened near Gate 3. Mesh relays are carrying updates.",
    createdAt: now,
    status: "seen",
    transport: "mesh",
    routeHistory: ["Gate 1", "Medical Tent", "Gate 3"],
    deliveredTo: ["user_self"],
    seenBy: ["user_self"]
  },
  m2: {
    id: "m2",
    chatId: "c1",
    senderId: "user_self",
    content: "Acknowledged. Sending volunteers to the north corridor.",
    createdAt: now,
    status: "seen",
    transport: "cloud",
    routeHistory: ["device", "server"],
    deliveredTo: ["u2", "u3"],
    seenBy: ["u2"]
  },
  m3: {
    id: "m3",
    chatId: "c2",
    senderId: "u4",
    content: "Testing offline relay simulation. Latency is stable.",
    createdAt: now,
    status: "relaying",
    transport: "mesh",
    routeHistory: ["Campus Node", "Library Relay"],
    reactions: [{ userId: "user_self", emoji: "⚡", createdAt: now }]
  }
};

type ChatState = {
  chats: Record<string, Chat>;
  messages: Record<string, Message>;
  contacts: Record<string, Contact>;
  pendingMessageIds: string[];
  relayPackets: RelayPacket[];
  emergencyAlerts: EmergencyAlert[];
  communities: CommunityChannel[];
  stories: StatusStory[];
  recentSearches: string[];
  addMessage: (message: Message) => void;
  createTextMessage: (chatId: string, content: string, attachments?: MessageAttachment[]) => Message;
  updateMessage: (messageId: string, patch: Partial<Message>) => void;
  markChatRead: (chatId: string) => void;
  queueMessage: (messageId: string) => void;
  clearPendingMessage: (messageId: string) => void;
  upsertContacts: (contacts: Contact[]) => void;
  startDirectChat: (contact: Contact) => string;
  createGroup: (title: string, members: Contact[]) => string;
  setTyping: (chatId: string, userId: string, typing: boolean) => void;
  setPresence: (userId: string, presence: Contact["presence"]) => void;
  togglePinned: (chatId: string) => void;
  toggleMuted: (chatId: string) => void;
  archiveChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  addRelayPacket: (message: Message, hops: string[]) => void;
  acknowledgeRelay: (messageId: string, peerName: string) => void;
  createEmergencyAlert: (body: string, locationLabel: string) => EmergencyAlert;
  addStory: (story: Omit<StatusStory, "id" | "createdAt" | "expiresAt" | "viewedBy" | "reactions">) => void;
  addRecentSearch: (query: string) => void;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: seedChats,
      messages: seedMessages,
      contacts: seedContacts,
      pendingMessageIds: [],
      relayPackets: [],
      emergencyAlerts: [
        {
          id: "e1",
          title: "Medical priority",
          body: "First-aid station needs backup batteries.",
          locationLabel: "Sector 4",
          priority: "high",
          createdAt: now,
          status: "relayed"
        }
      ],
      communities: [
        {
          id: "community_disaster",
          name: "Disaster Response",
          description: "Priority broadcasts, rescue updates, and safe-zone coordination.",
          members: 1240,
          unread: 4,
          mode: "hybrid"
        },
        {
          id: "community_campus",
          name: "Campus Mesh",
          description: "Local peer network for students, events, and outages.",
          members: 806,
          unread: 0,
          mode: "offline"
        },
        {
          id: "community_events",
          name: "Event Ops",
          description: "Crowd-safe messaging with relay fallback.",
          members: 432,
          unread: 7,
          mode: "online"
        }
      ],
      stories: [
        {
          id: "story_asha",
          userId: "u5",
          authorName: "Asha Verma",
          text: "Network is stable near the east gate.",
          createdAt: now,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          viewedBy: [],
          reactions: []
        }
      ],
      recentSearches: [],
      addMessage: (message) =>
        set((state) => {
          const existingChat = state.chats[message.chatId];
          return {
            messages: { ...state.messages, [message.id]: message },
            chats: {
              ...state.chats,
              [message.chatId]: {
                ...existingChat,
                lastMessageAt: message.createdAt,
                subtitle: message.content || attachmentLabel(message.attachments),
                unread: message.senderId === "user_self" ? existingChat.unread : existingChat.unread + 1
              }
            }
          };
        }),
      createTextMessage: (chatId, content, attachments = []) => {
        const message: Message = {
          id: createId("msg"),
          chatId,
          senderId: "user_self",
          content,
          attachments,
          voiceUri: attachments.find((attachment) => attachment.type === "voice")?.uri,
          mediaUri: attachments.find((attachment) => attachment.type === "image" || attachment.type === "video")?.uri,
          createdAt: new Date().toISOString(),
          status: "sending",
          transport: "queue",
          routeHistory: ["device"],
          deliveredTo: [],
          seenBy: [],
          encryptedPayload: `local.enc.${encodeURIComponent(content || attachmentLabel(attachments))}`
        };
        get().addMessage(message);
        return message;
      },
      updateMessage: (messageId, patch) =>
        set((state) => {
          const current = state.messages[messageId];
          if (!current) return {};
          return {
            messages: {
              ...state.messages,
              [messageId]: { ...current, ...patch }
            }
          };
        }),
      markChatRead: (chatId) =>
        set((state) => ({
          chats: { ...state.chats, [chatId]: { ...state.chats[chatId], unread: 0 } }
        })),
      queueMessage: (messageId) =>
        set((state) => ({
          pendingMessageIds: state.pendingMessageIds.includes(messageId)
            ? state.pendingMessageIds
            : [...state.pendingMessageIds, messageId]
        })),
      clearPendingMessage: (messageId) =>
        set((state) => ({ pendingMessageIds: state.pendingMessageIds.filter((id) => id !== messageId) })),
      upsertContacts: (contacts) =>
        set((state) => ({
          contacts: contacts.reduce(
            (acc, contact) => {
              acc[contact.userId ?? contact.id] = contact;
              return acc;
            },
            { ...state.contacts }
          )
        })),
      startDirectChat: (contact) => {
        const existing = Object.values(get().chats).find((chat) => !chat.isGroup && contact.userId && chat.participants.includes(contact.userId));
        if (existing) return existing.id;

        const chatId = createId("chat");
        set((state) => ({
          chats: {
            ...state.chats,
            [chatId]: {
              id: chatId,
              title: contact.name,
              subtitle: contact.isRegistered ? "Say hello securely" : "Invite to MeshLink",
              unread: 0,
              isGroup: false,
              participants: ["user_self", contact.userId ?? contact.id],
              typingUserIds: [],
              lastMessageAt: new Date().toISOString()
            }
          }
        }));
        return chatId;
      },
      createGroup: (title, members) => {
        const chatId = createId("group");
        set((state) => ({
          chats: {
            ...state.chats,
            [chatId]: {
              id: chatId,
              title,
              subtitle: `${members.length + 1} members`,
              unread: 0,
              isGroup: true,
              participants: ["user_self", ...members.map((member) => member.userId ?? member.id)],
              admins: ["user_self"],
              typingUserIds: [],
              groupDescription: "Hybrid encrypted group",
              lastMessageAt: new Date().toISOString()
            }
          }
        }));
        return chatId;
      },
      setTyping: (chatId, userId, typing) =>
        set((state) => {
          const chat = state.chats[chatId];
          if (!chat) return {};
          const typingUserIds = typing
            ? Array.from(new Set([...(chat.typingUserIds ?? []), userId]))
            : (chat.typingUserIds ?? []).filter((id) => id !== userId);
          return { chats: { ...state.chats, [chatId]: { ...chat, typingUserIds } } };
        }),
      setPresence: (userId, presence) =>
        set((state) => {
          const contact = state.contacts[userId];
          if (!contact) return {};
          return {
            contacts: {
              ...state.contacts,
              [userId]: { ...contact, presence, lastSeen: new Date().toISOString() }
            }
          };
        }),
      togglePinned: (chatId) =>
        set((state) => ({ chats: { ...state.chats, [chatId]: { ...state.chats[chatId], isPinned: !state.chats[chatId].isPinned } } })),
      toggleMuted: (chatId) =>
        set((state) => ({ chats: { ...state.chats, [chatId]: { ...state.chats[chatId], isMuted: !state.chats[chatId].isMuted } } })),
      archiveChat: (chatId) =>
        set((state) => ({ chats: { ...state.chats, [chatId]: { ...state.chats[chatId], isArchived: true } } })),
      deleteChat: (chatId) =>
        set((state) => {
          const { [chatId]: _removed, ...remainingChats } = state.chats;
          const remainingMessages = Object.fromEntries(Object.entries(state.messages).filter(([, message]) => message.chatId !== chatId));
          return { chats: remainingChats, messages: remainingMessages };
        }),
      addReaction: (messageId, emoji) =>
        set((state) => {
          const message = state.messages[messageId];
          if (!message) return {};
          const reactions = [...(message.reactions ?? []).filter((reaction) => reaction.userId !== "user_self"), { userId: "user_self", emoji, createdAt: new Date().toISOString() }];
          return { messages: { ...state.messages, [messageId]: { ...message, reactions } } };
        }),
      addRelayPacket: (message, hops) =>
        set((state) => ({
          relayPackets: [
            {
              id: createId("packet"),
              messageId: message.id,
              chatId: message.chatId,
              status: "relaying",
              hops,
              acknowledgements: [],
              createdAt: new Date().toISOString()
            },
            ...state.relayPackets
          ]
        })),
      acknowledgeRelay: (messageId, peerName) =>
        set((state) => ({
          relayPackets: state.relayPackets.map((packet) =>
            packet.messageId === messageId
              ? {
                  ...packet,
                  status: "acknowledged",
                  acknowledgements: Array.from(new Set([...packet.acknowledgements, peerName]))
                }
              : packet
          )
        })),
      createEmergencyAlert: (body, locationLabel) => {
        const alert: EmergencyAlert = {
          id: createId("sos"),
          title: "SOS broadcast",
          body,
          locationLabel,
          priority: "critical",
          createdAt: new Date().toISOString(),
          status: "broadcasting"
        };
        set((state) => ({ emergencyAlerts: [alert, ...state.emergencyAlerts] }));
        return alert;
      },
      addStory: (story) =>
        set((state) => ({
          stories: [
            {
              ...story,
              id: createId("story"),
              createdAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
              viewedBy: [],
              reactions: []
            },
            ...state.stories
          ]
        })),
      addRecentSearch: (query) =>
        set((state) => ({
          recentSearches: query.trim()
            ? [query.trim(), ...state.recentSearches.filter((item) => item !== query.trim())].slice(0, 6)
            : state.recentSearches
        }))
    }),
    {
      name: "meshlink-chat",
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      merge: (persisted, current) => ({ ...current, ...(persisted as Partial<ChatState>) })
    }
  )
);

function attachmentLabel(attachments?: MessageAttachment[]) {
  const first = attachments?.[0];
  if (!first) return "Encrypted message";
  if (first.type === "image") return "Photo";
  if (first.type === "video") return "Video";
  if (first.type === "voice") return "Voice note";
  if (first.type === "location") return "Location";
  return first.name ?? "Document";
}
