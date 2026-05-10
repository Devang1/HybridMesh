import { useEffect, useMemo } from "react";
import { FlatList, Pressable, SectionList, StyleSheet, Text, View } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { StatusPill } from "@/components/StatusPill";
import { ChatComposer } from "@/features/chat/components/ChatComposer";
import { MessageBubble } from "@/features/chat/components/MessageBubble";
import { colors } from "@/constants/theme";
import { emitReadReceipt, emitTyping } from "@/services/realtime";
import { sendWithBestTransport } from "@/services/sync";
import { Message, MessageAttachment } from "@/types/domain";
import { useChatStore } from "@/store/chatStore";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chat = useChatStore((state) => state.chats[id]);
  const messageMap = useChatStore((state) => state.messages);
  const contacts = useChatStore((state) => state.contacts);
  const relayPackets = useChatStore((state) => state.relayPackets);
  const createTextMessage = useChatStore((state) => state.createTextMessage);
  const markChatRead = useChatStore((state) => state.markChatRead);
  const typingNames = useMemo(() => chat?.typingUserIds?.map((userId) => contacts[userId]?.name).filter(Boolean) ?? [], [chat?.typingUserIds, contacts]);

  const messages = useMemo(
    () => Object.values(messageMap).filter((message) => message.chatId === id).sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)),
    [id, messageMap]
  );

  const sections = useMemo(() => groupByDay(messages), [messages]);
  const visibleRelayPackets = useMemo(() => relayPackets.filter((packet) => packet.chatId === id).slice(0, 3), [id, relayPackets]);

  const sendMutation = useMutation({ mutationFn: sendWithBestTransport });

  useEffect(() => {
    markChatRead(id);
    emitReadReceipt(id, messages.filter((message) => message.senderId !== "user_self").map((message) => message.id));
  }, [id, markChatRead, messages]);

  const onSend = (content: string, attachments?: MessageAttachment[]) => {
    const message = createTextMessage(id, content, attachments);
    sendMutation.mutate(message);
  };

  return (
    <Screen edges={["top", "left", "right", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={23} color={colors.textPrimary} /></Pressable>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.title}>{chat?.title ?? "Secure chat"}</Text>
          <Text numberOfLines={1} style={[styles.subtitle, typingNames.length > 0 ? styles.typing : null]}>
            {typingNames.length ? `${typingNames.join(", ")} typing...` : chat?.isGroup ? `${chat.participants.length} members` : "online · encrypted"}
          </Text>
        </View>
        <StatusPill mode={chat?.isEmergency ? "offline" : "hybrid"} label={chat?.isEmergency ? "SOS" : "E2E"} />
        <Pressable onPress={() => router.push({ pathname: "/call/[id]", params: { id } })}><Ionicons name="call" size={22} color={colors.success} /></Pressable>
      </View>

      {visibleRelayPackets.length ? (
        <FlatList
          horizontal
          data={visibleRelayPackets}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.relayList}
          renderItem={({ item }) => (
            <View style={styles.relayChip}>
              <Ionicons name="git-network" size={14} color={colors.offline} />
              <Text style={styles.relayText}>Relayed through {Math.max(1, item.hops.length - 2)} devices</Text>
            </View>
          )}
        />
      ) : null}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => <Text style={styles.dateHeader}>{section.title}</Text>}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.messages}
        stickySectionHeadersEnabled
        initialNumToRender={18}
        windowSize={10}
      />
      <ChatComposer chatId={id} onSend={onSend} onTyping={(typing) => emitTyping(id, typing)} />
    </Screen>
  );
}

function groupByDay(messages: Message[]) {
  const grouped = messages.reduce<Record<string, Message[]>>((acc, message) => {
    const key = new Date(message.createdAt).toDateString();
    acc[key] = [...(acc[key] ?? []), message];
    return acc;
  }, {});
  return Object.entries(grouped).map(([title, data]) => ({ title, data }));
}

const styles = StyleSheet.create({
  header: { alignItems: "center", borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: "row", gap: 12, padding: 14 },
  title: { color: colors.textPrimary, fontSize: 19, fontWeight: "900" },
  subtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 3 },
  typing: { color: colors.success, fontWeight: "800" },
  messages: { paddingBottom: 16, paddingTop: 8 },
  dateHeader: { alignSelf: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, color: colors.textSecondary, fontSize: 11, fontWeight: "900", marginVertical: 8, overflow: "hidden", paddingHorizontal: 10, paddingVertical: 5 },
  relayList: { gap: 8, paddingHorizontal: 14, paddingVertical: 9 },
  relayChip: { alignItems: "center", backgroundColor: "rgba(249,115,22,0.12)", borderColor: "rgba(249,115,22,0.28)", borderRadius: 18, borderWidth: 1, flexDirection: "row", gap: 6, paddingHorizontal: 10, paddingVertical: 6 },
  relayText: { color: colors.offline, fontSize: 12, fontWeight: "800" }
});
