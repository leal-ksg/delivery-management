import { Pagination } from "@/src/domains/types";
import { useState } from "react";

export function useSearch<T>(
  fetchFn: (
    query: string,
    page: number,
    itemsPerPage: number,
  ) => Promise<Pagination<T>>,
) {
  const [results, setResults] = useState<T[]>([]);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const itemsPerPage = 20;

  async function loadMore() {
    if (!hasNextPage) return;

    const paginatedData = await fetchFn(query, page, itemsPerPage);

    if (!paginatedData.list || !paginatedData.list.length)
      setHasNextPage(false);

    setResults((prev) => [...prev, ...paginatedData.list]);
    setPage((prev) => prev + 1);
  }

  function handleChangeQuery(query: string) {
    setQuery(query);
    setPage(1);
    setResults([]);
    setHasNextPage(true);
  }

  return {
    results,
    query,
    handleChangeQuery,
    loadMore,
  };
}
