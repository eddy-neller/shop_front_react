import { ShopCategory } from "@/features/Shop/types/catalog";

export type CategoryContextValue = {
  setSelectedCategoryId: (id: string | null) => void;
  selectedCategoryId: string | null;
};

export interface BaseCategory {
  id: string;
  title: string;
  hasChildren: boolean;
  children?: BaseCategory[];
}

export type CategoryTree = ShopCategory;

export const extractData = (category: CategoryTree) => ({
  id: category.id,
  title: category.title,
  hasChildren: category.hasChildren,
  count: category.nbProduct ?? 0,
});
