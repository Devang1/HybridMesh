import { Message, NearbyPeer } from "@/types/domain";
import { createId } from "@/utils/id";
import { DeliveryResult, MeshTransport } from "./types";

const peerNames = ["Asha Relay", "Campus Node", "Rescue-12", "Metro Bridge", "Event Hub"];

export const mockMeshTransport: MeshTransport = {
  id: "mesh",
  async isAvailable() {
    return true;
  },
  async scanPeers(): Promise<NearbyPeer[]> {
    return peerNames.map((name, index) => ({
      id: createId("peer"),
      name,
      signalStrength: Math.max(42, 96 - index * 11 - Math.floor(Math.random() * 8)),
      batteryLevel: Math.max(24, 88 - index * 9),
      hopCount: index + 1,
      transport: index % 2 === 0 ? "BLE_SIM" : "WIFI_DIRECT_SIM",
      lastSeen: new Date(Date.now() - index * 90000).toISOString()
    }));
  },
  async send(message: Message): Promise<DeliveryResult> {
    const peers = await this.scanPeers();
    return this.relay(message, peers);
  },
  async relay(_message: Message, peers: NearbyPeer[]): Promise<DeliveryResult> {
    const route = ["device", ...peers.slice(0, 3).map((peer) => peer.name), "recipient-cache"];
    return { ok: true, transport: "mesh", routeHistory: route };
  }
};
