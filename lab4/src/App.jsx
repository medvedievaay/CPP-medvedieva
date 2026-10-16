import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import ProductForm from "./components/ProductForm.jsx";
import ProductList from "./components/ProductList.jsx";

const STORAGE_KEY = "august-products";

// Читаємо збережені товари з localStorage (або порожній масив)
function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function App() {
  const [products, setProducts] = useState(loadProducts);
  const [message, setMessage] = useState(null);
  const [query, setQuery] = useState("");

  // Зберігаємо товари щоразу, коли змінюється стан products
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  // Повертає true, якщо товар додано, і false, якщо дані некоректні
  function addProduct({ name, price, category }) {
    const trimmedName = name.trim();

    if (trimmedName === "") {
      setMessage({ text: "Введіть назву товару.", type: "error" });
      return false;
    }

    const numericPrice = Number(price);
    if (price === "" || Number.isNaN(numericPrice) || numericPrice <= 0) {
      setMessage({ text: "Введіть коректну ціну.", type: "error" });
      return false;
    }

    const newProduct = {
      id: Date.now(),
      name: trimmedName,
      price: numericPrice,
      category,
      done: false,
    };
    setProducts([...products, newProduct]);
    setMessage({ text: "Товар додано.", type: "success" });
    return true;
  }

  function toggleProduct(id) {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, done: !product.done } : product
      )
    );
  }

  function deleteProduct(id) {
    setProducts(products.filter((product) => product.id !== id));
    setMessage({ text: "Товар видалено.", type: "success" });
  }

  const doneCount = products.filter((product) => product.done).length;
  // Сума куплених товарів змінюється при кожній відмітці прапорця
  const doneSum = products
    .filter((product) => product.done)
    .reduce((sum, product) => sum + product.price, 0);

  // Відфільтрований список обчислюється "на льоту" й окремо в стані не зберігається
  const normalizedQuery = query.trim().toLowerCase();
  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(normalizedQuery)
  );
  const emptyText =
    products.length === 0
      ? "Товарів поки немає. Додайте перший!"
      : "За вашим запитом нічого не знайдено.";

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 max-sm:px-3 max-sm:py-4 text-neutral-800">
      <main className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-lg max-sm:p-4">
        <Header
          total={products.length}
          done={doneCount}
          sum={doneSum}
        />
        <ProductForm onAdd={addProduct} />
        {message && (
          <p
            className={
              message.type === "error"
                ? "mb-4 font-bold text-rose-600"
                : "mb-4 font-bold text-emerald-700"
            }
          >
            {message.text}
          </p>
        )}
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Пошук за назвою"
          aria-label="Пошук товарів"
          className="mb-4 w-full rounded-lg border border-neutral-300 bg-stone-50 px-4 py-3 text-base focus:border-neutral-900 focus:bg-white focus:outline-none"
        />
        <ProductList
          products={visibleProducts}
          emptyText={emptyText}
          onToggle={toggleProduct}
          onDelete={deleteProduct}
        />
      </main>
    </div>
  );
}

export default App;
