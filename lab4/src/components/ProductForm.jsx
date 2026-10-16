import { useState } from "react";

const CATEGORIES = [
  "Молочні",
  "Хлібобулочні",
  "Напої",
  "М'ясо та риба",
  "Овочі та фрукти",
  "Інше",
];

const EMPTY_FORM = { name: "", price: "", category: CATEGORIES[0] };

const fieldClass =
  "rounded-lg border border-neutral-300 px-4 py-3 text-base focus:border-neutral-900 focus:outline-none";

function ProductForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);

  // Один обробник для всіх полів: ім'я поля збігається з ключем у стані
  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const added = onAdd(form);

    if (added) {
      setForm(EMPTY_FORM);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 grid grid-cols-2 gap-3 max-sm:grid-cols-1"
    >
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Назва товару"
        aria-label="Назва товару"
        className={`col-span-2 max-sm:col-span-1 ${fieldClass}`}
      />
      <input
        type="number"
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Ціна, грн"
        aria-label="Ціна"
        min="0"
        step="0.01"
        className={fieldClass}
      />
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        aria-label="Категорія"
        className={fieldClass}
      >
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="col-span-2 cursor-pointer rounded-lg bg-neutral-900 px-5 max-sm:col-span-1 py-3 text-base text-white hover:bg-neutral-700"
      >
        Додати
      </button>
    </form>
  );
}

export default ProductForm;
