import { Message } from "@/types/domain";
import { useChatStore } from "@/store/chatStore";
import { cloudTransport } from "@/services/transports/cloudTransport";
import { mockMeshTransport } from "@/services/transports/mockMeshTransport";

export async function sendWithBestTransport(message: Message) {
  const cloudAvailable = await cloudTransport.isAvailable();
  const result = cloudAvailable ? await cloudTransport.send(message) : await mockMeshTransport.send(message);

  useChatStore.getState().updateMessage(message.id, {
    status: result.ok ? (result.transport === "mesh" ? "relaying" : "sent") : "pending",
    transport: result.transport,
    routeHistory: result.routeHistory,
    attachments: message.attachments?.map((attachment) => ({
      ...attachment,
      uploadProgress: result.ok && result.transport === "cloud" ? 100 : attachment.uploadProgress
    }))
  });

  if (result.transport === "mesh") {
    useChatStore.getState().addRelayPacket(message, result.routeHistory);
  }

  if (!result.ok || result.queued) {
    useChatStore.getState().queueMessage(message.id);
  }
}

export async function flushPendingMessages() {
  const { messages, pendingMessageIds, updateMessage, clearPendingMessage } = useChatStore.getState();
  const pending = pendingMessageIds.map((id) => messages[id]).filter(Boolean);

  for (const message of pending) {
    const result = await cloudTransport.send(message);
    if (result.ok) {
      updateMessage(message.id, { status: "synced", transport: "cloud", routeHistory: result.routeHistory });
      clearPendingMessage(message.id);
    }
  }
}
