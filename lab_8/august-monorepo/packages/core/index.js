// Публічне API пакета @august/core: клієнти імпортують лише звідси
export { CATEGORIES, PRODUCTS } from "./catalog.js";
export {
    MAX_NAME_LENGTH,
    ERROR_EMPTY_NAME,
    ERROR_TOO_LONG,
    ERROR_PRICE,
    ERROR_CATEGORY,
    parsePrice,
    validateItem,
} from "./itemValidation.js";
export {
    formatPrice,
    createCartItem,
    countItems,
    calcTotal,
    sortItemsByAdded,
    filterByQuery,
    sanitizeItems,
} from "./cartUtils.js";
export { CartStorageAdapter, MemoryStorageAdapter } from "./storageAdapter.js";
export { CartService, ERROR_NOT_FOUND } from "./cartService.js";
