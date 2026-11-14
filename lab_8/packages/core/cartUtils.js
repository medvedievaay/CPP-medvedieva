// Чисті допоміжні функції: без DOM, localStorage та файлів
import { MAX_ITEM_QTY } from "./cartValidation.js";

// Ціна у форматі «54.99 грн»; для некоректного значення – порожній рядок
export function formatPrice(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return "";
    }
    return value.toFixed(2) + " грн";
}

// Сума кошика: масив рядків { price, qty }
export function calculateTotal(lines) {
    const sum = lines.reduce((total, line) => total + line.price * line.qty, 0);
    return Math.round(sum * 100) / 100;
}

// Загальна кількість штук у кошику
export function countItems(lines) {
    return lines.reduce((total, line) => total + line.qty, 0);
}

// Пошук за назвою без урахування регістру
export function filterProductsByQuery(products, query) {
    const text = String(query ?? "").trim().toLowerCase();
    if (text === "") {
        return products.slice();
    }
    return products.filter((product) => product.name.toLowerCase().includes(text));
}

// Сортування за назвою; вихідний масив не змінюється
export function sortByName(products) {
    return products.slice().sort((a, b) => a.name.localeCompare(b.name, "uk"));
}

export function findProduct(products, id) {
    return products.find((product) => product.id === id) ?? null;
}

// Відкидає некоректні записи збереженого кошика й повертає масив { id, qty }
export function sanitizeCart(raw, products) {
    if (!Array.isArray(raw)) {
        return [];
    }
    const seen = new Set();
    const result = [];
    for (const entry of raw) {
        const valid =
            entry !== null &&
            typeof entry === "object" &&
            Number.isInteger(entry.id) &&
            Number.isInteger(entry.qty) &&
            entry.qty > 0 &&
            entry.qty <= MAX_ITEM_QTY &&
            findProduct(products, entry.id) !== null &&
            !seen.has(entry.id);
        if (valid) {
            seen.add(entry.id);
            result.push({ id: entry.id, qty: entry.qty });
        }
    }
    return result;
}
