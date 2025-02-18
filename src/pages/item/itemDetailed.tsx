import { useEffect, useState } from "react";

import styles from "./styles.module.scss";
import { useParams } from "react-router"; // Импорт SCSS-модуля

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
  const [episodes, setEpisodes] = useState<{ name: string }[] | null>(null);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState<boolean>(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const res = await fetch(
          `https://rickandmortyapi.com/api/character/${id}`,
        );
        if (!res.ok) {
          throw new Error(`Ошибка загрузки персонажа: ${res.status}`);
        }
        const character: ItemProps = await res.json();
        setData(character);

        if (character.episode.length > 0) {
          fetchEpisodes(character.episode);
        } else {
          setIsLoadingEpisodes(false);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    const fetchEpisodes = async (episodesUrls: string[]) => {
      try {
        const episodeIds = episodesUrls
          .map((url) => url.split("/").pop())
          .join(",");
        const res = await fetch(
          `https://rickandmortyapi.com/api/episode/${episodeIds}`,
        );
        if (!res.ok) {
          throw new Error("Ошибка загрузки эпизодов");
        }
        const data = await res.json();
        setEpisodes(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingEpisodes(false);
      }
    };

    fetchCharacter();
  }, [id]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error.message}</div>;
  }

  if (!data) {
    return <div>Нет данных</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{data.name}</h1>
      <div className={styles.content}>
        <img
          src={data.image}
          alt={`image_${data.name}`}
          className={styles.image}
        />
        <div className={styles.info}>
          <p>
            <span className={styles.label}>Статус:</span> {data.status}
          </p>
          <p>
            <span className={styles.label}>Вид:</span> {data.species}
          </p>
          {data.type && (
            <p>
              <span className={styles.label}>Тип:</span> {data.type}
            </p>
          )}
          <p>
            <span className={styles.label}>Пол:</span> {data.gender}
          </p>
          <p>
            <span className={styles.label}>Происхождение:</span>{" "}
            {data.origin.name}
          </p>
          <p>
            <span className={styles.label}>Локация:</span> {data.location.name}
          </p>
        </div>
      </div>
      <div className={styles.episodes}>
        <h2 className={styles.episodesTitle}>Эпизоды:</h2>
        {isLoadingEpisodes ? (
          <p className="text-gray-400">Загрузка эпизодов...</p>
        ) : episodes && episodes.length > 0 ? (
          <ul className={styles.episodeList}>
            {episodes.map((ep, index) => (
              <li key={index}>{ep.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Нет эпизодов</p>
        )}
      </div>
    </div>
  );
};
