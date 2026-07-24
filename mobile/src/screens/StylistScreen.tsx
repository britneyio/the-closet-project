import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { reset, sendMessage } from "shared/store/chatSlice";
import { theme } from "../theme";

export default function StylistScreen() {
  const dispatch = useAppDispatch();
  const { messages, sending, error } = useAppSelector((state) => state.chat);
  const [draft, setDraft] = useState("");
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  const submit = () => {
    if (!draft.trim() || sending) return;
    void dispatch(sendMessage(draft));
    setDraft("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrap}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(_, index) => String(index)}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={<Text style={styles.intro}>Ask me anything about your closet.</Text>}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === "user" ? styles.you : styles.them]}>
            <Text style={item.role === "user" ? styles.youText : styles.themText}>{item.content}</Text>
          </View>
        )}
      />
      {sending ? <Text style={styles.typing}>Styling…</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="Ask your stylist…"
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={submit}
        />
        <Pressable style={styles.send} onPress={submit} disabled={sending || !draft.trim()}>
          <Text style={styles.sendText}>→</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.color.background },
  intro: { textAlign: "center", color: theme.color.textSoft, marginTop: 40 },
  bubble: { maxWidth: "82%", padding: 11, borderRadius: 16 },
  you: { alignSelf: "flex-end", backgroundColor: theme.color.primary, borderBottomRightRadius: 5 },
  them: { alignSelf: "flex-start", backgroundColor: theme.color.surface, borderBottomLeftRadius: 5 },
  youText: { color: theme.color.onPrimary, fontSize: 15 },
  themText: { color: theme.color.textStrong, fontSize: 15 },
  typing: { color: theme.color.textSoft, fontStyle: "italic", paddingHorizontal: 16 },
  error: { color: theme.color.danger, textAlign: "center", padding: 8 },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: theme.color.border,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.color.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendText: { color: theme.color.onPrimary, fontSize: 20 },
});
