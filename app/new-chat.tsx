import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { colors, radius } from "@/constants/theme";
import { syncDeviceContacts } from "@/services/contacts";
import { useChatStore } from "@/store/chatStore";

export default function NewChatScreen() {
  const [query, setQuery] = useState("");
  const contactsMap = useChatStore((state) => state.contacts);
  const upsertContacts = useChatStore((state) => state.upsertContacts);
  const startDirectChat = useChatStore((state) => state.startDirectChat);
  const contacts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return Object.values(contactsMap)
      .filter((contact) => !needle || contact.name.toLowerCase().includes(needle) || contact.phoneNumbers.join(" ").includes(needle))
      .sort((a, b) => Number(b.isRegistered) - Number(a.isRegistered) || a.name.localeCompare(b.name));
  }, [contactsMap, query]);

  const sync = async () => {
    await Haptics.selectionAsync();
    const synced = await syncDeviceContacts();
    upsertContacts(synced);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>New chat</Text>
          <Text style={styles.subtitle}>{contacts.length} contacts</Text>
        </View>
        <Pressable onPress={() => router.push("/new-group")} style={styles.iconButton}>
          <Ionicons name="people" size={21} color={colors.online} />
        </Pressable>
      </View>

      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Search name or number" placeholderTextColor={colors.textSecondary} style={styles.input} />
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={sync}>
          <Ionicons name="sync" size={20} color={colors.online} />
          <Text style={styles.actionText}>Sync phone contacts</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={() => router.push("/new-group")}>
          <Ionicons name="people-circle" size={22} color={colors.success} />
          <Text style={styles.actionText}>New group</Text>
        </Pressable>
      </View>

      <View style={styles.listWrap}>
        <SectionHeader title="Contacts on MeshLink" action="Invite" />
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.userId ?? item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.contact}
              onPress={() => {
                const chatId = startDirectChat(item);
                router.replace(`/chat/${chatId}`);
              }}
            >
              <Image source={{ uri: item.avatarUrl ?? `https://api.dicebear.com/8.x/shapes/svg?seed=${item.name}` }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.isRegistered ? `${item.presence} · secure chat available` : "Invite to MeshLink"}</Text>
              </View>
              <Ionicons name={item.isRegistered ? "chatbubble-ellipses" : "person-add"} size={20} color={item.isRegistered ? colors.online : colors.textSecondary} />
            </Pressable>
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", flexDirection: "row", gap: 14, padding: 16 },
  iconButton: { alignItems: "center", backgroundColor: colors.card, borderColor: colors.border, borderRadius: 22, borderWidth: 1, height: 44, justifyContent: "center", width: 44 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: "900" },
  subtitle: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  search: { alignItems: "center", backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flexDirection: "row", gap: 10, marginHorizontal: 16, paddingHorizontal: 13 },
  input: { color: colors.textPrimary, flex: 1, height: 46 },
  actions: { gap: 10, padding: 16 },
  action: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flexDirection: "row", gap: 12, padding: 14 },
  actionText: { color: colors.textPrimary, fontSize: 15, fontWeight: "800" },
  listWrap: { flex: 1, paddingHorizontal: 16 },
  list: { gap: 8, paddingBottom: 30 },
  contact: { alignItems: "center", flexDirection: "row", gap: 12, paddingVertical: 10 },
  avatar: { backgroundColor: colors.surface, borderRadius: 24, height: 48, width: 48 },
  name: { color: colors.textPrimary, fontSize: 16, fontWeight: "800" },
  meta: { color: colors.textSecondary, fontSize: 12, marginTop: 3 }
});
