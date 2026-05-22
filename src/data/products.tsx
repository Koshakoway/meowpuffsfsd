import "./styles/app.css";
import { useState } from "react";
import { products } from "./data/products";

export default function App() {
  const [cart, setCart] = useState<number[]>([]);

  function add(id: number) {
    setCart((prev) => [...prev, id]);
  }

  const total = cart.reduce((sum, id) => {
    const item = products.find(
      (p) => p.id === id
    );

    return sum + (item?.price || 0);
  }, 0);

  return (
    <div className="app">

      <div className="title">
        NEON
      </div>

      <div className="subtitle">
        Каталог
      </div>

      <div className="products">

        {products.map((item) => (

          <div
            key={item.id}
            className="card"
          >

            <div className="preview" />

            <div className="content">

              <div className="product">
                {item.name}
              </div>

              <div className="desc">
                {item.flavor}
              </div>

              <div className="desc">
                Остаток:
                {" "}
                {item.stock}
              </div>

              <div className="price">
                {item.price} ₽
              </div>

              <button
                className="buy"
                onClick={() =>
                  add(item.id)
                }
              >
                Добавить
              </button>

            </div>

          </div>

        ))}

      </div>

      <div className="bottom">

        🛒 {cart.length}

        <div>

          {total} ₽

        </div>

      </div>

    </div>
  );
}