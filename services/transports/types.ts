import { Message, NearbyPeer, TransportType } from "@/types/domain";

export type DeliveryResult = {
  ok: boolean;
  transport: TransportType;
  routeHistory: string[];
  queued?: boolean;
  error?: string;
};

export interface MessageTransport {
  readonly id: TransportType;
  isAvailable(): Promise<boolean>;
  send(message: Message): Promise<DeliveryResult>;
}

export interface MeshTransport extends MessageTransport {
  scanPeers(): Promise<NearbyPeer[]>;
  relay(message: Message, peers: NearbyPeer[]): Promise<DeliveryResult>;
}
