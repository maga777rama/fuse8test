import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

interface Location {
  name: string;
  url: string;
}

export interface ItemProps {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Male" | "Female" | "Genderless" | "unknown";
  origin: Location;
  location: Location;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface IInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface IData {
  info: IInfo;
  results: ItemProps[];
  error?: string;
}

export const ItemDetailed = () => {
  const { id } = useParams();
  const [data, setData] = useState<ItemProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://rickandmortyapi.com/api/character/${id}`,
        );
        if (!res.ok) {
          setData(await res.json());
        }
        setData(await res.json());
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>При загрузке данных произошла ошибка</div>;
  }

  if (!data) {
    return <div>Нет данных</div>;
  }

  return (
    <div>
      <Link to={"/"}>На главную</Link>
      <p>{data.name}</p>
      <img src={data.image} alt="img " />
      <p>{data.status}</p>
      <p>{data.created}</p>
      <p>{data.gender}</p>
      <p>{data.location.name}</p>

      {/*дописать остальное говно*/}
    </div>
  );
};
