import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { colors, radius } from "@/constants/theme";
import { Contact } from "@/types/domain";
import { useChatStore } from "@/store/chatStore";

export default function NewGroupScreen() {
  const [title, setTitle] = useState("New Mesh Group");
  const [selected, setSelected] = useState<Record<string, Contact>>({});
  const contactsMap = useChatStore((state) => state.contacts);
  const createGroup = useChatStore((state) => state.createGroup);
  const contacts = useMemo(() => Object.values(contactsMap).filter((contact) => contact.isRegistered), [contactsMap]);

  const submit = () => {
    const chatId = createGroup(title, Object.values(selected));
    router.replace(`/chat/${chatId}`);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.textPrimary} /></Pressable>
        <Text style={styles.title}>New group</Text>
        <Pressable onPress={submit} disabled={!Object.keys(selected).length} style={styles.done}><Text style={styles.doneText}>Create</Text></Pressable>
      </View>
      <TextInput value={title} onChangeText={setTitle} style={styles.nameInput} placeholder="Group subject" placeholderTextColor={colors.textSecondary} />
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.userId ?? item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const key = item.userId ?? item.id;
          const active = Boolean(selected[key]);
          return (
            <Pressable
              style={styles.row}
              onPress={() =>
                setSelected((current) => {
                  const next = { ...current };
                  if (active) delete next[key];
                  else next[key] = item;
                  return next;
                })
              }
            >
              <View style={[styles.check, active && styles.checkActive]}>{active ? <Ionicons name="checkmark" size={16} color={colors.textPrimary} /> : null}</View>
              <View>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactMeta}>{item.presence}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", flexDirection: "row", gap: 16, justifyContent: "space-between", padding: 18 },
  title: { color: colors.textPrimary, flex: 1, fontSize: 23, fontWeight: "900" },
  done: { backgroundColor: colors.online, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8 },
  doneText: { color: colors.textPrimary, fontWeight: "900" },
  nameInput: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, color: colors.textPrimary, margin: 16, padding: 14 },
  list: { padding: 16 },
  row: { alignItems: "center", flexDirection: "row", gap: 12, paddingVertical: 12 },
  check: { alignItems: "center", borderColor: colors.border, borderRadius: 14, borderWidth: 1, height: 28, justifyContent: "center", width: 28 },
  checkActive: { backgroundColor: colors.online, borderColor: colors.online },
  contactName: { color: colors.textPrimary, fontSize: 16, fontWeight: "800" },
  contactMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 3 }
});
