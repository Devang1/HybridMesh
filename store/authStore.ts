import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  deleteSecureItem,
  setSecureItem,
} from "@/services/storage";

import { User } from "@/types/domain";
import { createId } from "@/utils/id";

type AuthState = {
  user?: User;
  token?: string;
  hasHydrated: boolean;

  setHasHydrated: (
    value: boolean
  ) => void;

  signIn: (
    email: string
  ) => Promise<void>;

  signOut: () => Promise<void>;
};

export const useAuthStore =
  create<AuthState>()(
    persist(
      (set) => ({
        user: undefined,
        token: undefined,

        hasHydrated: false,

        setHasHydrated: (
          value
        ) =>
          set((state) => {
            if (
              state.hasHydrated ===
              value
            ) {
              return {};
            }

            return {
              hasHydrated: value,
            };
          }),

        signIn: async (
          email
        ) => {
          try {
            const now =
              new Date().toISOString();

            const token = `demo.${createId(
              "token"
            )}`;

            const user: User = {
              id: "user_self",

              name:
                email
                  ?.split("@")[0] ||
                "Mesh Operator",

              handle: email,

              publicKey:
                createId("pub"),

              lastSeen: now,
            };

            // SAFE FIXED KEY
            await setSecureItem(
              "auth_token",
              token
            );

            set({
              user,
              token,
            });
          } catch (error) {
            console.log(
              "Sign in error:",
              error
            );
          }
        },

        signOut: async () => {
          try {
            await deleteSecureItem(
              "auth_token"
            );

            set({
              user: undefined,
              token: undefined,
            });
          } catch (error) {
            console.log(
              "Sign out error:",
              error
            );
          }
        },
      }),

      {
        name: "meshlink-auth",

        storage:
          createJSONStorage(
            () => AsyncStorage
          ),

        partialize: (
          state
        ) => ({
          user: state.user,
          token: state.token,
        }),

        onRehydrateStorage:
          () => {
            return (
              state
            ) => {
              state?.setHasHydrated(
                true
              );
            };
          },
      }
    )
  );
