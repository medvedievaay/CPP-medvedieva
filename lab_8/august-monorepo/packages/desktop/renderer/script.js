// Рендер-процес десктопного клієнта August. Доступу до Node.js і до ядра немає:
// усі дії виконуються через window.augustAPI (preload), а перевірку робить ядро в головному процесі.
const api = window.augustAPI;

const productGrid = document.getElementById("productGrid");
const itemInput = document.getElementById("itemInput");
const priceInput = document.getElementById("priceInput");
const addItemButton = document.getElementById("addItemButton");
const messageBox = document.getElementById("message");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const categoryChips = document.getElementById("categoryChips");

// Елементи верхньої панелі навігації
const topnavBar = document.querySelector(".topnav-bar");
const topnavLogo = document.querySelector(".topnav__logo");
const navExtras = document.getElementById("navExtras");
const heroExtras = document.getElementById("heroExtras");
const catalogButton = document.getElementById("catalogButton");
const catalogSection = document.getElementById("catalogSection");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const navCartTotal = document.getElementById("navCartTotal");

let categories = [];
let selectedCategory = "";
let searchQuery = "";

// Виводить повідомлення під формою: "green" — успіх, "red" — помилка
function showMessage(text, color) {
    messageBox.textContent = text;
    messageBox.className = "message " + (color === "green" ? "message--success" : "message--error");
}

// Створює кнопку з класом, текстом, підписом і обробником кліку
function createButton(className, text, label, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = text;
    if (label) {
        button.setAttribute("aria-label", label);
    }
    button.addEventListener("click", onClick);
    return button;
}

// Кнопки-категорії у формі; повторний клік знімає вибір
function renderCategoryChips() {
    categoryChips.innerHTML = "";

    categories.forEach(function (category) {
        const chip = createButton("chip", category, null, function () {
            selectedCategory = selectedCategory === category ? "" : category;
            renderCategoryChips();
        });
        chip.setAttribute("role", "radio");
        chip.setAttribute("aria-checked", String(selectedCategory === category));
        if (selectedCategory === category) {
            chip.classList.add("chip--active");
        }
        categoryChips.appendChild(chip);
    });
}

// Створює лічильник "− N шт +" для позиції кошика
function createStepper(item, extraClass) {
    const stepper = document.createElement("div");
    stepper.className = "product-card__stepper" + (extraClass ? " " + extraClass : "");

    const qtyLabel = document.createElement("span");
    qtyLabel.className = "product-card__qty";
    qtyLabel.textContent = item.qty + " шт";

    stepper.append(
        createButton("product-card__qty-btn", "−", "Зменшити кількість", function () {
            runAction(api.changeQty(item.id, -1));
        }),
        qtyLabel,
        createButton("product-card__qty-btn", "+", "Збільшити кількість", function () {
            runAction(api.changeQty(item.id, 1));
        })
    );
    return stepper;
}

// Каталог: кнопка "Додати" або лічильник, якщо товар уже в кошику
async function renderProducts(cartItems) {
    productGrid.innerHTML = "";

    const products = await api.catalog(searchQuery);
    products.forEach(function (product) {
        const inCart = cartItems.find(function (item) {
            return item.name === product.name;
        });

        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("div");
        image.className = "product-card__image";
        image.setAttribute("aria-hidden", "true");
        image.textContent = product.icon;

        const category = document.createElement("p");
        category.className = "product-card__category";
        category.textContent = product.category;

        const price = document.createElement("p");
        price.className = "product-card__price";
        price.textContent = product.priceLabel;

        const name = document.createElement("p");
        name.className = "product-card__name";
        name.textContent = product.name;

        const action = document.createElement("div");
        action.className = "product-card__action";
        action.appendChild(
            inCart
                ? createStepper(inCart)
                : createButton("product-card__add", "Додати", null, function () {
                      runAction(api.addProduct(product.name), "Товар додано та збережено у файл.");
                  })
        );

        card.append(image, category, price, name, action);
        productGrid.appendChild(card);
    });
}

// Кошик: рядок для кожного товару та підсумок
function renderCart(summary) {
    cartList.innerHTML = "";

    if (summary.items.length === 0) {
        const empty = document.createElement("p");
        empty.className = "cart-empty";
        empty.textContent = "Кошик порожній. Додайте товари з каталогу.";
        cartList.appendChild(empty);
    }

    summary.items.forEach(function (item) {
        const row = document.createElement("div");
        row.className = "cart-item";

        const image = document.createElement("div");
        image.className = "cart-item__image";
        image.setAttribute("aria-hidden", "true");
        image.textContent = item.icon;

        const itemCategory = document.createElement("p");
        itemCategory.className = "product-card__category";
        itemCategory.textContent = item.category;

        const itemName = document.createElement("p");
        itemName.className = "cart-item__name";
        itemName.textContent = item.name;

        const itemPrice = document.createElement("p");
        itemPrice.className = "cart-item__price";
        itemPrice.textContent = item.priceLabel;

        const info = document.createElement("div");
        info.className = "cart-item__info";
        info.append(itemCategory, itemName, itemPrice);

        const removeButton = createButton("cart-item__remove", "✕", "Видалити товар", function () {
            runAction(api.remove(item.id), "Товар видалено.", "red");
        });

        const controls = document.createElement("div");
        controls.className = "cart-item__controls";
        controls.append(createStepper(item, "cart-item__stepper"), removeButton);

        row.append(image, info, controls);
        cartList.appendChild(row);
    });

    cartTotal.textContent = summary.totalLabel;
    cartCount.textContent = summary.count;
    navCartTotal.textContent = summary.totalLabel;
}

// Перемальовує каталог і кошик за актуальними даними сервісу
async function refresh() {
    const summary = await api.summary();
    await renderProducts(summary.items);
    renderCart(summary);
}

/*
  Виконує дію сервісу, показує повідомлення (текст помилки бере з результату)
  і перемальовує сторінку.
*/
async function runAction(promise, successText, successColor) {
    const result = await promise;
    if (!result.ok) {
        showMessage(result.error, "red");
    } else if (successText) {
        showMessage(successText, successColor || "green");
    }
    await refresh();
    return result;
}

// Форма "Додати товар": дані передаємо сервісу, перевірка — у ядрі
addItemButton.addEventListener("click", async function () {
    const result = await runAction(
        api.add({ name: itemInput.value, price: priceInput.value, category: selectedCategory }),
        "Товар успішно додано та збережено у файл."
    );
    if (result.ok) {
        itemInput.value = "";
        priceInput.value = "";
        selectedCategory = "";
        renderCategoryChips();
    }
});

[itemInput, priceInput].forEach(function (input) {
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addItemButton.click();
        }
    });
});

// Пошук фільтрує каталог (сам пошук виконує ядро)
searchInput.addEventListener("input", function () {
    searchQuery = searchInput.value;
    refresh();
    if (searchQuery.trim() !== "") {
        catalogSection.scrollIntoView({ behavior: "smooth" });
    }
});

catalogButton.addEventListener("click", function () {
    catalogSection.scrollIntoView({ behavior: "smooth" });
});

// Відступ сторінки під закріплену панель навігації
function adjustBodyOffset() {
    const barHeight = topnavBar.offsetHeight;
    document.body.style.paddingTop = barHeight + "px";
    document.documentElement.style.scrollPaddingTop = barHeight + "px";
}

// На мобільних блок "Всі товари" + пошук переходить у шапку під панель
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
    adjustBodyOffset();
}

placeNavExtras();
window.addEventListener("resize", placeNavExtras);
window.addEventListener("load", placeNavExtras);

// Під час запуску беремо категорії та збережений кошик (через preload-міст)
async function start() {
    categories = (await api.meta()).categories;
    renderCategoryChips();
    await refresh();
}

start();
