import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/helper";
import { resolveStaticUrl } from "@/lib/utils/url";
import type { ShopProductSummary } from "@/features/Shop/types/catalog";
import { useAddToCartAction } from "@/features/Shop/hooks/useAddToCartAction";

interface ProductCardProps {
  product: ShopProductSummary;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t, i18n } = useTranslation("catalog");

  const imageUrl = resolveStaticUrl(product.imageUrl ?? undefined);
  const formattedPrice = formatPrice(product.price, i18n.language);

  const { handleAddToCart, isMutating } = useAddToCartAction();

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <Link
        to={`/products/${product.id}`}
        className="flex aspect-[4/3] items-center justify-center bg-muted"
        aria-label={t("products.view", { title: product.title })}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <PackageSearch
            className="h-16 w-16 text-muted-foreground"
            aria-hidden="true"
          />
        )}
      </Link>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg leading-tight">{product.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p className="text-xl font-bold text-primary">{formattedPrice}</p>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          type="button"
          className="w-full"
          disabled={isMutating}
          onClick={() => handleAddToCart(product.id)}
        >
          {t("products.addToCart")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
