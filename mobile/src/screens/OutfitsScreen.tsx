import { useEffect } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { fetchOutfits } from "shared/store/outfitsSlice";
import { theme } from "../theme";

export default function OutfitsScreen() {
  const dispatch = useAppDispatch();
  const { outfits, status } = useAppSelector((state) => state.outfits);

  useEffect(() => {
    void dispatch(fetchOutfits());
  }, [dispatch]);

  return (
    <FlatList
      style={{ backgroundColor: theme.color.background }}
      data={outfits}
      keyExtractor={(outfit) => String(outfit.id)}
      contentContainerStyle={{ padding: 16, gap: 14 }}
      ListEmptyComponent={
        <Text style={styles.empty}>
          {status === "loading" ? "Loading…" : "No outfits yet. Build one in the Creator."}
        </Text>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.tiles}>
            {item.items.slice(0, 4).map((piece) =>
              piece.cover_file ? (
                <Image key={piece.id} source={{ uri: piece.cover_file }} style={styles.surface} />
              ) : (
                <View key={piece.id} style={[styles.surface, styles.blank]} />
              )
            )}
          </View>
          <Text style={styles.name}>{item.name}</Text>
          {item.about ? <Text style={styles.about}>{item.about}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: theme.color.border, borderRadius: 16, overflow: "hidden" },
  tiles: { flexDirection: "row", height: 160, backgroundColor: theme.color.surface },
  surface: { flex: 1, height: "100%" },
  blank: { backgroundColor: theme.color.surface },
  name: { fontWeight: "700", fontSize: 16, padding: 14, paddingBottom: 2 },
  about: { color: theme.color.textSoft, fontSize: 13, paddingHorizontal: 14, paddingBottom: 14 },
  empty: { textAlign: "center", color: theme.color.textSoft, padding: 40 },
});
