import { Redirect } from "expo-router";

import {
  View,
} from "react-native";

import {
  useAuthStore,
} from "@/store/authStore";

export default function Index() {
  const hasHydrated =
    useAuthStore(
      (state) =>
        state.hasHydrated
    );

  const userId =
    useAuthStore(
      (state) =>
        state.user?.id
    );

  if (!hasHydrated) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor:
            "#0B0B0D",
        }}
      />
    );
  }

  return (
    <Redirect
      href={
        userId
          ? "/(tabs)/chats"
          : "/(auth)/login"
      }
    />
  );
}