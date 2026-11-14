// Чисті функції для роботи з товарами та кошиком.
// Не звертаються до DOM, браузерного сховища чи файлів.
import { parsePrice } from "./itemValidation.js";

// Форматує число як ціну: 54.99 -> "54.99 грн"
export function formatPrice(value) {
    return Number(value).toFixed(2) + " грн";
}

// Створює позицію кошика з кількістю 1 та часом додавання
export function createCartItem(data, id, now) {
    return {
        id: id,
        name: data.name.trim(),
        price: parsePrice(data.price),
        qty: 1,
        icon: data.icon || "🛒",
        category: data.category || "Інше",
        addedAt: now.toISOString(),
    };
}

// Загальна кількість одиниць товару в кошику
export function countItems(items) {
    return items.reduce(function (sum, item) {
        return sum + item.qty;
    }, 0);
}

// Сума кошика, округлена до копійок
export function calcTotal(items) {
    const total = items.reduce(function (sum, item) {
        return sum + item.price * item.qty;
    }, 0);
    return Math.round(total * 100) / 100;
}

// Сортування за часом додавання (спочатку раніше додані); вихідний масив не змінюється
export function sortItemsByAdded(items) {
    return items.slice().sort(function (a, b) {
        const byTime = String(a.addedAt || "").localeCompare(String(b.addedAt || ""));
        return byTime !== 0 ? byTime : a.id - b.id;
    });
}

// Пошук за назвою без урахування регістру; порожній запит повертає все
export function filterByQuery(list, query) {
    const text = String(query || "").trim().toLowerCase();
    return list.filter(function (entry) {
        return entry.name.toLowerCase().includes(text);
    });
}

// Відкидає некоректні записи зі сховища та доповнює відсутні поля
export function sanitizeItems(raw) {
    if (!Array.isArray(raw)) {
        return [];
    }
    return raw
        .filter(function (item) {
            return (
                item &&
                typeof item.name === "string" &&
                item.name.trim() !== "" &&
                Number.isFinite(item.id) &&
                item.price > 0 &&
                Number.isInteger(item.qty) &&
                item.qty > 0
            );
        })
        .map(function (item) {
            return {
                id: item.id,
                name: item.name,
                price: item.price,
                qty: item.qty,
                icon: item.icon || "🛒",
                category: item.category || "Інше",
                addedAt: item.addedAt || "",
            };
        });
}
