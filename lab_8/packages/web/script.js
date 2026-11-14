// Веб-клієнт August: інтерфейс + адаптер localStorage. Правила кошика – у @august/core.
import { CartService, formatPrice } from "@august/core";
import { LocalStorageAdapter } from "./localStorageAdapter.js";

const service = new CartService(new LocalStorageAdapter());

const topnavBar = document.querySelector(".topnav-bar");
const topnavLogo = document.querySelector(".topnav__logo");
const navExtras = document.getElementById("navExtras");
const heroExtras = document.getElementById("heroExtras");
const catalogButton = document.getElementById("catalogButton");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const searchInput = document.getElementById("searchInput");
const backToTop = document.getElementById("backToTop");
const catalogSection = document.getElementById("catalogSection");
const catalogMessage = document.getElementById("catalogMessage");
const productGrid = document.getElementById("productGrid");

const cartOverlay = document.getElementById("cartOverlay");
const cartDrawer = document.getElementById("cartDrawer");
const cartItemsBox = document.getElementById("cartItems");
const cartSummaryItems = document.getElementById("cartSummaryItems");
const cartSummaryTotal = document.getElementById("cartSummaryTotal");
const clearCartButton = document.getElementById("clearCartButton");
const closeCartButton = document.getElementById("closeCartButton");
const checkoutButton = document.getElementById("checkoutButton");
const checkoutMessage = document.getElementById("checkoutMessage");

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function button(className, text, label, onClick) {
    const node = el("button", className, text);
    node.type = "button";
    if (label) node.setAttribute("aria-label", label);
    node.addEventListener("click", onClick);
    return node;
}

// Усі дії над кошиком проходять через сервіс; помилку показує повідомлення з ядра
function changeQty(id, qty) {
    const result = service.setQty(id, qty);
    catalogMessage.textContent = result.ok ? "" : result.error;
    renderAll();
}

function createStepper(id, extraClass) {
    const stepper = el("div", "product-card__stepper" + (extraClass ? " " + extraClass : ""));
    const qty = service.getQty(id);
    stepper.append(
        button("product-card__qty-btn", "−", "Зменшити кількість", () => changeQty(id, qty - 1)),
        el("span", "product-card__qty", qty + " шт"),
        button("product-card__qty-btn", "+", "Збільшити кількість", () => changeQty(id, qty + 1))
    );
    return stepper;
}

function renderCatalog() {
    productGrid.innerHTML = "";
    service.catalog(searchInput.value).forEach((product) => {
        const card = el("article", "product-card");
        const action = el("div", "product-card__action");
        action.append(
            service.getQty(product.id) === 0
                ? button("product-card__add", "Додати", null, () => changeQty(product.id, 1))
                : createStepper(product.id)
        );
        const image = el("div", "product-card__image", product.icon);
        image.setAttribute("aria-hidden", "true");
        card.append(image, el("p", "product-card__price", formatPrice(product.price)),
            el("p", "product-card__name", product.name), action);
        productGrid.appendChild(card);
    });
}

function renderCart() {
    const lines = service.list();
    const totalText = formatPrice(service.total());
    cartCount.textContent = service.count();
    cartTotal.textContent = totalText;
    cartSummaryItems.textContent = totalText;
    cartSummaryTotal.textContent = totalText;

    cartItemsBox.innerHTML = "";
    if (lines.length === 0) {
        cartItemsBox.appendChild(el("p", "cart-drawer__empty", "Кошик порожній. Додайте товари з каталогу."));
        return;
    }
    lines.forEach((line) => {
        const item = el("div", "cart-item");
        const image = el("div", "cart-item__image", line.icon);
        image.setAttribute("aria-hidden", "true");
        const info = el("div", "cart-item__info");
        info.append(el("p", "cart-item__name", line.name), el("p", "cart-item__price", formatPrice(line.lineTotal)));
        const controls = el("div", "cart-item__controls");
        controls.append(createStepper(line.id, "cart-item__stepper"),
            button("cart-item__remove", "✕", "Видалити товар", () => changeQty(line.id, 0)));
        item.append(image, info, controls);
        cartItemsBox.appendChild(item);
    });
}

function renderAll() {
    renderCatalog();
    renderCart();
}

// Розміщення блоку «Всі товари» + пошук (мобільна / десктопна версії)
const mobileQuery = window.matchMedia("(max-width: 600px)");

function placeNavExtras() {
    if (mobileQuery.matches) {
        if (navExtras.parentElement !== heroExtras) {
            heroExtras.appendChild(navExtras);
            navExtras.classList.add("in-hero");
        }
    } else if (navExtras.parentElement !== topnavLogo.parentElement) {
        topnavLogo.insertAdjacentElement("afterend", navExtras);
        navExtras.classList.remove("in-hero");
    }
    const barHeight = topnavBar.offsetHeight;
    document.body.style.paddingTop = barHeight + "px";
    document.documentElement.style.scrollPaddingTop = barHeight + "px";
}

function setCartOpen(isOpen) {
    cartOverlay.classList.toggle("is-open", isOpen);
    cartDrawer.classList.toggle("is-open", isOpen);
    cartDrawer.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("cart-open", isOpen);
}

let hasScrolledForSearch = false;
searchInput.addEventListener("input", () => {
    const hasQuery = searchInput.value.trim() !== "";
    if (hasQuery && !hasScrolledForSearch) {
        catalogSection.scrollIntoView({ behavior: "smooth" });
    }
    hasScrolledForSearch = hasQuery;
    renderCatalog();
});

catalogButton.addEventListener("click", () => catalogSection.scrollIntoView({ behavior: "smooth" }));
cartButton.addEventListener("click", () => setCartOpen(true));
closeCartButton.addEventListener("click", () => setCartOpen(false));
cartOverlay.addEventListener("click", () => setCartOpen(false));
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setCartOpen(false);
});

clearCartButton.addEventListener("click", () => {
    service.clear();
    checkoutMessage.textContent = "";
    catalogMessage.textContent = "";
    renderAll();
});

checkoutButton.addEventListener("click", () => {
    checkoutMessage.textContent = service.count() > 0
        ? "Дякуємо! Це навчальний приклад, оплата не виконується."
        : "Спершу додайте товари з каталогу.";
});

window.addEventListener("scroll", () => backToTop.classList.toggle("is-visible", window.scrollY > 400));
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

placeNavExtras();
window.addEventListener("resize", placeNavExtras);
window.addEventListener("load", placeNavExtras);
renderAll();
