export type Pagination<T> = {
  list: T[];
  total: number;
  page: number;
  itemsPerPage: number;
};
