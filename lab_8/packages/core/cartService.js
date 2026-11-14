import { validateQuantity } from "./cartValidation.js";
import { PRODUCTS } from "./catalog.js";
import {
    calculateTotal,
    countItems,
    filterProductsByQuery,
    findProduct,
    sanitizeCart,
} from "./cartUtils.js";

export const ERROR_UNKNOWN_PRODUCT = "Товару не знайдено.";
export const ERROR_NOT_IN_CART = "Товару немає в кошику.";

// Сервіс кошика: адаптер збереження передається ззовні (впровадження залежності)
export class CartService {
    constructor(adapter, products = PRODUCTS) {
        this.adapter = adapter;
        this.products = products;
        this.items = sanitizeCart(adapter.load(), products);
    }

    // Товари каталогу, відфільтровані за запитом
    catalog(query) {
        return filterProductsByQuery(this.products, query);
    }

    getQty(id) {
        const entry = this.items.find((item) => item.id === id);
        return entry ? entry.qty : 0;
    }

    // Рядки кошика з даними товару та сумою за рядок
    list() {
        return this.items.map((item) => {
            const product = findProduct(this.products, item.id);
            return { ...product, qty: item.qty, lineTotal: Math.round(product.price * item.qty * 100) / 100 };
        });
    }

    // Встановлює кількість товару; 0 видаляє його з кошика
    setQty(id, qty) {
        if (findProduct(this.products, id) === null) {
            return { ok: false, error: ERROR_UNKNOWN_PRODUCT };
        }
        const check = validateQuantity(qty);
        if (!check.isValid) {
            return { ok: false, error: check.error };
        }
        this.items = this.items.filter((item) => item.id !== id);
        if (qty > 0) {
            this.items.push({ id, qty });
        }
        this.adapter.save(this.items);
        return { ok: true, qty };
    }

    add(id) {
        return this.setQty(id, this.getQty(id) + 1);
    }

    remove(id) {
        if (this.getQty(id) === 0) {
            return { ok: false, error: ERROR_NOT_IN_CART };
        }
        return this.setQty(id, 0);
    }

    clear() {
        this.items = [];
        this.adapter.save(this.items);
        return { ok: true };
    }

    total() {
        return calculateTotal(this.list());
    }

    count() {
        return countItems(this.items);
    }
}
