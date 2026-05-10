import { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/Screen";
import { StatusPill } from "@/components/StatusPill";
import { colors, radius } from "@/constants/theme";
import { Chat, Message } from "@/types/domain";
import { useChatStore } from "@/store/chatStore";
import { useNetworkStore } from "@/store/networkStore";
import { compactTime } from "@/utils/time";

export default function ChatsScreen() {
  const chatMap = useChatStore((state) => state.chats);
  const messageMap = useChatStore((state) => state.messages);
  const contacts = useChatStore((state) => state.contacts);
  const togglePinned = useChatStore((state) => state.togglePinned);
  const toggleMuted = useChatStore((state) => state.toggleMuted);
  const archiveChat = useChatStore((state) => state.archiveChat);
  const mode = useNetworkStore((state) => state.mode);
  const pending = useChatStore((state) => state.pendingMessageIds.length);

  const chats = useMemo(
    () =>
      Object.values(chatMap)
        .filter((chat) => !chat.isArchived)
        .sort((a, b) => Number(Boolean(b.isPinned)) - Number(Boolean(a.isPinned)) || +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt)),
    [chatMap]
  );

  const lastMessages = useMemo(() => {
    return Object.values(messageMap).reduce<Record<string, Message>>((acc, message) => {
      if (!acc[message.chatId] || +new Date(message.createdAt) > +new Date(acc[message.chatId].createdAt)) acc[message.chatId] = message;
      return acc;
    }, {});
  }, [messageMap]);

  const renderChat = ({ item }: { item: Chat }) => {
    const last = lastMessages[item.id];
    const typingContact = item.typingUserIds?.map((id) => contacts[id]?.name).find(Boolean);
    const directContact = item.participants.map((id) => contacts[id]).find(Boolean);
    const online = item.isGroup ? item.participants.some((id) => contacts[id]?.presence === "online") : directContact?.presence === "online";
    const preview = typingContact ? `${typingContact} is typing...` : last?.content || item.subtitle;

    return (
      <Pressable style={styles.chatCard} onPress={() => router.push(`/chat/${item.id}`)}>
        <View>
          <Image source={{ uri: item.groupImageUri ?? directContact?.avatarUrl ?? `https://api.dicebear.com/8.x/shapes/svg?seed=${item.id}` }} style={styles.avatar} />
          <View style={[styles.presence, { backgroundColor: online ? colors.success : colors.textSecondary }]} />
        </View>
        <View style={styles.chatText}>
          <View style={styles.chatTop}>
            <View style={styles.nameRow}>
              {item.isPinned ? <Ionicons name="pin" size={12} color={colors.online} /> : null}
              <Text numberOfLines={1} style={styles.chatTitle}>{item.title}</Text>
              {item.isMuted ? <Ionicons name="notifications-off" size={13} color={colors.textSecondary} /> : null}
            </View>
            <Text style={styles.time}>{compactTime(item.lastMessageAt)}</Text>
          </View>
          <View style={styles.previewRow}>
            {last?.senderId === "user_self" ? <ReceiptIcon status={last.status} /> : null}
            <Text numberOfLines={1} style={[styles.subtitle, typingContact && styles.typing]}>{preview}</Text>
          </View>
          <View style={styles.metaRow}>
            <View style={[styles.badge, item.isEmergency && styles.emergencyBadge]}>
              <Ionicons name={item.isEmergency ? "warning" : item.isGroup ? "people" : last?.transport === "mesh" ? "git-network" : "lock-closed"} size={12} color={item.isEmergency || last?.transport === "mesh" ? colors.offline : colors.online} />
              <Text style={styles.badgeText}>{last?.transport === "mesh" ? "mesh relay" : item.isGroup ? "group" : "e2e"}</Text>
            </View>
            <View style={styles.quickActions}>
              <Pressable onPress={() => { Haptics.selectionAsync(); togglePinned(item.id); }}><Ionicons name="pin" size={17} color={colors.textSecondary} /></Pressable>
              <Pressable onPress={() => toggleMuted(item.id)}><Ionicons name="volume-mute" size={18} color={colors.textSecondary} /></Pressable>
              <Pressable onPress={() => archiveChat(item.id)}><Ionicons name="archive" size={18} color={colors.textSecondary} /></Pressable>
              {item.unread ? <Text style={styles.unread}>{item.unread}</Text> : null}
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>HYBRID MESSENGER</Text>
          <Text style={styles.title}>Chats</Text>
        </View>
        <StatusPill mode={mode} label={pending ? `${pending} QUEUED` : "SYNC READY"} />
      </View>
      <View style={styles.toolbar}>
        <Pressable onPress={() => router.push("/search")} style={styles.toolButton}><Ionicons name="search" size={18} color={colors.textPrimary} /><Text style={styles.toolText}>Search</Text></Pressable>
        <Pressable onPress={() => router.push("/status")} style={styles.iconButton}><Ionicons name="aperture" size={19} color={colors.online} /></Pressable>
        <Pressable onPress={() => router.push("/new-chat")} style={styles.fab}><Ionicons name="chatbubble-ellipses" size={21} color={colors.textPrimary} /></Pressable>
      </View>
      <FlatList data={chats} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={renderChat} initialNumToRender={12} windowSize={8} removeClippedSubviews />
    </Screen>
  );
}

function ReceiptIcon({ status }: { status: Message["status"] }) {
  if (status === "sending" || status === "pending") return <Ionicons name="time" size={14} color={colors.textSecondary} />;
  if (status === "failed") return <Ionicons name="alert-circle" size={14} color={colors.error} />;
  if (status === "seen") return <Ionicons name="checkmark-done" size={15} color={colors.online} />;
  if (status === "relaying") return <Ionicons name="git-network" size={14} color={colors.offline} />;
  return <Ionicons name="checkmark-done" size={15} color={colors.textSecondary} />;
}

const styles = StyleSheet.create({
  header: { alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between", padding: 20, paddingBottom: 8 },
  kicker: { color: colors.online, fontSize: 12, fontWeight: "800" },
  title: { color: colors.textPrimary, fontSize: 34, fontWeight: "900", letterSpacing: 0, marginTop: 2 },
  toolbar: { alignItems: "center", flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingBottom: 8 },
  toolButton: { alignItems: "center", backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flex: 1, flexDirection: "row", gap: 9, height: 44, paddingHorizontal: 14 },
  toolText: { color: colors.textSecondary, fontWeight: "800" },
  iconButton: { alignItems: "center", backgroundColor: colors.card, borderColor: colors.border, borderRadius: 22, borderWidth: 1, height: 44, justifyContent: "center", width: 44 },
  fab: { alignItems: "center", backgroundColor: colors.online, borderRadius: 22, height: 44, justifyContent: "center", width: 44 },
  list: { gap: 10, padding: 16, paddingBottom: 110 },
  chatCard: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flexDirection: "row", gap: 14, padding: 14 },
  avatar: { backgroundColor: colors.surface, borderRadius: 25, height: 50, width: 50 },
  presence: { borderColor: colors.card, borderRadius: 7, borderWidth: 2, bottom: 0, height: 14, position: "absolute", right: 0, width: 14 },
  chatText: { flex: 1 },
  chatTop: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  nameRow: { alignItems: "center", flex: 1, flexDirection: "row", gap: 5 },
  chatTitle: { color: colors.textPrimary, flex: 1, fontSize: 16, fontWeight: "800" },
  time: { color: colors.textSecondary, fontSize: 12, marginLeft: 8 },
  previewRow: { alignItems: "center", flexDirection: "row", gap: 4, marginTop: 4 },
  subtitle: { color: colors.textSecondary, flex: 1, fontSize: 13 },
  typing: { color: colors.success, fontWeight: "800" },
  metaRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  badge: { alignItems: "center", backgroundColor: "rgba(59,130,246,0.12)", borderRadius: 20, flexDirection: "row", gap: 5, paddingHorizontal: 9, paddingVertical: 5 },
  emergencyBadge: { backgroundColor: "rgba(249,115,22,0.14)" },
  badgeText: { color: colors.textSecondary, fontSize: 11, fontWeight: "800" },
  quickActions: { alignItems: "center", flexDirection: "row", gap: 12 },
  unread: { backgroundColor: colors.online, borderRadius: 12, color: colors.textPrimary, fontSize: 12, fontWeight: "900", minWidth: 24, overflow: "hidden", paddingHorizontal: 7, paddingVertical: 3, textAlign: "center" }
});
