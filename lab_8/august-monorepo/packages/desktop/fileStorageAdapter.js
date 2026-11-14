// Адаптер десктопної платформи: зберігає кошик у JSON-файлі.
// Модуль не підключає Electron, тому тестується звичайним node --test.
import fs from "node:fs/promises";
import path from "node:path";
import { CartStorageAdapter } from "@august/core";

export class FileStorageAdapter extends CartStorageAdapter {
    constructor(filePath) {
        super();
        this.filePath = filePath;
    }

    // Порожній масив, якщо файлу немає або він пошкоджений
    async load() {
        try {
            const data = JSON.parse(await fs.readFile(this.filePath, "utf-8"));
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    // Створює теку, якщо її немає, і записує масив у файл
    async save(items) {
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        await fs.writeFile(this.filePath, JSON.stringify(items, null, 2), "utf-8");
    }
}
