// Інтерфейс адаптера збереження: кожна платформа реалізує його по-своєму
export class CartStorageAdapter {
    load() {
        throw new Error("Метод load() не реалізовано.");
    }

    save(items) {
        throw new Error("Метод save() не реалізовано.");
    }
}

// Адаптер для тестів: дані зберігаються лише в пам'яті
export class MemoryStorageAdapter extends CartStorageAdapter {
    constructor(initial = []) {
        super();
        this.items = initial;
    }

    load() {
        return this.items;
    }

    save(items) {
        this.items = items.map((item) => ({ ...item }));
    }
}
