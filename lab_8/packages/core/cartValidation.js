// Правила перевірки кількості товару в кошику (спільні для всіх клієнтів)
export const MAX_ITEM_QTY = 10;
export const ERROR_NOT_INTEGER = "Кількість має бути цілим числом.";
export const ERROR_NEGATIVE = "Кількість не може бути від’ємною.";
export const ERROR_TOO_MANY = `Кількість одного товару не може перевищувати ${MAX_ITEM_QTY} шт.`;

// Повертає { isValid, error }. Нуль допустимий: він означає видалення товару з кошика.
export function validateQuantity(qty) {
    if (typeof qty !== "number" || !Number.isInteger(qty)) {
        return { isValid: false, error: ERROR_NOT_INTEGER };
    }
    if (qty < 0) {
        return { isValid: false, error: ERROR_NEGATIVE };
    }
    if (qty > MAX_ITEM_QTY) {
        return { isValid: false, error: ERROR_TOO_MANY };
    }
    return { isValid: true, error: null };
}
