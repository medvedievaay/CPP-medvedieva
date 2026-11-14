import fs from "node:fs";
import path from "node:path";
import { CartStorageAdapter } from "@august/core";

// Десктопний адаптер: кошик зберігається у JSON-файлі (без залежності від electron)
export class FileStorageAdapter extends CartStorageAdapter {
    constructor(filePath) {
        super();
        this.filePath = filePath;
    }

    load() {
        try {
            const data = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
            return Array.isArray(data) ? data : [];
        } catch {
            // файлу немає або він пошкоджений – починаємо з порожнього кошика
            return [];
        }
    }

    save(items) {
        fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
        fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2), "utf-8");
    }
}
