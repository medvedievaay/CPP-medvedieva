// Логіка інтерфейсу (рендер-процес). Доступу до Node.js немає —
// усі операції з файлом виконуються через window.cartAPI.

// Товари каталогу (ті самі, що у вебверсії з лабораторної роботи 1)
const products = [
    { name: "Молоко 2.5%, 1 л", price: 54.99, icon: "🥛" },
    { name: "Хліб пшеничний, 500 г", price: 32.5, icon: "🍞" },
    { name: "Яйця курячі, 10 шт", price: 68, icon: "🥚" },
    { name: "Кава мелена, 250 г", price: 149.99, icon: "☕" },
    { name: "Сир твердий, 300 г", price: 119, icon: "🧀" },
    { name: "Вода негазована, 1.5 л", price: 24.99, icon: "💧" },
];

const productGrid = document.getElementById("productGrid");
const itemInput = document.getElementById("itemInput");
const priceInput = document.getElementById("priceInput");
const addItemButton = document.getElementById("addItemButton");
const messageBox = document.getElementById("message");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");

// Масив товарів кошика: { id, name, price, qty, icon }
let cart = [];

/*
  Функція showMessage виводить повідомлення під формою.
  Колір: "red" — помилка чи видалення, "green" — успіх.
*/
function showMessage(text, color) {
    messageBox.textContent = text;
    messageBox.className = "message " + (color === "green" ? "message--success" : "message--error");
}

// Зберігає кошик у файл через головний процес
async function saveCart() {
    await window.cartAPI.saveCart(cart);
}

// Форматує число як ціну: 54.99 -> "54.99 грн"
function formatPrice(value) {
    return value.toFixed(2) + " грн";
}

/*
  Функція createButton створює кнопку з класом, текстом,
  підписом для скрінрідерів і обробником кліку.
*/
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

/*
  Функція renderProducts малює картки товарів каталогу
  з кнопкою "Додати".
*/
function renderProducts() {
    productGrid.innerHTML = "";

    products.forEach(function (product) {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("div");
        image.className = "product-card__image";
        image.setAttribute("aria-hidden", "true");
        image.textContent = product.icon;

        const price = document.createElement("p");
        price.className = "product-card__price";
        price.textContent = formatPrice(product.price);

        const name = document.createElement("p");
        name.className = "product-card__name";
        name.textContent = product.name;

        const action = document.createElement("div");
        action.className = "product-card__action";
        action.appendChild(
            createButton("product-card__add", "Додати", null, function () {
                addToCart(product.name, product.price, product.icon);
            })
        );

        card.append(image, price, name, action);
        productGrid.appendChild(card);
    });
}

/*
  Функція renderCart перемальовує кошик: рядок для кожного товару
  з лічильником "− кількість +" та кнопкою видалення, а також суму.
*/
function renderCart() {
    cartList.innerHTML = "";

    if (cart.length === 0) {
        const empty = document.createElement("p");
        empty.className = "cart-empty";
        empty.textContent = "Кошик порожній. Додайте товари з каталогу.";
        cartList.appendChild(empty);
    }

    cart.forEach(function (item) {
        const row = document.createElement("div");
        row.className = "cart-item";

        const image = document.createElement("div");
        image.className = "cart-item__image";
        image.setAttribute("aria-hidden", "true");
        image.textContent = item.icon || "🛒";

        const itemName = document.createElement("p");
        itemName.className = "cart-item__name";
        itemName.textContent = item.name;

        const itemPrice = document.createElement("p");
        itemPrice.className = "cart-item__price";
        itemPrice.textContent = formatPrice(item.price * item.qty);

        const info = document.createElement("div");
        info.className = "cart-item__info";
        info.append(itemName, itemPrice);

        const stepper = document.createElement("div");
        stepper.className = "product-card__stepper cart-item__stepper";

        const qtyLabel = document.createElement("span");
        qtyLabel.className = "product-card__qty";
        qtyLabel.textContent = item.qty + " шт";

        stepper.append(
            createButton("product-card__qty-btn", "−", "Зменшити кількість", function () {
                changeQty(item.id, -1);
            }),
            qtyLabel,
            createButton("product-card__qty-btn", "+", "Збільшити кількість", function () {
                changeQty(item.id, 1);
            })
        );

        const removeButton = createButton("cart-item__remove", "✕", "Видалити товар", function () {
            removeItem(item.id);
        });

        const controls = document.createElement("div");
        controls.className = "cart-item__controls";
        controls.append(stepper, removeButton);

        row.append(image, info, controls);
        cartList.appendChild(row);
    });

    const total = cart.reduce(function (sum, item) {
        return sum + item.price * item.qty;
    }, 0);
    cartTotal.textContent = formatPrice(total);
}

/*
  Функція addToCart додає товар у кошик (або збільшує кількість,
  якщо такий товар уже є), перемальовує список і зберігає його у файл.
*/
async function addToCart(name, price, icon) {
    const existing = cart.find(function (item) {
        return item.name === name;
    });

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: Date.now(), name: name, price: price, qty: 1, icon: icon || "🛒" });
    }

    renderCart();
    await saveCart();
    showMessage("Товар успішно додано та збережено у файл.", "green");
}

// Змінює кількість товару; при досягненні нуля видаляє його
async function changeQty(id, delta) {
    const item = cart.find(function (entry) {
        return entry.id === id;
    });

    if (!item) {
        return;
    }

    item.qty += delta;

    if (item.qty <= 0) {
        await removeItem(id);
        return;
    }

    renderCart();
    await saveCart();
}

// Видаляє товар із кошика, зберігає список і показує повідомлення
async function removeItem(id) {
    cart = cart.filter(function (item) {
        return item.id !== id;
    });

    renderCart();
    await saveCart();
    showMessage("Товар видалено.", "red");
}

/*
  Функція addCustomItem обробляє форму "Додати товар":
  перевіряє назву (без пробілів) і ціну, після чого додає товар.
*/
async function addCustomItem() {
    const name = itemInput.value.trim();
    const price = parseFloat(priceInput.value.trim().replace(",", "."));

    if (name === "") {
        showMessage("Будь ласка, введіть назву товару.", "red");
        return;
    }

    if (!(price > 0)) {
        showMessage("Будь ласка, вкажіть коректну ціну більшу за нуль.", "red");
        return;
    }

    itemInput.value = "";
    priceInput.value = "";
    await addToCart(name, price, "🛒");
}

// Додавання кнопкою та клавішею Enter у полях форми
addItemButton.addEventListener("click", addCustomItem);

[itemInput, priceInput].forEach(function (input) {
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addCustomItem();
        }
    });
});

/*
  Під час завантаження вікна отримуємо збережений кошик із файлу
  (через preload-міст) і показуємо його у списку.
*/
document.addEventListener("DOMContentLoaded", async function () {
    renderProducts();

    const saved = await window.cartAPI.loadCart();
    cart = saved.filter(function (item) {
        return item && typeof item.name === "string" && item.price > 0 && item.qty > 0;
    });

    renderCart();
});
