import {displayText} from "./Fonts";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

export default function Header({count, total, onClear}) {
    return (
        <View style={styles.header}>
            <View style={styles.row}>
                <Text style={styles.logo}>August</Text>
                <View style={styles.cart}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{count}</Text>
                    </View>
                    <Text style={styles.cartLabel}>Кошик</Text>
                    <Text style={styles.cartTotal}>{total.toFixed(2)} грн</Text>
                </View>
            </View>
            <Text style={styles.title}>Продукти щодня, без черг і зайвого клопоту</Text>
            <View style={styles.row}>
                <Text style={styles.stats}>Усього товарів у кошику: {count}</Text>
                <TouchableOpacity onPress={onClear}>
                    <Text style={styles.clear}>Очистити</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {paddingBottom: 12, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: "#161616"},
    row: {flexDirection: "row", alignItems: "center", justifyContent: "space-between"},
    logo: {...displayText, fontSize: 22, color: "#161616"},
    cart: {
        flexDirection: "row", alignItems: "center", backgroundColor: "#161616",
        borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14,
    },
    badge: {
        minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 9,
        backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center",
    },
    badgeText: {fontSize: 11, fontWeight: "600", color: "#161616"},
    cartLabel: {color: "#ffffff", fontSize: 13, marginLeft: 8},
    cartTotal: {color: "#ffffff", fontSize: 13, fontWeight: "600", marginLeft: 8},
    title: {...displayText, fontSize: 26, lineHeight: 32, color: "#161616", marginVertical: 12},
    stats: {fontSize: 13, color: "#4a4a4a"},
    clear: {fontSize: 13, color: "#161616", textDecorationLine: "underline"},
});