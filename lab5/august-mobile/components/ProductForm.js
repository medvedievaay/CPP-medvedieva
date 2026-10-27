import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ProductForm({ onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleAdd = () => {
    if (onAdd(name, price)) {
      setName("");
      setPrice("");
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Додати товар</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 2 }]}
          placeholder="Назва товару"
          placeholderTextColor="#8a8a8a"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Ціна, грн"
          placeholderTextColor="#8a8a8a"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Додати товар</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#e4e2dd", borderRadius: 20, padding: 16, marginBottom: 12 },
  sectionTitle: { fontFamily: "serif", fontStyle: "italic", fontSize: 18, color: "#161616", marginBottom: 10 },
  row: { flexDirection: "row", gap: 8 },
  input: {
    borderWidth: 1, borderColor: "#c9c7c1", borderRadius: 20, backgroundColor: "#f6f5f2",
    paddingVertical: 8, paddingHorizontal: 13, fontSize: 14, color: "#161616",
  },
  button: {
    marginTop: 10, height: 36, borderRadius: 20, backgroundColor: "#161616",
    alignItems: "center", justifyContent: "center",
  },
  buttonText: { color: "#ffffff", fontSize: 13, fontWeight: "600" },
});
