import { useState } from "react";

export function useSearch<T>(
  fetchFn: (query: string, page: number) => Promise<T[]>,
) {
  const [results, setResults] = useState<T[]>([]);
  const [query, setQuery] = useState<string>("");
}
