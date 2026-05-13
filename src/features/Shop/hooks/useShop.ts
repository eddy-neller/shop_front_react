import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCategory,
  getProduct,
  getProducts,
} from "@/features/Shop/lib/api/catalog";
import type {
  PaginatedResult,
  ShopCategory,
  ShopProductDetail,
  ShopProductSummary,
} from "@/features/Shop/types/shop";
import { shopKeys } from "@/lib/utils/queryKeys";

const DEFAULT_PRODUCTS_PER_PAGE = 12;
const DEFAULT_CATEGORIES_PER_PAGE = 100;

export const useCategory = (id: string | undefined) => {
  return useQuery<ShopCategory>({
    queryKey: shopKeys.category(id),
    queryFn: () => {
      if (!id) {
        throw new Error("ID not found.");
      }

      return getCategory(id);
    },
    enabled: !!id,
  });
};

export const useCategories = (level: number) => {
  const params = {
    level,
    itemsPerPage: DEFAULT_CATEGORIES_PER_PAGE,
    order: { title: "asc" as const },
  };

  return useQuery<ShopCategory[]>({
    queryKey: shopKeys.categories(params),
    queryFn: () => getCategories(params),
  });
};

export const useProducts = (
  categoryId: string | undefined,
  page: number = 1
) => {
  const params = {
    category: categoryId,
    page,
    itemsPerPage: DEFAULT_PRODUCTS_PER_PAGE,
    order: { createdAt: "desc" as const },
  };

  return useQuery<PaginatedResult<ShopProductSummary>>({
    queryKey: shopKeys.products(params),
    queryFn: () => {
      if (!categoryId) {
        throw new Error("ID not found.");
      }

      return getProducts(params);
    },
    enabled: !!categoryId,
  });
};

export const useProduct = (id: string | undefined) => {
  return useQuery<ShopProductDetail>({
    queryKey: shopKeys.product(id),
    queryFn: () => {
      if (!id) {
        throw new Error("ID not found.");
      }

      return getProduct(id);
    },
    enabled: !!id,
  });
};

export const useShopData = (
  categoryId: string | undefined,
  page: number = 1
) => {
  const category = useCategory(categoryId);
  const products = useProducts(categoryId, page);

  return {
    category,
    products,
    isPending: category.isPending || products.isPending,
    isError: category.isError || products.isError,
    error: category.error || products.error,
  };
};
