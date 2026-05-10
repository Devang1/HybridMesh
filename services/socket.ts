import { io, Socket } from "socket.io-client";
import { Message } from "@/types/domain";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

class SocketService {
  private socket?: Socket;

  connect(token?: string) {
    if (this.socket?.connected) return this.socket;

    this.socket = io(API_URL, {
      transports: ["websocket"],
      autoConnect: true,
      auth: { token }
    });

    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
  }

  isConnected() {
    return Boolean(this.socket?.connected);
  }

  onMessage(handler: (message: Message) => void) {
    this.socket?.on("message:new", handler);
    return () => this.socket?.off("message:new", handler);
  }

  emit(event: string, payload: unknown) {
    this.socket?.emit(event, payload);
  }
}

export const socketService = new SocketService();
