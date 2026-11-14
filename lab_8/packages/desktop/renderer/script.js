// Інтерфейс десктопної версії: лише показ і виклики window.cartAPI (власної перевірки немає)
const $ = (id) => document.getElementById(id);
const cartCount = $("cartCount"), cartTotal = $("cartTotal"), searchInput = $("searchInput");
const productGrid = $("productGrid"), catalogMessage = $("catalogMessage");
const cartOverlay = $("cartOverlay"), cartDrawer = $("cartDrawer"), cartItemsBox = $("cartItems");
const checkoutMessage = $("checkoutMessage"), backToTop = $("backToTop");
const topnavBar = document.querySelector(".topnav-bar");

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

async function changeQty(id, qty) {
    const result = await window.cartAPI.setQty(id, qty);
    catalogMessage.textContent = result.ok ? "" : result.error;
    await render();
}

function stepper(id, qty, extraClass) {
    const box = el("div", "product-card__stepper" + (extraClass ? " " + extraClass : ""));
    box.append(
        button("product-card__qty-btn", "−", "Зменшити кількість", () => changeQty(id, qty - 1)),
        el("span", "product-card__qty", qty + " шт"),
        button("product-card__qty-btn", "+", "Збільшити кількість", () => changeQty(id, qty + 1))
    );
    return box;
}

async function render() {
    const state = await window.cartAPI.state(searchInput.value);

    productGrid.innerHTML = "";
    state.products.forEach((product) => {
        const card = el("article", "product-card");
        const action = el("div", "product-card__action");
        action.append(product.qty === 0
            ? button("product-card__add", "Додати", null, () => changeQty(product.id, 1))
            : stepper(product.id, product.qty));
        const image = el("div", "product-card__image", product.icon);
        image.setAttribute("aria-hidden", "true");
        card.append(image, el("p", "product-card__price", product.priceLabel),
            el("p", "product-card__name", product.name), action);
        productGrid.appendChild(card);
    });

    cartCount.textContent = state.count;
    cartTotal.textContent = state.totalLabel;
    $("cartSummaryItems").textContent = state.totalLabel;
    $("cartSummaryTotal").textContent = state.totalLabel;

    cartItemsBox.innerHTML = "";
    if (state.items.length === 0) {
        cartItemsBox.appendChild(el("p", "cart-drawer__empty", "Кошик порожній. Додайте товари з каталогу."));
    }
    state.items.forEach((line) => {
        const item = el("div", "cart-item");
        const image = el("div", "cart-item__image", line.icon);
        image.setAttribute("aria-hidden", "true");
        const info = el("div", "cart-item__info");
        info.append(el("p", "cart-item__name", line.name), el("p", "cart-item__price", line.lineTotalLabel));
        const controls = el("div", "cart-item__controls");
        controls.append(stepper(line.id, line.qty, "cart-item__stepper"),
            button("cart-item__remove", "✕", "Видалити товар", () => changeQty(line.id, 0)));
        item.append(image, info, controls);
        cartItemsBox.appendChild(item);
    });
    window.__cartCount = state.count;
}

function setCartOpen(isOpen) {
    cartOverlay.classList.toggle("is-open", isOpen);
    cartDrawer.classList.toggle("is-open", isOpen);
    cartDrawer.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("cart-open", isOpen);
}

function adjustBodyOffset() {
    document.body.style.paddingTop = topnavBar.offsetHeight + "px";
    document.documentElement.style.scrollPaddingTop = topnavBar.offsetHeight + "px";
}

searchInput.addEventListener("input", render);
$("catalogButton").addEventListener("click", () => $("catalogSection").scrollIntoView({ behavior: "smooth" }));
$("cartButton").addEventListener("click", () => setCartOpen(true));
$("closeCartButton").addEventListener("click", () => setCartOpen(false));
cartOverlay.addEventListener("click", () => setCartOpen(false));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") setCartOpen(false); });

$("clearCartButton").addEventListener("click", async () => {
    await window.cartAPI.clear();
    checkoutMessage.textContent = "";
    catalogMessage.textContent = "";
    await render();
});

$("checkoutButton").addEventListener("click", () => {
    checkoutMessage.textContent = window.__cartCount > 0
        ? "Дякуємо! Це навчальний приклад, оплата не виконується."
        : "Спершу додайте товари з каталогу.";
});

window.addEventListener("scroll", () => backToTop.classList.toggle("is-visible", window.scrollY > 400));
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("resize", adjustBodyOffset);
adjustBodyOffset();
render();
