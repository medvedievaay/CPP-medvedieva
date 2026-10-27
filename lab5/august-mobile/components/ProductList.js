import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import ProductItem from "./ProductItem";
import { sectionTitle } from "./Fonts";

// FlatList — основа всієї сторінки: шапка й форма передаються через prop header,
// тому прокручується вся сторінка. Рамку «Каталогу» складено з трьох частин:
// верх (заголовок і пошук), боки навколо кожного товару та низ.
export default function ProductList({ header, products, search, onSearch, onChangeQty, onDelete }) {
    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.side}>
                    <ProductItem product={item} onChangeQty={onChangeQty} onDelete={onDelete} />
                </View>
            )}
            ListHeaderComponent={
                <View>
                    {header}
                    <View style={[styles.side, styles.cardTop]}>
                        <Text style={styles.sectionTitle}>Каталог</Text>
                        <TextInput
                            style={styles.search}
                            placeholder="Я шукаю…"
                            placeholderTextColor="#8a8a8a"
                            value={search}
                            onChangeText={onSearch}
                        />
                    </View>
                </View>
            }
            ListEmptyComponent={
                <View style={styles.side}>
                    <Text style={styles.empty}>Товарів не знайдено. Додайте перший!</Text>
                </View>
            }
            ListFooterComponent={<View style={styles.cardBottom} />}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets
            showsVerticalScrollIndicator={false}
        />
    );
}

const BORDER = "#e4e2dd";

const styles = StyleSheet.create({
    content: { paddingHorizontal: 16, paddingBottom: 32 },
    side: {
        backgroundColor: "#ffffff",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: BORDER,
        paddingHorizontal: 16,
    },
    cardTop: {
        borderTopWidth: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 16,
    },
    cardBottom: {
        height: 16,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: BORDER,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    sectionTitle,
    search: {
        borderWidth: 1, borderColor: "#c9c7c1", borderRadius: 20, backgroundColor: "#f6f5f2",
        paddingVertical: 8, paddingHorizontal: 13, fontSize: 14, color: "#161616", marginBottom: 12,
    },
    empty: { textAlign: "center", color: "#8a8a8a", paddingVertical: 20 },
});