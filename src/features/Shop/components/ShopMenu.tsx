import CategoryMenu from "@/components/CategoryMenu";
import ErrorLoadingCard from "@/components/ErrorLoadingCard";
import Spinner from "@/components/Spinner";
import { useShop } from "@/features/Shop/contexts/ShopContext";
import { useCategories } from "@/features/Shop/hooks/useShop";
import { getCategoryChildren } from "@/features/Shop/lib/api/catalog";
import { useTranslation } from "react-i18next";

const ShopMenu = () => {
  const { t } = useTranslation("shop");
  const { data: categories, isPending, isError } = useCategories(0);

  if (isPending) return <Spinner loading={isPending} fullscreen />;
  if (isError || !categories) {
    return <ErrorLoadingCard message={t("errors.loadCategories")} />;
  }

  return (
    <CategoryMenu
      rawCategories={categories}
      getCategoryChildren={getCategoryChildren}
      context={useShop}
    />
  );
};

export default ShopMenu;
