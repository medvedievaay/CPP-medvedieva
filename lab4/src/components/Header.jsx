function Header({ total, done, sum }) {
  return (
    <header>
      <h1 className="mb-2 text-center font-['Playfair_Display',Georgia,serif] text-4xl font-normal italic text-neutral-900">
        August SPA
      </h1>
      <p className="mb-5 text-center text-neutral-600">
        Усього товарів: {total} · Куплено: {done}
        <br />
        Сума куплених: {sum.toFixed(2)} грн
      </p>
    </header>
  );
}

export default Header;
