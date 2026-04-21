import { ReactNode, createContext, useContext, useState } from "react";
import { LinkProps } from "react-router-dom";

interface BreadcrumbItemType {
  key: string;
  linkAs?: React.ElementType;
  linkProps?: LinkProps;
  active?: boolean;
  title: string;
}

interface BreadcrumbContextType {
  breadcrumbItems: BreadcrumbItemType[];
  setBreadcrumbItems: (items: BreadcrumbItemType[]) => void;
}

export const BreadcrumbContext = createContext<
  BreadcrumbContextType | undefined
>(undefined);
BreadcrumbContext.displayName = "BreadcrumbContext";

export const useBreadcrumb = () => {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx)
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  return ctx;
};

type BreadcrumbProviderProps = { children: ReactNode };

export const BreadcrumbProvider: React.FC<BreadcrumbProviderProps> = ({
  children,
}) => {
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItemType[]>(
    []
  );

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbItems, setBreadcrumbItems }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
