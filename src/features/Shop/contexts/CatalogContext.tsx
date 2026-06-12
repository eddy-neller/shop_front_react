import { createContext, ReactNode, useCallback, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { CategoryContextValue } from "@/lib/utils/category-tree";

const CatalogContext = createContext<CategoryContextValue | undefined>(
  undefined
);
CatalogContext.displayName = "CatalogContext";

type CatalogProviderProps = {
  children: ReactNode;
};

export const CatalogProvider = ({ children }: CatalogProviderProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get("cat");

  const setSelectedCategoryId = useCallback(
    (id: string | null) => {
      setSearchParams((params) => {
        const nextParams = new URLSearchParams(params);

        if (id) {
          nextParams.set("cat", id);
        } else {
          nextParams.delete("cat");
        }

        nextParams.delete("page");
        return nextParams;
      });
    },
    [setSearchParams]
  );

  return (
    <CatalogContext.Provider
      value={{ selectedCategoryId, setSelectedCategoryId }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalogContext = (): CategoryContextValue => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalogContext must be used within a CatalogProvider");
  }

  return context;
};
