import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCartContext } from "@/features/Shop/contexts/CartContext";

const CartBadge = () => {
  const { itemCount } = useCartContext();
  const { t } = useTranslation("cart");

  return (
    <Link
      to="/cart"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-accent hover:text-blue-600"
      aria-label={t("badge", { count: itemCount })}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-blue-600 px-1 text-center text-xs font-semibold leading-5 text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartBadge;
