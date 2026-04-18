export type Pagination<T> = {
  list: T[];
  total: number;
  page: number;
  itemsPerPage: number;
};

export type Option<T> = {
  label: string;
  value: T;
};
