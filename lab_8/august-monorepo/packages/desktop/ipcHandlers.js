// Обробники IPC над CartService. Модуль не підключає Electron, тому тестується без вікна.
// Дані з рендер-процесу не довіряємо: перевіряємо типи, після чого передаємо їх ядру.
import { CATEGORIES, formatPrice } from "@august/core";

export const ERROR_BAD_DATA = "Некоректні дані.";

const BAD = { ok: false, error: ERROR_BAD_DATA };

// Додаємо до даних підписи для показу (рендер-процес не має доступу до ядра)
function toView(summary) {
    return {
        count: summary.count,
        total: summary.total,
        totalLabel: summary.total.toFixed(2) + " грн",
        items: summary.items.map(function (item) {
            return { ...item, priceLabel: formatPrice(item.price * item.qty) };
        }),
    };
}

export function createHandlers(service) {
    return {
        meta: function () {
            return { categories: CATEGORIES };
        },

        catalog: function (query) {
            const text = typeof query === "string" ? query : "";
            return service.searchProducts(text).map(function (product) {
                return { ...product, priceLabel: formatPrice(product.price) };
            });
        },

        summary: async function () {
            return toView(await service.summary());
        },

        add: async function (data) {
            const valid =
                data &&
                typeof data === "object" &&
                typeof data.name === "string" &&
                typeof data.category === "string" &&
                (typeof data.price === "string" || typeof data.price === "number");
            return valid ? service.add(data) : BAD;
        },

        addProduct: async function (name) {
            return typeof name === "string" ? service.addProduct(name) : BAD;
        },

        changeQty: async function (id, delta) {
            return Number.isFinite(id) && (delta === 1 || delta === -1) ? service.changeQty(id, delta) : BAD;
        },

        remove: async function (id) {
            return Number.isFinite(id) ? service.remove(id) : BAD;
        },
    };
}
