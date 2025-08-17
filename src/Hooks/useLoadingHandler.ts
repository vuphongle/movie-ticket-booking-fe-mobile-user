import { useContext, useRef, useCallback } from "react";
import { LoadingContext } from "@Contexts/LoadingContext";

/**
 * Custom hook to safely handle global loading state with async calls.
 * It uses a counter to avoid race conditions when multiple async calls are made.
 */
export function useLoadingHandler() {
  const { isLoading, setLoading } = useContext(LoadingContext);
  const loadingCount = useRef(0);

  const startLoading = useCallback(() => {
    loadingCount.current += 1;
    setLoading(true);
  }, [setLoading]);

  const stopLoading = useCallback(() => {
    loadingCount.current = Math.max(loadingCount.current - 1, 0);
    if (loadingCount.current === 0) {
      setLoading(false);
    }
  }, [setLoading]);

  /**
   * Wrap an async function to automatically handle loading state.
   */
  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      startLoading();
      try {
        return await fn();
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return { isLoading, startLoading, stopLoading, withLoading };
}
