import "./styles/app.css";

import {
  useMemo,
  useState,
  useEffect
}
from "react";

import {
  products
}
from "./data/products";

type Category =
  | "Жидкости"
  | "Электронные сигареты"
  | "Картриджи"
  | "Снюс и никотиновые пластинки";

function detectCategory(
  name: string
): Category {

  const n =
    name.toLowerCase();

  if (
    n.includes("molecula") ||
    n.includes("жид")
  ) {
    return "Жидкости";
  }

  if (
    n.includes("hyppe") ||
    n.includes("puffmi") ||
    n.includes("voom") ||
    n.includes("elf") ||
    n.includes("lost mary")
  ) {
    return "Электронные сигареты";
  }

  if (
    n.includes("vaporesso") ||
    n.includes("картридж")
  ) {
    return "Картриджи";
  }

  return "Снюс и никотиновые пластинки";

}

export default function App() {

  const [loading, setLoading] =
    useState(true);

  const [cart, setCart] =
    useState<
      Record<number, number>
    >(() => {

      const saved =
        localStorage.getItem(
          "meow-cart"
        );

      return saved
        ? JSON.parse(saved)
        : {};

    });

  const [open, setOpen] =
    useState(false);

  const [selected, setSelected] =
    useState<any>(null);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState<Category>(
      "Жидкости"
    );

  useEffect(() => {

    localStorage.setItem(
      "meow-cart",
      JSON.stringify(cart)
    );

  }, [cart]);

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setLoading(false);

      }, 1800);

    return () =>
      clearTimeout(timer);

  }, []);

  const categories:
    Category[] = [

    "Жидкости",

    "Электронные сигареты",

    "Картриджи",

    "Снюс и никотиновые пластинки"

  ];

  const filtered =
    useMemo(() => {

      return products.filter(
        (p) => {

          return (

            detectCategory(
              p.name
            ) === category

            &&

            `${p.name} ${p.flavor}`
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )

          );

        }
      );

    }, [
      category,
      search
    ]);

  function add(
    id: number
  ) {

    navigator
      .vibrate?.(30);

    setCart(
      (prev) => ({

        ...prev,

        [id]:
          (
            prev[id] ||
            0
          ) + 1

      })
    );

  }

  function remove(
    id: number
  ) {

    navigator
      .vibrate?.(20);

    setCart(
      (prev) => {

        const next = {
          ...prev
        };

        if (
          next[id] <= 1
        ) {

          delete next[id];

        } else {

          next[id]--;

        }

        return next;

      }
    );

  }

  const count =
    Object
      .values(cart)
      .reduce(
        (a, b) =>
          a + b,
        0
      );

  const items =
    Object
      .entries(cart);

  const total =
    items.reduce(
      (
        sum,
        [id, qty]
      ) => {

        const item =
          products.find(
            (p) =>
              p.id ===
              Number(id)
          );

        if (!item)
          return sum;

        return (
          sum +
          item.price *
          Number(qty)
        );

      },
      0
    );

  function checkout() {

    const text =
      items
        .map(
          (
            [id, qty]
          ) => {

            const item =
              products.find(
                (p) =>
                  p.id ===
                  Number(id)
              );

            if (!item)
              return "";

            return `— ${item.name} ${item.flavor} ×${qty}`;

          }
        )
        .join("\n");

    const message =

`Здравствуйте.

Хочу заказать:

${text}

Итого: ${total} ₽`;

    const encoded =
      encodeURIComponent(
        message
      );

    window.open(

      `https://t.me/fakekoto?text=${encoded}`,

      "_blank"

    );

  }

  if (loading) {

    return (

      <div className="splash">

        <div className="splashGlow" />

        <div className="splashTitle">
          Meow Puff
        </div>

        <div className="splashText">
          premium store
        </div>

      </div>

    );

  }

  return (

    <div className="app">

      <div className="particles">

        {
          Array
            .from({ length: 18 })
            .map((_, i) => (

              <span
                key={i}
              />

            ))
        }

      </div>

      <div className="hero">

        <div className="smoke" />

        <div className="title">
          Meow Puff
        </div>

        <div className="subtitle">
          PREMIUM STORE
        </div>

      </div>

      <input
        className="search"

        placeholder="Поиск"

        value={search}

        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      <div className="categories">

        {categories.map(
          (c) => (

            <button
              key={c}

              className={
                category === c
                  ? "chip activeChip"
                  : "chip"
              }

              onClick={() =>
                setCategory(c)
              }
            >

              {c}

            </button>

          )
        )}

      </div>

      <div className="products">

        {filtered.map(
          (item) => (

            <div
              key={item.id}
              className="card"

              onClick={() =>
                setSelected(item)
              }
            >

              <div className="preview" />

              <div className="content">

                <div className="product">
                  {item.name}
                </div>

                <div className="desc">
                  {item.flavor}
                </div>

                <div className="stock">

                  <span className="dot" />

                  В наличии

                </div>

                <div className="price">
                  {item.price} ₽
                </div>

                {cart[item.id] ? (

                  <div className="cardCounter">

                    <button
                      className="qty"

                      onClick={(e) => {

                        e.stopPropagation();

                        remove(item.id);

                      }}
                    >
                      −
                    </button>

                    <div className="cardQty">
                      {cart[item.id]}
                    </div>

                    <button
                      className="qty"

                      onClick={(e) => {

                        e.stopPropagation();

                        add(item.id);

                      }}
                    >
                      +
                    </button>

                  </div>

                ) : (

                  <button
                    className="buy"

                    onClick={(e) => {

                      e.stopPropagation();

                      add(item.id);

                    }}
                  >
                    Добавить
                  </button>

                )}

              </div>

            </div>

          )
        )}

      </div>

      {count > 0 && (

        <>

          <div
            className="bottom"

            onClick={() =>
              setOpen(true)
            }
          >

            🛒 Корзина • {count}

          </div>

          {open && (

            <div
              className="overlay"

              onClick={() =>
                setOpen(false)
              }
            >

              <div
                className="cartSheet"

                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                <div className="sheetTop">

                  <div
                    className="sheetTitle"
                  >
                    Корзина
                  </div>

                  <button
                    className="close"

                    onClick={() =>
                      setOpen(false)
                    }
                  >
                    ✕
                  </button>

                </div>

                {items.map(
                  ([id, qty]) => {

                    const item =
                      products.find(
                        (p) =>
                          p.id ===
                          Number(id)
                      );

                    if (!item)
                      return null;

                    return (

                      <div
                        key={id}
                        className="item"
                      >

                        <div>

                          <div className="cartName">
                            {item.name}
                          </div>

                          <div className="cartFlavor">
                            {item.flavor}
                          </div>

                        </div>

                        <div className="counter">

                          <button
                            className="qty"

                            onClick={() =>
                              remove(item.id)
                            }
                          >
                            −
                          </button>

                          <div>
                            {qty}
                          </div>

                          <button
                            className="qty"

                            onClick={() =>
                              add(item.id)
                            }
                          >
                            +
                          </button>

                        </div>

                      </div>

                    );

                  }
                )}

                <div className="total">
                  Итого: {total} ₽
                </div>

                <button
                  className="checkout"

                  onClick={checkout}
                >

                  Оформить заявку

                </button>

              </div>

            </div>

          )}

        </>

      )}

      {selected && (

        <div
          className="overlay"

          onClick={() =>
            setSelected(null)
          }
        >

          <div
            className="productModal"

            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="close"

              onClick={() =>
                setSelected(null)
              }
            >
              ✕
            </button>

            <div className="modalImage" />

            <div className="modalContent">

              <div className="modalTitle">
                {selected.name}
              </div>

              <div className="modalFlavor">
                {selected.flavor}
              </div>

              <div className="stock">

                <span className="dot" />

                В наличии

              </div>

              <div className="modalPrice">
                {selected.price} ₽
              </div>

              <div className="modalText">

                {selected.description}

              </div>

              <button
  className="modalBuy"

  onClick={() => {

    add(selected.id);

    setSelected(null);

  }}
>

                Добавить в корзину

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}