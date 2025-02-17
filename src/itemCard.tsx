import { Link } from "react-router";

export const ItemCard = ({ id, name }: { id: number; name: string }) => {
  return (
    <div>
      <Link to={`/item/${id}`}>{name}</Link>
    </div>
  );
};
