import { ApiResponse } from "@/lib/api";
import { Pagination } from "@/src/domains/types";
import { useState, useMemo, useEffect, useCallback, ChangeEvent } from "react";
import debounce from "lodash.debounce";

export function useSearch<T>(
  fetchFn: (
    query: string,
    page: number,
    itemsPerPage: number,
  ) => Promise<ApiResponse<Pagination<T>>>,
) {
  const [results, setResults] = useState<T[]>([]);
  const [query, setQuery] = useState<string>("");
  const [displayQuery, setDisplayQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 20;

  const loadMore = useCallback(
    async (currentQuery = query, currentPage = page, isNewSearch = false) => {
      if (!hasNextPage && !isNewSearch) return;

      setIsLoading(true);
      const response = await fetchFn(currentQuery, currentPage, itemsPerPage);
      setIsLoading(false);

      if (!response.ok) return;

      const newList = response.body.list || [];

      if (newList.length < itemsPerPage) {
        setHasNextPage(false);
      } else {
        setHasNextPage(true);
      }

      if (isNewSearch) {
        setResults(newList);
        setPage(2);
      } else {
        setResults((prev) => [...prev, ...newList]);
        setPage((prev) => prev + 1);
      }
    },
    [fetchFn, hasNextPage, page, query],
  );

  const debouncedUpdateQuery = useMemo(
    () =>
      debounce((newQuery: string) => {
        setQuery(newQuery);

        loadMore(newQuery, 1, true);
      }, 500),
    [loadMore],
  );

  function handleChangeQuery(
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) {
    const value = e.target.value;
    setDisplayQuery(value);
    debouncedUpdateQuery(value);
  }

  useEffect(() => {
    return () => {
      debouncedUpdateQuery.cancel();
    };
  }, [debouncedUpdateQuery]);

  return {
    results,
    query: displayQuery,
    handleChangeQuery,
    loadMore: () => loadMore(query, page, false),
    isLoading,
    hasNextPage,
  };
}
