import { useEffect, useState } from "react";
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { fetchClothing } from "shared/store/closetSlice";
import { addOutfit } from "shared/store/outfitsSlice";
import { theme } from "../theme";

// Mobile creator: tap items to add/remove them from the outfit, then save.
// (The web app has free drag-drop positioning; on native we start with the
// simpler tap-to-select model and can add gesture positioning later.)
export default function CreatorScreen() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.closet.items);
  const [selected, setSelected] = useState<number[]>([]);
  const [name, setName] = useState("New outfit");

  useEffect(() => {
    if (items.length === 0) void dispatch(fetchClothing(1));
  }, [dispatch, items.length]);

  const toggle = (id: number) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((existingId) => existingId !== id) : [...prev, id]));

  const save = async () => {
    if (selected.length === 0) {
      Alert.alert("Add a few items first.");
      return;
    }
    const result = await dispatch(addOutfit({ name, items_id: selected }));
    if (addOutfit.fulfilled.match(result)) {
      Alert.alert("Outfit saved.");
      setSelected([]);
    } else {
      Alert.alert("Could not save the outfit.");
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.toolbar}>
        <TextInput style={styles.name} value={name} onChangeText={setName} />
        <Pressable style={styles.save} onPress={() => void save()}>
          <Text style={styles.saveText}>Save ({selected.length})</Text>
        </Pressable>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        columnWrapperStyle={{ gap: 8 }}
        contentContainerStyle={{ gap: 8, padding: 12 }}
        renderItem={({ item }) => {
          const on = selected.includes(item.id);
          return (
            <Pressable style={[styles.surface, on && styles.tileOn]} onPress={() => toggle(item.id)}>
              {item.cover_file ? (
                <Image source={{ uri: item.cover_file }} style={styles.img} />
              ) : (
                <Text style={styles.label}>{item.name}</Text>
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.color.background },
  toolbar: { flexDirection: "row", gap: 10, padding: 12, alignItems: "center" },
  name: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
  },
  save: { backgroundColor: theme.color.primary, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 11 },
  saveText: { color: theme.color.onPrimary, fontWeight: "600" },
  surface: {
    flex: 1,
    aspectRatio: 4 / 5,
    borderWidth: 2,
    borderColor: theme.color.border,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: theme.color.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  tileOn: { borderColor: theme.color.primary },
  img: { width: "100%", height: "100%" },
  label: { fontSize: 10, color: theme.color.textSoft, textAlign: "center", padding: 4 },
});
