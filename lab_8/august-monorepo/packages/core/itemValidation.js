// Правила перевірки даних товару (єдине місце для всіх клієнтів)
import { CATEGORIES } from "./catalog.js";

export const MAX_NAME_LENGTH = 60;
export const ERROR_EMPTY_NAME = "Будь ласка, введіть назву товару.";
export const ERROR_TOO_LONG = "Назва товару не повинна перевищувати " + MAX_NAME_LENGTH + " символів.";
export const ERROR_PRICE = "Будь ласка, вкажіть коректну ціну більшу за нуль.";
export const ERROR_CATEGORY = "Будь ласка, оберіть категорію товару.";

// Перетворює введену ціну ("54,99" або 54.99) на число; некоректне значення дає NaN
export function parsePrice(value) {
    if (typeof value === "number") {
        return value;
    }
    if (typeof value !== "string") {
        return NaN;
    }
    return parseFloat(value.trim().replace(",", "."));
}

/*
  validateItem перевіряє назву, ціну і категорію товару.
  Повертає { isValid, error }. Довжина назви вимірюється без зайвих пробілів.
*/
export function validateItem(data) {
    const item = data || {};
    const name = typeof item.name === "string" ? item.name.trim() : "";

    if (name === "") {
        return { isValid: false, error: ERROR_EMPTY_NAME };
    }
    if (name.length > MAX_NAME_LENGTH) {
        return { isValid: false, error: ERROR_TOO_LONG };
    }
    if (!(parsePrice(item.price) > 0)) {
        return { isValid: false, error: ERROR_PRICE };
    }
    if (!CATEGORIES.includes(item.category)) {
        return { isValid: false, error: ERROR_CATEGORY };
    }
    return { isValid: true, error: "" };
}
