import { createContext, ReactNode, useCallback, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { CategoryContextType } from "@/lib/utils/category-tree";

const ShopContext = createContext<CategoryContextType | undefined>(undefined);
ShopContext.displayName = "ShopContext";

export const useShop = (): CategoryContextType => {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }

  return context;
};

type ShopProviderProps = {
  children: ReactNode;
};

export const ShopProvider = ({ children }: ShopProviderProps) => {
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
    <ShopContext.Provider value={{ selectedCategoryId, setSelectedCategoryId }}>
      {children}
    </ShopContext.Provider>
  );
};
