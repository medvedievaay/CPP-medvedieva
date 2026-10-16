const EMOJI = {
  "Молочні": "🥛",
  "Хлібобулочні": "🍞",
  "Напої": "☕",
  "М'ясо та риба": "🥩",
  "Овочі та фрукти": "🍎",
  "Інше": "🛒",
};

function ProductItem({ product, onToggle, onDelete }) {
  const details = [product.category, `${product.price.toFixed(2)} грн`];

  return (
    <li
      className={
        product.done
          ? "flex items-center justify-between gap-3 rounded-lg bg-neutral-200 p-3 max-sm:flex-col max-sm:items-stretch"
          : "flex items-center justify-between gap-3 rounded-lg bg-stone-100 p-3 max-sm:flex-col max-sm:items-stretch"
      }
    >
     <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          className="accent-neutral-900"
          checked={product.done}
          onChange={() => onToggle(product.id)}
        />
        <span aria-hidden="true" className="text-2xl">
          {EMOJI[product.category] || "🛒"}
        </span>
        <span className="min-w-0 break-words">
          <span
            className={
              product.done
                ? "block text-neutral-500 line-through"
                : "block text-neutral-900"
            }
          >
            {product.name}
          </span>
          <span className="block text-xs text-neutral-500">
            {details.join(" · ")}
          </span>
        </span>
      </label>
      <button
        type="button"
        onClick={() => onDelete(product.id)}
        className="shrink-0 cursor-pointer rounded-lg bg-rose-500 px-3.5 py-2 text-white hover:bg-rose-700 max-sm:w-full"
      >
        Видалити
      </button>
    </li>
  );
}

export default ProductItem;
