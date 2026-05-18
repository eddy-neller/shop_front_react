import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import Spinner from "@/components/Spinner";
import CategoryCard from "@/features/Shop/components/Catalog/CategoryCard";
import Products from "@/features/Shop/components/Catalog/Products";
import { useCatalogData } from "@/features/Shop/hooks/useCatalog";
import ErrorLoadingCard from "@/components/ErrorLoadingCard";

interface CatalogCardProps {
  selectedCategoryId: string;
}

export default function CatalogCard({ selectedCategoryId }: CatalogCardProps) {
  const { t } = useTranslation("catalog");
  const [searchParams, setSearchParams] = useSearchParams();
  const parsedPage = Number(searchParams.get("page"));
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const { category, products, isPending, isError } = useCatalogData(
    selectedCategoryId,
    page
  );

  const handlePageChange = (nextPage: number) => {
    setSearchParams((params) => {
      const nextParams = new URLSearchParams(params);

      if (nextPage <= 1) {
        nextParams.delete("page");
      } else {
        nextParams.set("page", String(nextPage));
      }

      return nextParams;
    });
  };

  if (isPending) return <Spinner loading={isPending} />;
  if (isError || !category.data || !products.data) {
    return <ErrorLoadingCard message={t("errors.loadData")} />;
  }

  return (
    <div className="space-y-6">
      <CategoryCard category={category.data} />
      <Products
        products={products.data.items}
        page={page}
        totalPages={products.data.totalPages}
        totalItems={products.data.totalItems}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
