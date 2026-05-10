import { create } from "zustand";

type NetworkState = {
  mode: "online" | "offline" | "hybrid";
  socketConnected: boolean;
  meshPeers: number;
  setMode: (mode: NetworkState["mode"]) => void;
  setSocketConnected: (connected: boolean) => void;
  setMeshPeers: (count: number) => void;
};

export const useNetworkStore = create<NetworkState>((set) => ({
  mode: "hybrid",
  socketConnected: false,
  meshPeers: 0,
  setMode: (mode) => set({ mode }),
  setSocketConnected: (socketConnected) => set({ socketConnected }),
  setMeshPeers: (meshPeers) => set({ meshPeers })
}));
