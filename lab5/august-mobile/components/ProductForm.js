import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CATEGORIES } from "./Categories";
import { sectionTitle } from "./Fonts";

export default function ProductForm({ onAdd }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");

    const handleAdd = () => {
        if (onAdd(name, price, category)) {
            setName("");
            setPrice("");
            setCategory("");
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

            <Text style={styles.label}>Категорія</Text>
            <View style={styles.chips}>
                {CATEGORIES.map((c) => {
                    const active = category === c.name;
                    return (
                        <TouchableOpacity
                            key={c.name}
                            style={[styles.chip, active && styles.chipActive]}
                            onPress={() => setCategory(active ? "" : c.name)}
                        >
                            <Text style={[styles.chipText, active && styles.chipTextActive]}>
                                {c.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAdd}>
                <Text style={styles.buttonText}>Додати товар</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#e4e2dd", borderRadius: 20, padding: 16, marginBottom: 12 },
    sectionTitle,
    row: { flexDirection: "row", gap: 8 },
    input: {
        borderWidth: 1, borderColor: "#c9c7c1", borderRadius: 20, backgroundColor: "#f6f5f2",
        paddingVertical: 8, paddingHorizontal: 13, fontSize: 14, color: "#161616",
    },
    label: { fontSize: 12, color: "#4a4a4a", marginTop: 12, marginBottom: 6 },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    chip: {
        paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20,
        borderWidth: 1, borderColor: "#c9c7c1", backgroundColor: "#ffffff",
    },
    chipActive: { backgroundColor: "#161616", borderColor: "#161616" },
    chipText: { fontSize: 12, color: "#161616" },
    chipTextActive: { color: "#ffffff" },
    button: {
        marginTop: 12, height: 36, borderRadius: 20, backgroundColor: "#161616",
        alignItems: "center", justifyContent: "center",
    },
    buttonText: { color: "#ffffff", fontSize: 13, fontWeight: "600" },
});