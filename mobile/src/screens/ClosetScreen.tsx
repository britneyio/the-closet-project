import { useEffect, useMemo, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { fetchClothing } from "shared/store/closetSlice";
import { fetchTypes } from "shared/store/clothingTypesSlice";
import { theme } from "../theme";

export default function ClosetScreen() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.closet);
  const types = useAppSelector((state) => state.clothingTypes.types);
  const [query, setQuery] = useState("");

  useEffect(() => {
    void dispatch(fetchClothing(1));
    void dispatch(fetchTypes());
  }, [dispatch]);

  const visible = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    return searchTerm ? items.filter((item) => item.name.toLowerCase().includes(searchTerm)) : items;
  }, [items, query]);

  return (
    <View style={styles.wrap}>
      <TextInput
        style={styles.search}
        placeholder="Search your closet…"
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={visible}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, padding: 16 }}
        ListEmptyComponent={
          <Text style={styles.empty}>{status === "loading" ? "Loading…" : "No items yet."}</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.cover_file ? (
              <Image source={{ uri: item.cover_file }} style={styles.thumb} />
            ) : (
              <View style={[styles.thumb, styles.placeholder]}>
                <Text style={styles.placeholderText}>{item.name}</Text>
              </View>
            )}
            <Text style={styles.name}>{item.name}</Text>
            {item.ctype != null ? (
              <Text style={styles.tag}>{types.find((type) => type.id === item.ctype)?.name}</Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.color.background },
  search: {
    borderWidth: 2,
    borderColor: theme.color.textStrong,
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    margin: 16,
    marginBottom: 0,
  },
  card: { flex: 1, borderWidth: 1, borderColor: theme.color.border, borderRadius: 14, overflow: "hidden" },
  thumb: { width: "100%", aspectRatio: 4 / 5, backgroundColor: theme.color.surface },
  placeholder: { alignItems: "center", justifyContent: "center" },
  placeholderText: { color: theme.color.textSoft, fontSize: 11, textTransform: "uppercase" },
  name: { fontWeight: "700", fontSize: 15, paddingHorizontal: 12, paddingTop: 10 },
  tag: {
    color: theme.color.primaryStrong,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    padding: 12,
    paddingTop: 4,
  },
  empty: { textAlign: "center", color: theme.color.textSoft, padding: 40 },
});
