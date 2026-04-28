import { BaseCategory } from "@/lib/utils/category-tree";

export interface ShopCategory extends BaseCategory {
  id: string;
  title: string;
  description: string;
  slug: string;
  nbProduct: number;
  parent?: string | ShopCategory;
  children: ShopCategory[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}
