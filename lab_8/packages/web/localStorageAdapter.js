import { CartStorageAdapter } from "@august/core";

const STORAGE_KEY = "august-cart";

// Веб-адаптер: зберігає кошик у localStorage браузера у форматі JSON
export class LocalStorageAdapter extends CartStorageAdapter {
    constructor(storage = globalThis.localStorage) {
        super();
        this.storage = storage;
    }

    load() {
        try {
            const raw = this.storage.getItem(STORAGE_KEY);
            const data = raw === null ? [] : JSON.parse(raw);
            return Array.isArray(data) ? data : [];
        } catch {
            // пошкоджений JSON або недоступне сховище не ламають застосунок
            return [];
        }
    }

    save(items) {
        try {
            this.storage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // сховище переповнене або заборонене – кошик працює лише в поточному сеансі
        }
    }
}
