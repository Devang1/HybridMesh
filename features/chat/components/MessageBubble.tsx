import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "@/constants/theme";
import { Message } from "@/types/domain";
import { compactTime } from "@/utils/time";
import { useChatStore } from "@/store/chatStore";

export function MessageBubble({ message }: { message: Message }) {
  const mine = message.senderId === "user_self";
  const addReaction = useChatStore((state) => state.addReaction);
  const accent = message.transport === "mesh" ? colors.offline : message.transport === "cloud" ? colors.online : colors.textSecondary;
  const attachment = message.attachments?.[0];

  return (
    <Animated.View entering={FadeInUp.duration(220)} style={[styles.wrap, mine ? styles.mineWrap : styles.theirWrap]}>
      <Pressable onLongPress={() => addReaction(message.id, "❤️")} style={[styles.bubble, mine ? styles.mine : styles.their]}>
        {attachment?.type === "image" && <Image source={{ uri: attachment.cachedUri ?? attachment.uri }} style={styles.media} contentFit="cover" />}
        {attachment?.type === "video" && <View style={styles.filePreview}><Ionicons name="play-circle" size={34} color={accent} /><Text style={styles.fileText}>Video</Text></View>}
        {attachment?.type === "document" && <View style={styles.filePreview}><Ionicons name="document-text" size={26} color={accent} /><Text numberOfLines={1} style={styles.fileText}>{attachment.name ?? "Document"}</Text></View>}
        {attachment?.type === "location" && <View style={styles.filePreview}><Ionicons name="location" size={26} color={accent} /><Text numberOfLines={1} style={styles.fileText}>{attachment.name ?? "Shared location"}</Text></View>}
        {message.voiceUri || attachment?.type === "voice" ? (
          <View style={styles.voiceRow}>
            <Ionicons name="play-circle" size={30} color={accent} />
            <View style={styles.wave}>
              {Array.from({ length: 22 }).map((_, index) => (
                <View key={index} style={[styles.bar, { height: 8 + ((index * 7) % 24), backgroundColor: accent }]} />
              ))}
            </View>
            <Text style={styles.speed}>1x</Text>
          </View>
        ) : message.content ? (
          <Text style={styles.content}>{message.content}</Text>
        ) : null}
        {message.reactions?.length ? (
          <View style={styles.reactions}>
            {message.reactions.map((reaction) => <Text key={`${reaction.userId}_${reaction.emoji}`} style={styles.reaction}>{reaction.emoji}</Text>)}
          </View>
        ) : null}
        <View style={styles.metaRow}>
          {message.transport === "mesh" ? <Text style={[styles.meta, { color: colors.offline }]}>via {Math.max(0, message.routeHistory.length - 2)} hops</Text> : null}
          <Text style={styles.meta}>{compactTime(message.createdAt)}</Text>
          {mine ? <ReceiptIcon status={message.status} /> : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

function ReceiptIcon({ status }: { status: Message["status"] }) {
  if (status === "seen") return <Ionicons name="checkmark-done" size={15} color={colors.online} />;
  if (status === "relaying") return <Ionicons name="git-network" size={14} color={colors.offline} />;
  if (status === "pending" || status === "sending") return <Ionicons name="time" size={14} color={colors.textSecondary} />;
  if (status === "failed") return <Ionicons name="alert-circle" size={14} color={colors.error} />;
  return <Ionicons name="checkmark-done" size={15} color={colors.textSecondary} />;
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 5, paddingHorizontal: 14 },
  mineWrap: { alignItems: "flex-end" },
  theirWrap: { alignItems: "flex-start" },
  bubble: { borderRadius: radius.md, maxWidth: "84%", padding: 10 },
  mine: { backgroundColor: "rgba(59,130,246,0.22)", borderColor: "rgba(59,130,246,0.34)", borderWidth: 1 },
  their: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
  content: { color: colors.textPrimary, fontSize: 15, lineHeight: 21 },
  media: { backgroundColor: colors.surface, borderRadius: 10, height: 190, marginBottom: 8, width: 230 },
  filePreview: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 10, flexDirection: "row", gap: 10, marginBottom: 8, padding: 12 },
  fileText: { color: colors.textPrimary, flex: 1, fontSize: 14, fontWeight: "800" },
  metaRow: { alignItems: "center", flexDirection: "row", gap: 7, justifyContent: "flex-end", marginTop: 8 },
  meta: { color: colors.textSecondary, fontSize: 11, fontWeight: "700" },
  voiceRow: { alignItems: "center", flexDirection: "row", gap: 10, minWidth: 210 },
  wave: { alignItems: "center", flexDirection: "row", gap: 3 },
  bar: { borderRadius: 4, opacity: 0.75, width: 3 },
  speed: { color: colors.textSecondary, fontSize: 12, fontWeight: "900" },
  reactions: { alignSelf: "flex-start", backgroundColor: colors.surface, borderRadius: 12, flexDirection: "row", marginTop: 7, paddingHorizontal: 6, paddingVertical: 2 },
  reaction: { fontSize: 13 }
});
