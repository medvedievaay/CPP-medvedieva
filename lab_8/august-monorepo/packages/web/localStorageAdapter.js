// Адаптер веб-платформи: зберігає кошик у localStorage браузера
import { CartStorageAdapter } from "@august/core";

export const STORAGE_KEY = "august-cart";

export class LocalStorageAdapter extends CartStorageAdapter {
    // Сховище передається ззовні (у тестах — простий об'єкт замість localStorage)
    constructor(storage = globalThis.localStorage) {
        super();
        this.storage = storage;
    }

    async load() {
        try {
            const data = JSON.parse(this.storage.getItem(STORAGE_KEY));
            return Array.isArray(data) ? data : [];
        } catch (error) {
            // Порожнє сховище або пошкоджений JSON не ламають застосунок
            return [];
        }
    }

    async save(items) {
        this.storage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
}
