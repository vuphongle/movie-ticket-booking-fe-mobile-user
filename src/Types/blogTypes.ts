export enum BlogType {
  ALL = "all",
  PHIM_CHIEU_RAP = "PHIM_CHIEU_RAP",
  TONG_HOP_PHIM = "TONG_HOP_PHIM",
  PHIM_NEFLIX = "PHIM_NEFLIX",
}

export interface BlogDto {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  publishedAt: number[] | string; // Backend returns array [year, month, day, hour, minute, second, nanosecond]
}

export interface BlogAuthor {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface BlogDetailDto extends BlogDto {
  content: string; // HTML content
  status: boolean;
  viewCount: number;
  type: string;
  createdAt: number[] | string;
  updatedAt: number[] | string;
  user: BlogAuthor;
}

export interface BlogListResponse {
  content: BlogDto[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface BlogListParams {
  type?: string;
  page?: number;
  limit?: number;
}

export interface BlogServiceInterface {
  getAllBlogs: (params: BlogListParams) => Promise<BlogListResponse>;
  getBlogsLatest: (params: BlogListParams) => Promise<BlogListResponse>;
  getMostViewBlogs: (params: Omit<BlogListParams, "page">) => Promise<BlogDto[]>;
  getBlogDetail: (id: number, slug: string) => Promise<BlogDetailDto>;
  getRecommendBlogs: (id: number, limit?: number) => Promise<BlogDto[]>;
}
