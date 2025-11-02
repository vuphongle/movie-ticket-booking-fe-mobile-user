import { useInfiniteQuery } from "@tanstack/react-query";
import { movieService } from "@Services/movie";
import { Movie } from "@Types/movieTypes";

interface UseMovieListParams {
  type?: "nowShowing" | "comingSoon";
  limit?: number;
  enabled?: boolean;
}

export const useMovieList = (params: UseMovieListParams = {}) => {
  const { type = "nowShowing", limit = 10, enabled = true } = params;

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["movies", type, limit],
    queryFn: async ({ pageParam = 1 }) => {
      if (type === "nowShowing") {
        return await movieService.getShowingNowMovies({ page: pageParam, limit });
      } else {
        return await movieService.getComingSoonMovies({ page: pageParam, limit });
      }
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || lastPage.length < limit) return undefined;
      return pages.length + 1;
    },
    initialPageParam: 1,
    enabled,
  });

  const movies: Movie[] = data?.pages.flatMap((page) => page) ?? [];

  return {
    movies,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    isEmpty: movies.length === 0 && !isLoading,
  };
};
