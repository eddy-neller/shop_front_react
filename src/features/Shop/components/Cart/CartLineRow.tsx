import { Link } from "react-router-dom";
import { PackageSearch, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import QuantityStepper from "@/features/Shop/components/QuantityStepper";
import type { CartLine } from "@/features/Shop/types/cart";
import { formatPrice } from "@/lib/utils/helper";
import { resolveStaticUrl } from "@/lib/utils/url";

interface CartLineRowProps {
  line: CartLine;
  disabled: boolean;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

const CartLineRow = ({
  line,
  disabled,
  onQuantityChange,
  onRemove,
}: CartLineRowProps) => {
  const { t, i18n } = useTranslation("cart");
  const imageUrl = resolveStaticUrl(line.imageUrl ?? undefined);

  return (
    <article className="grid gap-4 rounded-xl border p-4 sm:grid-cols-[96px_1fr_auto] sm:items-center">
      <Link
        to={`/products/${line.productId}`}
        className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-muted"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={line.productTitle}
            className="h-full w-full object-cover"
          />
        ) : (
          <PackageSearch className="h-10 w-10 text-muted-foreground" />
        )}
      </Link>
      <div>
        <Link
          to={`/products/${line.productId}`}
          className="font-semibold hover:text-primary"
        >
          {line.productTitle}
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatPrice(line.unitPrice, i18n.language)}
        </p>
        <QuantityStepper
          value={line.quantity}
          onChange={onQuantityChange}
          disabled={disabled}
          className="mt-3"
        />
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <strong>{formatPrice(line.lineTotal, i18n.language)}</strong>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={disabled}
          onClick={onRemove}
        >
          <Trash2 />
          {t("lines.remove")}
        </Button>
      </div>
    </article>
  );
};

export default CartLineRow;
