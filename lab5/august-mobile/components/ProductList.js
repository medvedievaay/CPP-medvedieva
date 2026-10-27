import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import ProductItem from "./ProductItem";

export default function ProductList({ products, search, onSearch, onChangeQty, onDelete }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Каталог</Text>
      <TextInput
        style={styles.search}
        placeholder="Я шукаю…"
        placeholderTextColor="#8a8a8a"
        value={search}
        onChangeText={onSearch}
      />

      {products.length === 0 ? (
        <Text style={styles.empty}>Товарів не знайдено. Додайте перший!</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductItem product={item} onChangeQty={onChangeQty} onDelete={onDelete} />
          )}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#e4e2dd", borderRadius: 20, padding: 16 },
  sectionTitle: { fontFamily: "serif", fontStyle: "italic", fontSize: 18, color: "#161616", marginBottom: 10 },
  search: {
    borderWidth: 1, borderColor: "#c9c7c1", borderRadius: 20, backgroundColor: "#f6f5f2",
    paddingVertical: 8, paddingHorizontal: 13, fontSize: 14, color: "#161616", marginBottom: 10,
  },
  empty: { textAlign: "center", color: "#8a8a8a", marginTop: 20 },
});
