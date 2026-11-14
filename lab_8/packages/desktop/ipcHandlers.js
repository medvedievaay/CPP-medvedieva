import { formatPrice } from "@august/core";

const ERROR_BAD_DATA = "Некоректні дані.";

// Обробники IPC над CartService; electron не підключається, тому модуль тестується без вікна
export function createHandlers(service) {
    // Стан для показу: товари каталогу та рядки кошика з підготовленими підписами цін
    function state(query) {
        const search = typeof query === "string" ? query : "";
        return {
            products: service.catalog(search).map((product) => ({
                ...product,
                priceLabel: formatPrice(product.price),
                qty: service.getQty(product.id),
            })),
            items: service.list().map((line) => ({ ...line, lineTotalLabel: formatPrice(line.lineTotal) })),
            count: service.count(),
            totalLabel: formatPrice(service.total()),
        };
    }

    return {
        state,
        add(id) {
            return Number.isInteger(id) ? service.add(id) : { ok: false, error: ERROR_BAD_DATA };
        },
        setQty(id, qty) {
            return Number.isInteger(id) && typeof qty === "number"
                ? service.setQty(id, qty)
                : { ok: false, error: ERROR_BAD_DATA };
        },
        remove(id) {
            return Number.isInteger(id) ? service.remove(id) : { ok: false, error: ERROR_BAD_DATA };
        },
        clear() {
            return service.clear();
        },
    };
}
