import { waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { renderHookTest } from "@/lib/utils/tests/renderHook";
import {
  useCategory,
  useCategories,
  useProduct,
  useProducts,
  useCatalogData,
} from "@/features/Shop/hooks/useCatalog";
import {
  getCategories,
  getCategory,
  getProduct,
  getProducts,
} from "@/features/Shop/lib/api/catalog";
import rawCategory from "@/features/Shop/__tests__/fixtures/category.json";
import rawCategories from "@/features/Shop/__tests__/fixtures/categories.json";
import rawProduct from "@/features/Shop/__tests__/fixtures/product.json";
import rawProducts from "@/features/Shop/__tests__/fixtures/products.json";
import type {
  PaginatedResult,
  ShopCategory,
  ShopProductDetail,
  ShopProductSummary,
} from "@/features/Shop/types/catalog";

vi.mock("@/features/Shop/lib/api/catalog", () => ({
  getCategories: vi.fn(),
  getCategory: vi.fn(),
  getProducts: vi.fn(),
  getProduct: vi.fn(),
}));

const mockGetCategories = getCategories as Mock;
const mockGetCategory = getCategory as Mock;
const mockGetProduct = getProduct as Mock;
const mockGetProducts = getProducts as Mock;

describe("useCatalog hooks", () => {
  const category = rawCategory as ShopCategory;
  const categories = rawCategories as ShopCategory[];
  const product = rawProduct as ShopProductDetail;
  const products: PaginatedResult<ShopProductSummary> = {
    items: rawProducts as ShopProductSummary[],
    totalItems: 2,
    totalPages: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useCategory", () => {
    it("loads a category by id", async () => {
      mockGetCategory.mockResolvedValueOnce(category);

      const { result } = renderHookTest({
        hook: () => useCategory(category.id),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(category);
      expect(getCategory).toHaveBeenCalledWith(category.id);
    });

    it("does not fetch without an id", () => {
      const { result } = renderHookTest({ hook: () => useCategory(undefined) });

      expect(result.current.fetchStatus).toBe("idle");
      expect(getCategory).not.toHaveBeenCalled();
    });

    it("throws when queryFn is called without an id", async () => {
      const { result } = renderHookTest({ hook: () => useCategory(undefined) });

      const refetchResult = await result.current.refetch();

      expect(refetchResult.isError).toBe(true);
      expect((refetchResult.error as Error).message).toBe("ID not found.");
    });
  });

  describe("useCategories", () => {
    it("loads root categories ordered by title", async () => {
      mockGetCategories.mockResolvedValueOnce(categories);

      const { result } = renderHookTest({ hook: () => useCategories(0) });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(categories);
      expect(getCategories).toHaveBeenCalledWith({
        level: 0,
        itemsPerPage: 100,
        order: { title: "asc" },
      });
    });
  });

  describe("useProduct", () => {
    it("loads a product by id", async () => {
      mockGetProduct.mockResolvedValueOnce(product);

      const { result } = renderHookTest({
        hook: () => useProduct(product.id),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(product);
      expect(getProduct).toHaveBeenCalledWith(product.id);
    });

    it("does not fetch without an id", () => {
      const { result } = renderHookTest({ hook: () => useProduct(undefined) });

      expect(result.current.fetchStatus).toBe("idle");
      expect(getProduct).not.toHaveBeenCalled();
    });

    it("throws when queryFn is called without an id", async () => {
      const { result } = renderHookTest({ hook: () => useProduct(undefined) });

      const refetchResult = await result.current.refetch();

      expect(refetchResult.isError).toBe(true);
      expect((refetchResult.error as Error).message).toBe("ID not found.");
    });
  });

  describe("useProducts", () => {
    it("does not load products without a selected category", () => {
      const { result } = renderHookTest({ hook: () => useProducts(undefined) });

      expect(result.current.fetchStatus).toBe("idle");
      expect(getProducts).not.toHaveBeenCalled();
    });

    it("throws when queryFn is called without a category id", async () => {
      const { result } = renderHookTest({ hook: () => useProducts(undefined) });

      const refetchResult = await result.current.refetch();

      expect(refetchResult.isError).toBe(true);
      expect((refetchResult.error as Error).message).toBe("ID not found.");
    });
  });

  describe("useCatalogData", () => {
    it("loads category and products", async () => {
      mockGetCategory.mockResolvedValueOnce(category);
      mockGetProducts.mockResolvedValueOnce(products);

      const { result } = renderHookTest({
        hook: () => useCatalogData(category.id, 2),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.category.data).toEqual(category);
      expect(result.current.products.data).toEqual(products);
      expect(result.current.isError).toBe(false);
      expect(getCategory).toHaveBeenCalledWith(category.id);
      expect(getProducts).toHaveBeenCalledWith({
        category: category.id,
        page: 2,
        itemsPerPage: 12,
        order: { createdAt: "desc" },
      });
    });
  });
});
