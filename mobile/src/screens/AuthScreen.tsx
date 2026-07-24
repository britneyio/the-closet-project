import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { login, signup } from "shared/store/authSlice";
import { theme } from "../theme";

export default function AuthScreen() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    if (mode === "login") void dispatch(login({ email, password }));
    else void dispatch(signup({ email, username, password }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.wrap}
    >
      <Text style={styles.brand}>
        The Closet <Text style={{ color: theme.color.primary }}>Project</Text>
      </Text>
      <Text style={styles.h1}>{mode === "login" ? "Welcome back" : "Create your closet"}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {mode === "signup" && (
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={submit} disabled={status === "loading"}>
        <Text style={styles.buttonText}>
          {status === "loading" ? "Please wait…" : mode === "login" ? "Sign in" : "Start free"}
        </Text>
      </Pressable>

      <Pressable onPress={() => setMode(mode === "login" ? "signup" : "login")}>
        <Text style={styles.switch}>
          {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", padding: 24, gap: 14, backgroundColor: theme.color.surface },
  brand: { fontSize: 22, fontWeight: "700", textAlign: "center", color: theme.color.textStrong },
  h1: { fontSize: 26, fontWeight: "700", color: theme.color.textStrong, marginTop: 8 },
  error: { backgroundColor: theme.color.dangerSoft, color: theme.color.danger, padding: 10, borderRadius: 10 },
  input: {
    backgroundColor: theme.color.background,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: theme.color.primary,
    borderRadius: 999,
    padding: 15,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: { color: theme.color.onPrimary, fontWeight: "600", fontSize: 16 },
  switch: { textAlign: "center", color: theme.color.textSoft, marginTop: 8 },
});
