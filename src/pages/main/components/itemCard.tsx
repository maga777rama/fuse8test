import { Link } from "react-router";
import styles from "../styles.module.scss";

interface ItemProps {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  created: string;
}

export const ItemCard = ({ id, name, status, created }: ItemProps) => {
  return (
    <Link className={styles.item} to={`/item/${id}`}>
      <h1 className={styles.item__name}>{name}</h1>
      <div className={styles.item__footer}>
        <p className={styles.item__status}>
          Status:{" "}
          <span className={styles[`item__status__${status.toLowerCase()}`]}>
            {status}
          </span>
        </p>
        <p>Created: {new Date(created).toLocaleDateString("ru-RU")}</p>
      </div>
    </Link>
  );
};
