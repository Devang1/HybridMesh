import { Message } from "@/types/domain";
import { socketService } from "@/services/socket";
import { DeliveryResult, MessageTransport } from "./types";

export const cloudTransport: MessageTransport = {
  id: "cloud",
  async isAvailable() {
    return socketService.isConnected();
  },
  async send(message: Message): Promise<DeliveryResult> {
    if (!socketService.isConnected()) {
      return { ok: false, transport: "queue", routeHistory: ["local-queue"], queued: true };
    }

    socketService.emit("message:send", message);
    return { ok: true, transport: "cloud", routeHistory: ["device", "socket", "server"], queued: false };
  }
};
