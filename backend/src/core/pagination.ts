export type Pagination<T> = {
  list: T[];
  total: number | bigint;
  page: number;
  itemsPerPage: number;
};
