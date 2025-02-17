import "./styles.scss";
import { useEffect, useState } from "react";
import { IData } from "./itemDetailed.tsx";
import { ItemCard } from "./itemCard.tsx";
import { useDebounce } from "use-debounce";
import { Pagination } from "./pagination.tsx";

export const App = () => {
  console.log("render");
  const [data, setData] = useState<IData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState<number>(1);

  const [search] = useDebounce(inputValue.length > 3 ? inputValue : "", 800);

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
    <div className="search-container">
      <input
        type="text"
        placeholder="Search characters..."
        className="search-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      {loading && <div>Загрузка...</div>}
      {error && <div>При загрузке данных произошла ошибка</div>}

      {!loading && !error && data && (
        <>
          {data.error ? (
            <div>Ничего не найдено(</div>
          ) : (
            <>
              {data.results.map((item) => (
                <ItemCard key={item.id} {...item} />
              ))}
              {data.info.pages > 1 && (
                <Pagination data={data} page={page} setPage={setPage} />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
