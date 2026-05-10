import { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors } from "@/constants/theme";

type Props = {
  onRecorded: (uri: string) => void;
};

export function VoiceNoteButton({ onRecorded }: Props) {
  const recording = useRef<Audio.Recording | null>(null);
  const [active, setActive] = useState(false);

  const toggle = async () => {
    if (active && recording.current) {
      await recording.current.stopAndUnloadAsync();
      const uri = recording.current.getURI();
      recording.current = null;
      setActive(false);
      if (uri) onRecorded(uri);
      return;
    }

    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Microphone needed", "Enable microphone access to send encrypted voice notes.");
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const created = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    recording.current = created.recording;
    setActive(true);
  };

  return (
    <Pressable onPress={toggle} style={[styles.button, active && styles.active]}>
      <Ionicons name={active ? "stop" : "mic"} size={19} color={active ? colors.bg : colors.textPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  active: {
    backgroundColor: colors.offline,
    borderColor: colors.offline
  }
});
