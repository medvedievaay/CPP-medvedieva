// Інтерфейс адаптера сховища: ядро знає лише про два методи — load() і save(items)

export class CartStorageAdapter {
    async load() {
        throw new Error("Метод load() не реалізовано");
    }

    async save(items) {
        throw new Error("Метод save() не реалізовано");
    }
}

// Адаптер для тестів і прототипів: дані лише в пам'яті, на диск нічого не пишеться
export class MemoryStorageAdapter extends CartStorageAdapter {
    constructor(initial = []) {
        super();
        this.items = initial;
    }

    async load() {
        return this.items;
    }

    async save(items) {
        this.items = items;
    }
}
