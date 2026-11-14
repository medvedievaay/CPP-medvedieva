// Сервіс кошика: уся бізнес-логіка. Адаптер сховища приходить ззовні (dependency injection).
import { PRODUCTS } from "./catalog.js";
import { validateItem } from "./itemValidation.js";
import {
    createCartItem,
    countItems,
    calcTotal,
    sortItemsByAdded,
    filterByQuery,
    sanitizeItems,
} from "./cartUtils.js";

export const ERROR_NOT_FOUND = "Товар не знайдено.";

export class CartService {
    constructor(adapter, options = {}) {
        this.adapter = adapter;
        this.now = options.now || function () { return new Date(); };
    }

    // Читає кошик зі сховища, відкидаючи пошкоджені записи
    async #read() {
        return sanitizeItems(await this.adapter.load());
    }

    // Каталог товарів, відфільтрований за пошуковим запитом
    searchProducts(query) {
        return filterByQuery(PRODUCTS, query);
    }

    // Кошик у порядку додавання: { items, count, total }
    async summary() {
        const items = sortItemsByAdded(await this.#read());
        return { items: items, count: countItems(items), total: calcTotal(items) };
    }

    // Додає власний товар після перевірки: { ok: true, item } або { ok: false, error }
    async add(data) {
        const check = validateItem(data);
        if (!check.isValid) {
            return { ok: false, error: check.error };
        }
        return this.#put(data);
    }

    // Додає товар із каталогу за назвою
    async addProduct(name) {
        const product = PRODUCTS.find(function (entry) {
            return entry.name === name;
        });
        if (!product) {
            return { ok: false, error: ERROR_NOT_FOUND };
        }
        return this.#put(product);
    }

    // Збільшує кількість наявного товару або створює нову позицію
    async #put(data) {
        const items = await this.#read();
        const name = data.name.trim();
        const existing = items.find(function (item) {
            return item.name.toLowerCase() === name.toLowerCase();
        });

        let item;
        if (existing) {
            existing.qty += 1;
            item = existing;
        } else {
            const nextId = items.reduce(function (max, entry) {
                return Math.max(max, entry.id);
            }, 0) + 1;
            item = createCartItem(data, nextId, this.now());
            items.push(item);
        }

        await this.adapter.save(items);
        return { ok: true, item: item };
    }

    // Змінює кількість; при досягненні нуля позицію видалено
    async changeQty(id, delta) {
        const items = await this.#read();
        const item = items.find(function (entry) {
            return entry.id === id;
        });
        if (!item) {
            return { ok: false, error: ERROR_NOT_FOUND };
        }

        item.qty += delta;
        const left = item.qty > 0 ? items : items.filter(function (entry) {
            return entry.id !== id;
        });
        await this.adapter.save(left);
        return { ok: true, removed: item.qty <= 0 };
    }

    // Видаляє позицію за id
    async remove(id) {
        const items = await this.#read();
        const left = items.filter(function (entry) {
            return entry.id !== id;
        });
        if (left.length === items.length) {
            return { ok: false, error: ERROR_NOT_FOUND };
        }
        await this.adapter.save(left);
        return { ok: true };
    }
}
