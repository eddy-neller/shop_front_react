import { BaseCategory } from "@/lib/utils/category-tree";

export interface ShopCategory extends BaseCategory {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  nbProduct: number;
  level?: number;
  parent?: string | ShopCategory;
  children?: ShopCategory[];
}

export interface ShopProductSummary {
  id: string;
  title: string;
  price: number;
  slug: string;
  imageUrl?: string | null;
  createdAt: string;
}

export interface ShopProductDetail extends ShopProductSummary {
  subtitle: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CategoryListParams {
  level?: number;
  parent?: string;
  root?: boolean;
  page?: number;
  itemsPerPage?: number;
  order?: {
    title?: "asc" | "desc";
    level?: "asc" | "desc";
    nbProduct?: "asc" | "desc";
    createdAt?: "asc" | "desc";
  };
}

export interface ProductListParams {
  category?: string;
  page?: number;
  itemsPerPage?: number;
  order?: {
    title?: "asc" | "desc";
    price?: "asc" | "desc";
    createdAt?: "asc" | "desc";
    "category.title"?: "asc" | "desc";
  };
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
}
