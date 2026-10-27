import {useState} from "react";
import {Alert, Platform, StatusBar, StyleSheet, View} from "react-native";
import {SafeAreaProvider, useSafeAreaInsets} from "react-native-safe-area-context";
import {useFonts, PlayfairDisplay_400Regular_Italic} from "@expo-google-fonts/playfair-display";
import Header from "./components/Header";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import {CATEGORIES} from "./components/Categories";

const initialProducts = [
    {id: "1", emoji: "🥛", name: "Молоко 2.5%, 1 л", category: "Молочні продукти та яйця", price: 54.99, qty: 0},
    {id: "2", emoji: "🍞", name: "Хліб пшеничний, 500 г", category: "Хліб та випічка", price: 32.5, qty: 0},
    {id: "3", emoji: "🥚", name: "Яйця курячі, 10 шт", category: "Молочні продукти та яйця", price: 68, qty: 0},
    {id: "4", emoji: "☕", name: "Кава мелена, 250 г", category: "Кава, чай", price: 149.99, qty: 0},
    {id: "5", emoji: "🧀", name: "Сир твердий, 300 г", category: "Молочні продукти та яйця", price: 119, qty: 0},
    {id: "6", emoji: "💧", name: "Вода негазована, 1.5 л", category: "Напої", price: 24.99, qty: 0},
];

function AppContent() {
    const insets = useSafeAreaInsets();
    const [products, setProducts] = useState(initialProducts);
    const [search, setSearch] = useState("");

    // Відступ від системної смуги: беремо значення з insets,
    // а якщо воно нульове — запасний варіант для Android/iOS.
    const topPadding =
        insets.top > 0
            ? insets.top
            : Platform.OS === "android"
                ? StatusBar.currentHeight || 24
                : 50;

    const addProduct = (name, priceText, category) => {
        const trimmed = name.trim();
        const priceClean = priceText.trim().replace(",", ".");
        const price = parseFloat(priceClean);

        const missing = [];
        if (trimmed === "") missing.push("назву");
        if (priceClean === "") missing.push("ціну");
        if (category === "") missing.push("категорію");

        if (missing.length > 1) {
            Alert.alert("Помилка", "Будь ласка, вкажіть: " + missing.join(", ") + ".");
            return false;
        }
        if (missing.length === 1) {
            const messages = {
                "назву": "Будь ласка, введіть назву товару.",
                "ціну": "Будь ласка, введіть ціну товару.",
                "категорію": "Будь ласка, оберіть категорію товару.",
            };
            Alert.alert("Помилка", messages[missing[0]]);
            return false;
        }
        if (isNaN(price) || price <= 0) {
            Alert.alert("Помилка", "Ціна має бути числом більше нуля.");
            return false;
        }

        const emoji = CATEGORIES.find((c) => c.name === category)?.emoji || "🛒";
        const newProduct = {
            id: Date.now().toString(),
            emoji,
            name: trimmed,
            category,
            price,
            qty: 0,
        };
        setProducts((current) => [newProduct, ...current]);
        Alert.alert("Успіх", "Товар успішно додано до каталогу.");
        return true;
    };

    const changeQty = (id, delta) => {
        setProducts((current) =>
            current.map((p) =>
                p.id === id ? {...p, qty: Math.max(0, p.qty + delta)} : p
            )
        );
    };

    const deleteProduct = (id) => {
        setProducts((current) => current.filter((p) => p.id !== id));
        Alert.alert("Видалення", "Товар видалено з каталогу.");
    };

    const clearCart = () => {
        setProducts((current) => current.map((p) => ({...p, qty: 0})));
    };

    const totalCount = products.reduce((sum, p) => sum + p.qty, 0);
    const totalPrice = products.reduce((sum, p) => sum + p.qty * p.price, 0);

    const query = search.trim().toLowerCase();
    const visibleProducts = products.filter((p) =>
        (p.name + " " + p.category).toLowerCase().includes(query)
    );

    return (
        <View
            style={[
                styles.safe,
                {paddingTop: topPadding + 8, paddingBottom: insets.bottom},
            ]}
        >
            <StatusBar barStyle="dark-content"/>
            <ProductList
                header={
                    <>
                        <Header count={totalCount} total={totalPrice} onClear={clearCart}/>
                        <ProductForm onAdd={addProduct}/>
                    </>
                }
                products={visibleProducts}
                search={search}
                onSearch={setSearch}
                onChangeQty={changeQty}
                onDelete={deleteProduct}
            />
        </View>
    );
}

export default function App() {
    const [fontsLoaded] = useFonts({PlayfairDisplay_400Regular_Italic});

    // Поки шрифт завантажується, нічого не показуємо
    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <AppContent/>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safe: {flex: 1, backgroundColor: "#ffffff"},
});