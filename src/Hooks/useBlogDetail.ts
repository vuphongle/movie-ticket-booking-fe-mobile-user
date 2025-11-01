import { useQuery } from "@tanstack/react-query";
import { blogService } from "@Services/Blog/blogService";
import { BlogDetailDto, BlogDto } from "@Types/blogTypes";

interface UseBlogDetailParams {
  id: number;
  slug: string;
  enabled?: boolean;
}

interface UseBlogDetailReturn {
  blog: BlogDetailDto | undefined;
  recommendBlogs: BlogDto[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isLoadingRecommend: boolean;
  refetch: () => void;
}

export const useBlogDetail = ({
  id,
  slug,
  enabled = true,
}: UseBlogDetailParams): UseBlogDetailReturn => {
  // Fetch blog detail
  const {
    data: blog,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<BlogDetailDto, Error>({
    queryKey: ["blog-detail", id, slug],
    queryFn: () => blogService.getBlogDetail(id, slug),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  // Fetch recommend blogs
  const { data: recommendBlogs = [], isLoading: isLoadingRecommend } = useQuery<BlogDto[], Error>({
    queryKey: ["blog-recommend", id],
    queryFn: () => blogService.getRecommendBlogs(id, 5),
    enabled: enabled && !!blog, // Only fetch when blog detail is loaded
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    blog,
    recommendBlogs,
    isLoading,
    isError,
    error,
    isLoadingRecommend,
    refetch,
  };
};
