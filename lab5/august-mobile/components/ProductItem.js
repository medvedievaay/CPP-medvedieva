import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

export default function ProductItem({product, onChangeQty, onDelete}) {
    return (
        <View style={[styles.item, product.qty > 0 && styles.itemInCart]}>
            <View style={styles.image}>
                <Text style={styles.emoji}>{product.emoji}</Text>
            </View>

            <View style={styles.info}>
                <Text style={styles.category}>{product.category}</Text>
                <Text style={styles.price}>{product.price.toFixed(2)} грн</Text>
                <Text style={styles.name}>{product.name}</Text>
                <TouchableOpacity onPress={() => onDelete(product.id)}>
                    <Text style={styles.delete}>Видалити</Text>
                </TouchableOpacity>
            </View>

            {product.qty === 0 ? (
                <TouchableOpacity style={styles.addButton} onPress={() => onChangeQty(product.id, 1)}>
                    <Text style={styles.addText}>Додати</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.stepper}>
                    <TouchableOpacity style={styles.qtyButton} onPress={() => onChangeQty(product.id, -1)}>
                        <Text style={styles.qtyButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qty}>{product.qty} шт</Text>
                    <TouchableOpacity style={styles.qtyButton} onPress={() => onChangeQty(product.id, 1)}>
                        <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: "row", alignItems: "center", padding: 10, marginBottom: 8,
        borderWidth: 1, borderColor: "#e4e2dd", borderRadius: 10, backgroundColor: "#ffffff",
    },
    itemInCart: {backgroundColor: "#f6f5f2", borderColor: "#161616"},
    image: {
        width: 56,
        height: 56,
        backgroundColor: "#f6f5f2",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10
    },
    emoji: {fontSize: 28},
    info: {flex: 1},
    category: {fontSize: 11, color: "#8a8a8a", textTransform: "uppercase", letterSpacing: 0.5},
    price: {fontSize: 15, fontWeight: "600", color: "#161616"},
    name: {fontSize: 13, color: "#4a4a4a", marginVertical: 2},
    delete: {fontSize: 12, color: "#8a8a8a", textDecorationLine: "underline"},
    addButton: {
        height: 36, paddingHorizontal: 16, borderWidth: 1, borderColor: "#161616",
        borderRadius: 20, alignItems: "center", justifyContent: "center",
    },
    addText: {fontSize: 13, color: "#161616"},
    stepper: {
        flexDirection: "row", height: 36, borderWidth: 1, borderColor: "#161616",
        borderRadius: 20, overflow: "hidden",
    },
    qtyButton: {width: 34, backgroundColor: "#161616", alignItems: "center", justifyContent: "center"},
    qtyButtonText: {color: "#ffffff", fontSize: 16},
    qty: {
        minWidth: 48,
        textAlign: "center",
        textAlignVertical: "center",
        lineHeight: 34,
        fontSize: 13,
        fontWeight: "600",
        color: "#161616"
    },
});