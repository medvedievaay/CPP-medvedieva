import test from "node:test";
import assert from "node:assert/strict";
import { CartService } from "@august/core";
import { LocalStorageAdapter } from "../localStorageAdapter.js";

// Підставний об'єкт замість localStorage (у Node.js його немає)
function fakeStorage(initial = {}) {
    const data = { ...initial };
    return {
        getItem: (key) => (key in data ? data[key] : null),
        setItem: (key, value) => { data[key] = String(value); },
        data,
    };
}

test("порожнє сховище повертає порожній масив", () => {
    assert.deepEqual(new LocalStorageAdapter(fakeStorage()).load(), []);
});

test("запис із наступним читанням", () => {
    const adapter = new LocalStorageAdapter(fakeStorage());
    adapter.save([{ id: 1, qty: 2 }]);
    assert.deepEqual(adapter.load(), [{ id: 1, qty: 2 }]);
});

test("пошкоджений JSON не ламає застосунок", () => {
    const adapter = new LocalStorageAdapter(fakeStorage({ "august-cart": "{не json" }));
    assert.deepEqual(adapter.load(), []);
});

test("дані, що не є масивом, ігноруються", () => {
    const adapter = new LocalStorageAdapter(fakeStorage({ "august-cart": '{"id":1}' }));
    assert.deepEqual(adapter.load(), []);
});

test("робота разом із CartService", () => {
    const storage = fakeStorage();
    new CartService(new LocalStorageAdapter(storage)).setQty(2, 4);
    const restored = new CartService(new LocalStorageAdapter(storage));
    assert.equal(restored.getQty(2), 4);
});
