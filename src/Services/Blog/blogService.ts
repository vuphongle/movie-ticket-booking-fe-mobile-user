import { HttpService } from "../httpService";
import {
  BlogListParams,
  BlogListResponse,
  BlogDto,
  BlogDetailDto,
  BlogServiceInterface,
} from "@Types/blogTypes";

class BlogService implements BlogServiceInterface {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  /**
   * Get all blogs with pagination
   * @param params - type, page, limit
   */
  async getAllBlogs(params: BlogListParams): Promise<BlogListResponse> {
    const { type, page = 1, limit = 10 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (type && type !== "all") {
      queryParams.append("type", type);
    }

    return this.httpService.get<BlogListResponse>(`/public/blogs?${queryParams.toString()}`, {
      skipAuth: true,
    });
  }

  /**
   * Get latest blogs with pagination
   * @param params - type, page, limit
   */
  async getBlogsLatest(params: BlogListParams): Promise<BlogListResponse> {
    const { type, page = 1, limit = 10 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (type && type !== "all") {
      queryParams.append("type", type);
    }

    return this.httpService.get<BlogListResponse>(
      `/public/blogs/latest?${queryParams.toString()}`,
      { skipAuth: true }
    );
  }

  /**
   * Get most viewed blogs (last 2 months)
   * @param params - type, limit (no page)
   */
  async getMostViewBlogs(params: Omit<BlogListParams, "page">): Promise<BlogDto[]> {
    const { type, limit = 5 } = params;
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
    });

    if (type && type !== "all") {
      queryParams.append("type", type);
    }

    return this.httpService.get<BlogDto[]>(`/public/blogs/most-view?${queryParams.toString()}`, {
      skipAuth: true,
    });
  }

  /**
   * Get blog detail by id and slug
   * @param id - blog id
   * @param slug - blog slug
   */
  async getBlogDetail(id: number, slug: string): Promise<BlogDetailDto> {
    return this.httpService.get<BlogDetailDto>(`/public/blogs/${id}/${slug}`, { skipAuth: true });
  }

  /**
   * Get recommended blogs
   * @param id - blog id
   * @param limit - number of items
   */
  async getRecommendBlogs(id: number, limit: number = 5): Promise<BlogDto[]> {
    return this.httpService.get<BlogDto[]>(`/public/blogs/${id}/recommend?limit=${limit}`, {
      skipAuth: true,
    });
  }
}

export const blogService = new BlogService();
