import { ConfigProvider } from "antd";
import { Pagination as AntPagination } from "antd";
import { IData } from "../../item/itemDetailed.tsx";
import styles from "../styles.module.scss";
export interface IPagination {
  data: IData;
  page: number;
  setPage: (page: number) => void;
}

export const Pagination = ({ data, page, setPage }: IPagination) => {
  return (
    <nav aria-label="pagination" className={styles.pagination}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "rgb(39, 43, 51)",
            borderRadius: 2,
          },
        }}
      >
        <AntPagination
          current={page}
          defaultPageSize={20}
          total={data.info.count}
          showSizeChanger={false}
          onChange={(newPage) => {
            setPage(newPage);
          }}
        />
      </ConfigProvider>
    </nav>
  );
};
