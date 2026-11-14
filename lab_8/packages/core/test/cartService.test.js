import test from "node:test";
import assert from "node:assert/strict";
import {
    CartService, MemoryStorageAdapter, CartStorageAdapter,
    MAX_ITEM_QTY, ERROR_TOO_MANY, ERROR_UNKNOWN_PRODUCT, ERROR_NOT_IN_CART,
} from "../index.js";

const makeService = (initial = []) => new CartService(new MemoryStorageAdapter(initial));

test("add додає товар у кошик", () => {
    const service = makeService();
    assert.deepEqual(service.add(1), { ok: true, qty: 1 });
    assert.equal(service.count(), 1);
});

test("повторне add збільшує кількість", () => {
    const service = makeService();
    service.add(1);
    service.add(1);
    assert.equal(service.getQty(1), 2);
    assert.equal(service.list().length, 1);
});

test("перевищення ліміту відхиляється, кількість не змінюється", () => {
    const service = makeService();
    service.setQty(1, MAX_ITEM_QTY);
    assert.deepEqual(service.add(1), { ok: false, error: ERROR_TOO_MANY });
    assert.equal(service.getQty(1), MAX_ITEM_QTY);
});

test("невідомий товар відхиляється", () => {
    assert.deepEqual(makeService().add(999), { ok: false, error: ERROR_UNKNOWN_PRODUCT });
});

test("setQty(id, 0) видаляє товар", () => {
    const service = makeService();
    service.add(2);
    service.setQty(2, 0);
    assert.equal(service.list().length, 0);
});

test("remove видаляє наявний товар і повідомляє про відсутній", () => {
    const service = makeService();
    service.add(3);
    assert.equal(service.remove(3).ok, true);
    assert.deepEqual(service.remove(3), { ok: false, error: ERROR_NOT_IN_CART });
});

test("total і list рахують суму", () => {
    const service = makeService();
    service.setQty(1, 2);
    service.setQty(2, 1);
    assert.equal(service.total(), 142.48);
    assert.equal(service.list()[0].lineTotal, 109.98);
});

test("кошик зберігається в адаптері й відновлюється новим сервісом", () => {
    const adapter = new MemoryStorageAdapter();
    new CartService(adapter).setQty(4, 3);
    assert.equal(new CartService(adapter).getQty(4), 3);
});

test("clear очищає кошик", () => {
    const service = makeService();
    service.add(1);
    service.clear();
    assert.equal(service.count(), 0);
});

test("catalog фільтрує товари за запитом", () => {
    assert.equal(makeService().catalog("кав").length, 1);
});

test("базовий адаптер викидає помилку «не реалізовано»", () => {
    const adapter = new CartStorageAdapter();
    assert.throws(() => adapter.load(), /не реалізовано/);
    assert.throws(() => adapter.save([]), /не реалізовано/);
});
