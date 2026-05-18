import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useCatalog } from "@/features/Shop/contexts/CatalogContext";
import CatalogCard from "@/features/Shop/components/Catalog/CatalogCard";

const CatalogHomePage = () => {
  const { selectedCategoryId } = useCatalog();
  const { setBreadcrumbItems } = useBreadcrumb();
  const { t } = useTranslation("catalog");

  useEffect(() => {
    setBreadcrumbItems([{ key: "products", title: t("title"), active: true }]);
  }, [setBreadcrumbItems, t]);

  if (!selectedCategoryId) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
          <p className="mt-3 text-gray-600">{t("page.selectCategory")}</p>
        </div>
      </div>
    );
  }

  return <CatalogCard selectedCategoryId={selectedCategoryId} />;
};

export default CatalogHomePage;
