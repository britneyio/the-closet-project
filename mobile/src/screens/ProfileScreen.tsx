import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { getProfile, updateProfile } from "shared/api/endpoints";
import { errorMessage } from "shared/errors";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { logout } from "shared/store/authSlice";
import type { UserProfile } from "shared/domain";
import { theme } from "../theme";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch((err) => setNote(errorMessage(err)));
  }, []);

  const toggle = async (
    key: "email_recommendations" | "email_updates" | "remove_background",
    value: boolean
  ) => {
    if (!profile) return;
    setProfile({ ...profile, [key]: value });
    try {
      await updateProfile({ [key]: value });
    } catch (err) {
      setProfile(profile);
      setNote(errorMessage(err));
    }
  };

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.head}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.username || user?.email || "?").charAt(0).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={styles.name}>{user?.username ?? "Your profile"}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
      </View>

      <Text style={styles.group}>Preferences</Text>
      <View style={styles.list}>
        <View style={styles.row}>
          <Text style={styles.rowText}>Remove photo backgrounds</Text>
          <Switch
            value={!!profile?.remove_background}
            onValueChange={(value) => void toggle("remove_background", value)}
            trackColor={{ true: theme.color.primary }}
          />
        </View>
      </View>

      <Text style={styles.group}>Notifications</Text>
      <View style={styles.list}>
        <View style={styles.row}>
          <Text style={styles.rowText}>Outfit recommendations</Text>
          <Switch
            value={!!profile?.email_recommendations}
            onValueChange={(value) => void toggle("email_recommendations", value)}
            trackColor={{ true: theme.color.primary }}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Product updates</Text>
          <Switch
            value={!!profile?.email_updates}
            onValueChange={(value) => void toggle("email_updates", value)}
            trackColor={{ true: theme.color.primary }}
          />
        </View>
      </View>

      {note ? <Text style={styles.note}>{note}</Text> : null}

      <Pressable style={styles.signout} onPress={() => void dispatch(logout())}>
        <Text style={styles.signoutText}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.color.background },
  head: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 12 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.color.textStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 24 },
  name: { fontSize: 20, fontWeight: "700", color: theme.color.textStrong },
  email: { color: theme.color.textSoft, marginTop: 4 },
  group: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: theme.color.textSoft,
    marginTop: 24,
    marginBottom: 8,
  },
  list: { borderWidth: 1, borderColor: theme.color.border, borderRadius: 14, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.color.border,
  },
  rowText: { fontSize: 14, color: theme.color.textStrong },
  note: { color: theme.color.danger, marginTop: 12 },
  signout: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: 999,
    padding: 14,
    alignItems: "center",
  },
  signoutText: { color: theme.color.textStrong, fontWeight: "600" },
});
