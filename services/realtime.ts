import { socketService } from "@/services/socket";
import { useChatStore } from "@/store/chatStore";
import { Message } from "@/types/domain";

export function startRealtimeSession(token?: string) {
  const socket = socketService.connect(token);
  const store = useChatStore.getState();

  socket.on("connect", () => socket.emit("presence:update", { state: "online" }));
  socket.on("message:new", (message: Message) => store.addMessage(message));
  socket.on("message:delivered", ({ messageId, userId }: { messageId: string; userId: string }) => {
    const current = useChatStore.getState().messages[messageId];
    useChatStore.getState().updateMessage(messageId, {
      status: "delivered",
      deliveredTo: Array.from(new Set([...(current?.deliveredTo ?? []), userId]))
    });
  });
  socket.on("message:seen", ({ messageId, userId }: { messageId: string; userId: string }) => {
    const current = useChatStore.getState().messages[messageId];
    useChatStore.getState().updateMessage(messageId, {
      status: "seen",
      seenBy: Array.from(new Set([...(current?.seenBy ?? []), userId]))
    });
  });
  socket.on("typing", ({ chatId, userId, typing }: { chatId: string; userId: string; typing: boolean }) => {
    useChatStore.getState().setTyping(chatId, userId, typing);
  });
  socket.on("presence:update", ({ userId, state }: { userId: string; state: "online" | "offline" | "typing" }) => {
    useChatStore.getState().setPresence(userId, state);
  });

  return () => socketService.disconnect();
}

export function emitTyping(chatId: string, typing: boolean) {
  socketService.emit("typing", { chatId, typing });
}

export function emitReadReceipt(chatId: string, messageIds: string[]) {
  socketService.emit("message:seen", { chatId, messageIds });
}
