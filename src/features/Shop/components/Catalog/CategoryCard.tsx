import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ShopCategory } from "@/features/Shop/types/catalog";

interface CategoryCardProps {
  category: ShopCategory;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const { t } = useTranslation("catalog");

  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-2xl">{category.title}</CardTitle>
          </div>
          <Badge variant="default" className="rounded-full">
            {t("category.productCount", { count: category.nbProduct })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {category.description && (
          <CardDescription className="mt-2">
            {category.description}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
