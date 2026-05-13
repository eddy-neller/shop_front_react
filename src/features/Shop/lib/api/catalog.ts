import httpClient from "@/lib/api/httpClient";
import type {
  CategoryListParams,
  PaginatedResult,
  ProductListParams,
  ShopCategory,
  ShopProductDetail,
  ShopProductSummary,
} from "@/features/Shop/types/shop";

const DEFAULT_TOTAL_PAGES = 1;

function readPaginationHeaders<T>(
  items: T[],
  headers: unknown
): PaginatedResult<T> {
  const normalizedHeaders = headers as Record<string, string | undefined>;
  const totalItems = Number.parseInt(
    normalizedHeaders["x-total-count"] ?? String(items.length),
    10
  );
  const totalPages = Number.parseInt(
    normalizedHeaders["x-total-pages"] ?? String(DEFAULT_TOTAL_PAGES),
    10
  );

  return {
    items,
    totalItems: Number.isNaN(totalItems) ? items.length : totalItems,
    totalPages: Number.isNaN(totalPages) ? DEFAULT_TOTAL_PAGES : totalPages,
  };
}

export const getCategories = async (
  params: CategoryListParams
): Promise<ShopCategory[]> => {
  const response = await httpClient.get<ShopCategory[]>("/shop/categories", {
    params,
  });

  return response.data;
};

export const getCategory = async (id: string): Promise<ShopCategory> => {
  const response = await httpClient.get<ShopCategory>(`/shop/categories/${id}`);

  return response.data;
};

export const getCategoryChildren = async (
  parentId: string
): Promise<ShopCategory[]> => {
  return getCategories({
    parent: parentId,
    itemsPerPage: 100,
    order: { title: "asc" },
  });
};

export const getProducts = async (
  params: ProductListParams
): Promise<PaginatedResult<ShopProductSummary>> => {
  const response = await httpClient.get<ShopProductSummary[]>(
    "/shop/products",
    {
      params,
    }
  );

  return readPaginationHeaders(response.data, response.headers);
};

export const getProduct = async (id: string): Promise<ShopProductDetail> => {
  const response = await httpClient.get<ShopProductDetail>(
    `/shop/products/${id}`
  );

  return response.data;
};
