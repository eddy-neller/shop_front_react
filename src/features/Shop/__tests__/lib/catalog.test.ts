import { Mock, vi } from "vitest";
import httpClient from "@/lib/api/httpClient";
import {
  getCategories,
  getCategory,
  getCategoryChildren,
  getProduct,
  getProducts,
} from "@/features/Shop/lib/api/catalog";
import rawCategories from "@/features/Shop/__tests__/fixtures/categories.json";
import rawCategory from "@/features/Shop/__tests__/fixtures/category.json";
import rawProducts from "@/features/Shop/__tests__/fixtures/products.json";
import rawProduct from "@/features/Shop/__tests__/fixtures/product.json";
import { makeAxiosResponse } from "@/lib/utils/tests/axiosHelper";
import type {
  ShopCategory,
  ShopProductDetail,
  ShopProductSummary,
} from "@/features/Shop/types/shop";

vi.mock("@/lib/api/httpClient", () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockGet = httpClient.get as Mock;

describe("shop catalog api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads categories with query params and normalizes missing children", async () => {
    const categories = rawCategories as ShopCategory[];
    mockGet.mockResolvedValueOnce(makeAxiosResponse(categories));

    const result = await getCategories({
      level: 0,
      order: { title: "asc" },
    });

    expect(httpClient.get).toHaveBeenCalledWith("/shop/categories", {
      params: {
        level: 0,
        order: { title: "asc" },
      },
    });
    expect(result[0].children).toHaveLength(categories[0].children.length);
    expect(result[0].children[0].hasChildren).toBe(false);
    expect(result[0].hasChildren).toBe(true);
  });

  it("loads one category by id", async () => {
    const category = rawCategory as ShopCategory;
    mockGet.mockResolvedValueOnce(makeAxiosResponse(category));

    const result = await getCategory(category.id);

    expect(httpClient.get).toHaveBeenCalledWith(
      `/shop/categories/${category.id}`
    );
    expect(result.id).toBe(category.id);
  });

  it("loads direct category children with parent filter", async () => {
    const categories = rawCategories as ShopCategory[];
    const parentId = categories[0].id;
    mockGet.mockResolvedValueOnce(makeAxiosResponse(categories));

    const result = await getCategoryChildren(parentId);

    expect(httpClient.get).toHaveBeenCalledWith("/shop/categories", {
      params: {
        parent: parentId,
        itemsPerPage: 100,
        order: { title: "asc" },
      },
    });
    expect(result).toEqual(categories);
  });

  it("loads products and reads pagination headers", async () => {
    const products = rawProducts as ShopProductSummary[];
    mockGet.mockResolvedValueOnce(
      makeAxiosResponse(products, 200, "OK", {
        "x-total-count": "24",
        "x-total-pages": "2",
      })
    );

    const result = await getProducts({
      category: "category-1",
      page: 2,
      itemsPerPage: 12,
      order: { createdAt: "desc" },
    });

    expect(httpClient.get).toHaveBeenCalledWith("/shop/products", {
      params: {
        category: "category-1",
        page: 2,
        itemsPerPage: 12,
        order: { createdAt: "desc" },
      },
    });
    expect(result).toEqual({
      items: products,
      totalItems: 24,
      totalPages: 2,
    });
  });

  it("loads one product by id", async () => {
    const product = rawProduct as ShopProductDetail;
    mockGet.mockResolvedValueOnce(makeAxiosResponse(product));

    const result = await getProduct(product.id);

    expect(httpClient.get).toHaveBeenCalledWith(`/shop/products/${product.id}`);
    expect(result).toEqual(product);
  });
});
