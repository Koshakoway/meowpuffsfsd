type Props = {
  name: string;
  price: number;
  desc: string;
  onAdd: () => void;
};

export default function ProductCard({
  name,
  price,
  desc,
  onAdd,
}: Props) {
  return (
    <div className="card">
      <div className="preview" />

      <div className="content">
        <h2>{name}</h2>

        <p>{desc}</p>

        <div className="price">
          {price} ₽
        </div>

        <button
          className="buy"
          onClick={onAdd}
        >
          Добавить
        </button>
      </div>
    </div>
  );
}