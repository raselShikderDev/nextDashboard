import { useState, useCallback } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination({ initialPage = 1, initialLimit = 10 }: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const goToPage = useCallback((p: number) => setPage(p), []);
  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const changeLimit = useCallback((l: number) => { setLimit(l); setPage(1); }, []);
  const reset = useCallback(() => { setPage(initialPage); setLimit(initialLimit); }, [initialPage, initialLimit]);

  return { page, limit, goToPage, nextPage, prevPage, changeLimit, reset };
}
