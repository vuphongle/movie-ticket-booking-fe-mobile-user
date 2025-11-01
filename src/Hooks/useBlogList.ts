import { useInfiniteQuery } from "@tanstack/react-query";
import { blogService } from "@Services/Blog";
import { BlogListParams, BlogDto } from "@Types/blogTypes";

interface UseBlogListParams {
  type?: string;
  limit?: number;
  enabled?: boolean;
}

export const useBlogList = (params: UseBlogListParams = {}) => {
  const { type = "all", limit = 10, enabled = true } = params;

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
    queryKey: ["blogs", type, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const requestParams: BlogListParams = {
        type,
        page: pageParam,
        limit,
      };
      return await blogService.getBlogsLatest(requestParams);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.last) {
        return undefined;
      }
      return lastPage.number + 2; // Backend uses 1-based indexing
    },
    initialPageParam: 1,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Flatten all pages into single array
  const blogs: BlogDto[] = data?.pages.flatMap((page) => page.content) ?? [];

  return {
    blogs,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    totalElements: data?.pages[0]?.totalElements ?? 0,
    isEmpty: blogs.length === 0 && !isLoading,
  };
};
