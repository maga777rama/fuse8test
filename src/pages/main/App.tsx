import "../../globalStyles.scss";
import { useEffect, useRef, useState } from "react";
import { ItemCard } from "./components/itemCard";
import { useDebounce } from "use-debounce";
import { Pagination } from "./components/pagination";
import styles from "./styles.module.scss";
import { IData } from "../item/itemDetailed";
import { usePaginationStore } from "../../stores/paginationStore.ts";
import { useSearchStore } from "../../stores/searchStore.ts";

export const App = () => {
  console.log("render");

  const { page, setPage } = usePaginationStore();
  const { searchText, setSearchText } = useSearchStore();

  const [data, setData] = useState<IData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const [debouncedSearch] = useDebounce(
    searchText.length > 3 ? searchText : "",
    800,
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (debouncedSearch === "") {
      setData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://rickandmortyapi.com/api/character/?page=${page}&name=${debouncedSearch}`,
        );

        if (!res.ok) {
          throw new Error("Ошибка загрузки данных");
        }

        const json = await res.json();
        setData(json);
      } catch (error) {
        setError(error as Error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch, page]);

  return (
    <main className={styles.mainContainer}>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search characters..."
          className={styles.searchInput}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
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
        <div>
          {data.results.length > 0 ? (
            <>
              <div className={styles.itemsBlock}>
                {data.results.map((item) => (
                  <ItemCard key={item.id} {...item} />
                ))}
              </div>
              {data.info.pages > 1 && (
                <Pagination data={data} page={page} setPage={setPage} />
              )}
            </>
          ) : (
            <div>Ничего не найдено(</div>
          )}
        </div>
      )}
    </main>
  );
};
