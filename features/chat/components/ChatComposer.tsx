import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors, radius } from "@/constants/theme";
import { getEmergencyLocation } from "@/services/location";
import { createLocationAttachment, pickDocumentAttachment, pickImageAttachment } from "@/services/media";
import { MessageAttachment } from "@/types/domain";
import { VoiceNoteButton } from "./VoiceNoteButton";

type Props = {
  chatId: string;
  onSend: (content: string, attachments?: MessageAttachment[]) => void;
  onTyping: (typing: boolean) => void;
};

export function ChatComposer({ chatId: _chatId, onSend, onTyping }: Props) {
  const [value, setValue] = useState("");

  const submit = async (attachments?: MessageAttachment[]) => {
    if (!value.trim() && !attachments?.length) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend(value.trim(), attachments);
    setValue("");
    onTyping(false);
  };

  const attachImage = async () => {
    const attachment = await pickImageAttachment();
    if (attachment) submit([attachment]);
  };

  const attachDocument = async () => {
    const attachment = await pickDocumentAttachment();
    if (attachment) submit([attachment]);
  };

  const attachLocation = async () => {
    const location = await getEmergencyLocation();
    if (location) submit([createLocationAttachment(location.latitude, location.longitude)]);
  };

  return (
    <View style={styles.wrap}>
      <Pressable onPress={attachImage} style={styles.iconButton}><Ionicons name="image" size={19} color={colors.online} /></Pressable>
      <Pressable onPress={attachDocument} style={styles.iconButton}><Ionicons name="document-attach" size={19} color={colors.textSecondary} /></Pressable>
      <TextInput
        value={value}
        onChangeText={(text) => {
          setValue(text);
          onTyping(Boolean(text.trim()));
        }}
        placeholder="Message"
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
        multiline
      />
      <Pressable onPress={attachLocation} style={styles.iconButton}><Ionicons name="location" size={19} color={colors.offline} /></Pressable>
      <VoiceNoteButton onRecorded={(uri) => submit([{ id: `voice_${Date.now()}`, type: "voice", uri, cachedUri: uri, uploadProgress: 0 }])} />
      <Pressable style={styles.send} onPress={() => submit()}>
        <Ionicons name="send" size={18} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "flex-end", backgroundColor: colors.surface, borderColor: colors.border, borderTopWidth: 1, flexDirection: "row", gap: 8, padding: 10 },
  input: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, color: colors.textPrimary, flex: 1, maxHeight: 110, minHeight: 44, paddingHorizontal: 13, paddingVertical: 11 },
  iconButton: { alignItems: "center", backgroundColor: colors.card, borderColor: colors.border, borderRadius: 22, borderWidth: 1, height: 44, justifyContent: "center", width: 38 },
  send: { alignItems: "center", backgroundColor: colors.online, borderRadius: 22, height: 44, justifyContent: "center", width: 44 }
});
