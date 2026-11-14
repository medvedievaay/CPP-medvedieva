import test from "node:test";
import assert from "node:assert/strict";
import { CartService } from "@august/core";
import { LocalStorageAdapter, STORAGE_KEY } from "../localStorageAdapter.js";

// Простий об'єкт замість localStorage (у Node.js його немає)
function fakeStorage(initial = {}) {
    const data = { ...initial };
    return {
        data,
        getItem: (key) => (key in data ? data[key] : null),
        setItem: (key, value) => {
            data[key] = String(value);
        },
    };
}

test("load повертає порожній масив, якщо сховище порожнє", async () => {
    const adapter = new LocalStorageAdapter(fakeStorage());
    assert.deepEqual(await adapter.load(), []);
});

test("save записує JSON, а load читає його назад", async () => {
    const storage = fakeStorage();
    const adapter = new LocalStorageAdapter(storage);
    const items = [{ id: 1, name: "Сік", price: 45, qty: 1 }];
    await adapter.save(items);
    assert.equal(typeof storage.data[STORAGE_KEY], "string");
    assert.deepEqual(await adapter.load(), items);
});

test("load повертає [] для пошкодженого JSON та для не-масиву", async () => {
    assert.deepEqual(await new LocalStorageAdapter(fakeStorage({ [STORAGE_KEY]: "{ не json" })).load(), []);
    assert.deepEqual(await new LocalStorageAdapter(fakeStorage({ [STORAGE_KEY]: '{"a":1}' })).load(), []);
});

test("адаптер працює зі спільним CartService", async () => {
    const service = new CartService(new LocalStorageAdapter(fakeStorage()));
    await service.addProduct("Хліб пшеничний, 500 г");
    const { items, total } = await service.summary();
    assert.equal(items.length, 1);
    assert.equal(total, 32.5);
});
