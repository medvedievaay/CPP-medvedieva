import ProductItem from "./ProductItem.jsx";

function ProductList({ products, emptyText, onToggle, onDelete }) {
  if (products.length === 0) {
    return <p className="text-center text-slate-500">{emptyText}</p>;
  }

  return (
    <ul className="space-y-3">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default ProductList;
