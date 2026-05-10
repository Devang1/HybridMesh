import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { colors, radius } from "@/constants/theme";
import { pickImageAttachment } from "@/services/media";
import { useChatStore } from "@/store/chatStore";
import { relativeTime } from "@/utils/time";

export default function StatusScreen() {
  const [text, setText] = useState("Hybrid mode active.");
  const stories = useChatStore((state) => state.stories);
  const addStory = useChatStore((state) => state.addStory);
  const activeStories = useMemo(() => stories.filter((story) => +new Date(story.expiresAt) > Date.now()), [stories]);

  const createTextStory = () => addStory({ userId: "user_self", authorName: "You", text });
  const createMediaStory = async () => {
    const attachment = await pickImageAttachment();
    if (attachment) addStory({ userId: "user_self", authorName: "You", mediaUri: attachment.cachedUri ?? attachment.uri, text });
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.textPrimary} /></Pressable>
        <Text style={styles.title}>Status</Text>
      </View>
      <View style={styles.composer}>
        <TextInput value={text} onChangeText={setText} style={styles.input} placeholderTextColor={colors.textSecondary} />
        <View style={styles.row}>
          <Pressable onPress={createTextStory} style={styles.button}><Ionicons name="text" size={18} color={colors.textPrimary} /><Text style={styles.buttonText}>Post</Text></Pressable>
          <Pressable onPress={createMediaStory} style={styles.buttonAlt}><Ionicons name="image" size={18} color={colors.online} /><Text style={styles.buttonAltText}>Photo</Text></Pressable>
        </View>
      </View>
      <FlatList
        data={activeStories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.story}>
            <View style={styles.ring}><Ionicons name="aperture" size={24} color={colors.online} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.author}>{item.authorName}</Text>
              <Text style={styles.storyText}>{item.text ?? "Photo update"}</Text>
              <Text style={styles.meta}>{relativeTime(item.createdAt)} · {item.viewedBy.length} viewers</Text>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", flexDirection: "row", gap: 16, padding: 18 },
  title: { color: colors.textPrimary, fontSize: 25, fontWeight: "900" },
  composer: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, margin: 16, padding: 14 },
  input: { color: colors.textPrimary, minHeight: 44 },
  row: { flexDirection: "row", gap: 10, marginTop: 10 },
  button: { alignItems: "center", backgroundColor: colors.online, borderRadius: radius.md, flex: 1, flexDirection: "row", gap: 8, justifyContent: "center", padding: 12 },
  buttonText: { color: colors.textPrimary, fontWeight: "900" },
  buttonAlt: { alignItems: "center", borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flex: 1, flexDirection: "row", gap: 8, justifyContent: "center", padding: 12 },
  buttonAltText: { color: colors.online, fontWeight: "900" },
  list: { gap: 12, padding: 16 },
  story: { alignItems: "center", flexDirection: "row", gap: 12 },
  ring: { alignItems: "center", borderColor: colors.online, borderRadius: 28, borderWidth: 2, height: 56, justifyContent: "center", width: 56 },
  author: { color: colors.textPrimary, fontSize: 16, fontWeight: "900" },
  storyText: { color: colors.textSecondary, fontSize: 13, marginTop: 3 },
  meta: { color: colors.online, fontSize: 11, fontWeight: "800", marginTop: 5 }
});
