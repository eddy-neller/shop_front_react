export type CategoryContextType = {
  setSelectedCategoryId: (id: string | null) => void;
  selectedCategoryId: string | null;
};

export interface BaseCategory {
  id: string;
  title: string;
  children: BaseCategory[];
  count?: number;
  nbImage?: number;
  nbSong?: number;
}

export type CategoryTree = BaseCategory;

export const extractData = (category: CategoryTree) => ({
  id: category.id,
  title: category.title,
  children: category.children,
  count: category.count ?? category.nbImage ?? category.nbSong ?? 0,
});
