import "../../globalStyles.scss";
import { useEffect, useRef, useState } from "react";

import { ItemCard } from "./components/itemCard.tsx";
import { useDebounce } from "use-debounce";
import { Pagination } from "./components/pagination.tsx";
import styles from "./styles.module.scss";
import { IData } from "../item/itemDetailed.tsx";

export const App = () => {
  console.log("render");
  const [data, setData] = useState<IData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState<number>(1);

  const [search] = useDebounce(inputValue.length > 3 ? inputValue : "", 800);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (search === "") {
      setData(null);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://rickandmortyapi.com/api/character/?page=${page}&name=${search}`,
        );
        setData(await res.json());
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, page]);

  console.log(inputValue);
  console.log(data);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search characters..."
          className={styles.searchInput}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {!loading && !error && data && (
          <p className={styles.numOfCharacters}>
            Found characters: {data.info.count}
          </p>
        )}
      </div>

      {loading && <div>Загрузка...</div>}
      {error && <div>При загрузке данных произошла ошибка</div>}

      {!loading && !error && data && (
        <>
          {data.error ? (
            <div>Ничего не найдено(</div>
          ) : (
            <div>
              <div className={styles.itemsBlock}>
                {data.results.map((item) => (
                  <ItemCard key={item.id} {...item} />
                ))}
              </div>
              {data.info.pages > 1 && (
                <Pagination data={data} page={page} setPage={setPage} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
