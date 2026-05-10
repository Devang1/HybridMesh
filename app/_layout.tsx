import "../global.css";

import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  Stack,
} from "expo-router";

import * as SplashScreen from "expo-splash-screen";

import {
  StatusBar,
} from "expo-status-bar";

import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import {
  SafeAreaProvider,
} from "react-native-safe-area-context";

import {
  useAuthStore,
} from "@/store/authStore";
import { startRealtimeSession } from "@/services/realtime";
import { flushPendingMessages } from "@/services/sync";
import { useNetworkStore } from "@/store/networkStore";

// TEMPORARILY DISABLED
// import { registerNotifications } from "@/services/notifications";

SplashScreen.preventAutoHideAsync();

const queryClient =
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30000,
        gcTime:
          1000 * 60 * 15,
        retry: 1,
      },
    },
  });

export default function RootLayout() {
  const hasHydrated =
    useAuthStore(
      (state) =>
        state.hasHydrated
    );
  const token =
    useAuthStore(
      (state) =>
        state.token
    );
  const setMode =
    useNetworkStore(
      (state) =>
        state.setMode
    );

  useEffect(() => {
    const prepare =
      async () => {
        try {
          // DISABLED FOR EXPO GO
          // await registerNotifications();
        } catch (error) {
          console.log(error);
        }
      };

    prepare();
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    return startRealtimeSession(token);
  }, [token]);

  useEffect(() => {
    return NetInfo.addEventListener(
      (state) => {
        const online =
          Boolean(
            state.isConnected
          ) &&
          Boolean(
            state.isInternetReachable ??
              true
          );

        setMode(
          online
            ? "hybrid"
            : "offline"
        );

        if (online) {
          flushPendingMessages();
        }
      }
    );
  }, [setMode]);

  useEffect(() => {
    if (hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [hasHydrated]);

  // IMPORTANT
  if (!hasHydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
    >
      <QueryClientProvider
        client={queryClient}
      >
        <SafeAreaProvider>
          <StatusBar
            style="light"
          />

          <Stack
            screenOptions={{
              headerShown: false,
              animation:
                "fade_from_bottom",
            }}
          >
            <Stack.Screen
              name="index"
            />

            <Stack.Screen
              name="(auth)"
            />

            <Stack.Screen
              name="(tabs)"
            />

            <Stack.Screen
              name="chat/[id]"
              options={{
                animation:
                  "slide_from_right",
              }}
            />
            <Stack.Screen name="new-chat" />
            <Stack.Screen name="new-group" />
            <Stack.Screen name="search" />
            <Stack.Screen name="status" />
            <Stack.Screen name="call/[id]" />
          </Stack>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
