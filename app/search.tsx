import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { colors, radius } from "@/constants/theme";
import { useChatStore } from "@/store/chatStore";

type Result = { id: string; title: string; subtitle: string; type: "chat" | "message" | "contact" | "group"; chatId?: string };

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const chats = useChatStore((state) => state.chats);
  const messages = useChatStore((state) => state.messages);
  const contacts = useChatStore((state) => state.contacts);
  const communities = useChatStore((state) => state.communities);
  const addRecentSearch = useChatStore((state) => state.addRecentSearch);
  const recentSearches = useChatStore((state) => state.recentSearches);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [] as Result[];
    const chatResults = Object.values(chats)
      .filter((chat) => chat.title.toLowerCase().includes(needle) || chat.subtitle.toLowerCase().includes(needle))
      .map((chat) => ({ id: `chat_${chat.id}`, title: chat.title, subtitle: chat.subtitle, type: chat.isGroup ? "group" : "chat", chatId: chat.id }) as Result);
    const messageResults = Object.values(messages)
      .filter((message) => message.content.toLowerCase().includes(needle))
      .map((message) => ({ id: `msg_${message.id}`, title: message.content, subtitle: chats[message.chatId]?.title ?? "Message", type: "message", chatId: message.chatId }) as Result);
    const contactResults = Object.values(contacts)
      .filter((contact) => contact.name.toLowerCase().includes(needle))
      .map((contact) => ({ id: `contact_${contact.id}`, title: contact.name, subtitle: contact.isRegistered ? "On MeshLink" : "Invite contact", type: "contact" }) as Result);
    const communityResults = communities
      .filter((community) => community.name.toLowerCase().includes(needle))
      .map((community) => ({ id: `comm_${community.id}`, title: community.name, subtitle: community.description, type: "group" }) as Result);
    return [...chatResults, ...messageResults, ...contactResults, ...communityResults];
  }, [chats, communities, contacts, messages, query]);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.textPrimary} /></Pressable>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput value={query} onChangeText={setQuery} autoFocus placeholder="Search chats, contacts, messages" placeholderTextColor={colors.textSecondary} style={styles.input} />
        </View>
      </View>
      {!query ? (
        <View style={styles.recent}>
          <Text style={styles.section}>Recent searches</Text>
          {recentSearches.map((item) => <Text key={item} style={styles.recentItem}>{item}</Text>)}
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.result}
              onPress={() => {
                addRecentSearch(query);
                if (item.chatId) router.push(`/chat/${item.chatId}`);
              }}
            >
              <Ionicons name={item.type === "message" ? "chatbox" : item.type === "contact" ? "person" : "people"} size={20} color={colors.online} />
              <View style={{ flex: 1 }}>
                <Text style={styles.resultTitle}>{item.title}</Text>
                <Text numberOfLines={1} style={styles.resultSubtitle}>{item.subtitle}</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", flexDirection: "row", gap: 12, padding: 16 },
  search: { alignItems: "center", backgroundColor: colors.card, borderRadius: radius.md, flex: 1, flexDirection: "row", gap: 9, paddingHorizontal: 12 },
  input: { color: colors.textPrimary, flex: 1, height: 46 },
  list: { gap: 8, padding: 16 },
  result: { alignItems: "center", backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flexDirection: "row", gap: 12, padding: 13 },
  resultTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: "800" },
  resultSubtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 3 },
  recent: { padding: 18 },
  section: { color: colors.textPrimary, fontSize: 17, fontWeight: "900", marginBottom: 12 },
  recentItem: { color: colors.textSecondary, fontSize: 14, paddingVertical: 8 }
});
