import CategoryMenu from "@/components/CategoryMenu";
import ErrorLoadingCard from "@/components/ErrorLoadingCard";
import Spinner from "@/components/Spinner";
import { useCatalog } from "@/features/Shop/contexts/CatalogContext";
import { useCategories } from "@/features/Shop/hooks/useCatalog";
import { getCategoryChildren } from "@/features/Shop/lib/api/catalog";
import { useTranslation } from "react-i18next";

const CatalogMenu = () => {
  const { t } = useTranslation("catalog");
  const { data: categories, isPending, isError } = useCategories(0);

  if (isPending) return <Spinner loading={isPending} fullscreen />;
  if (isError || !categories) {
    return <ErrorLoadingCard message={t("errors.loadCategories")} />;
  }

  return (
    <CategoryMenu
      rawCategories={categories}
      getCategoryChildren={getCategoryChildren}
      context={useCatalog}
    />
  );
};

export default CatalogMenu;
