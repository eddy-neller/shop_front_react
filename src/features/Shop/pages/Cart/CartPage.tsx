import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import CartLineRow from "@/features/Shop/components/Cart/CartLineRow";
import { useCartContext } from "@/features/Shop/contexts/CartContext";
import { formatPrice } from "@/lib/utils/helper";

const CartPage = () => {
  const { t, i18n } = useTranslation("cart");
  const { setBreadcrumbItems } = useBreadcrumb();
  const { cart, isPending, isMutating, updateLine, removeLine, clearCart } =
    useCartContext();

  useEffect(() => {
    setBreadcrumbItems([{ key: "cart", title: t("title"), active: true }]);
  }, [setBreadcrumbItems, t]);

  if (isPending) {
    return <Spinner loading />;
  }

  return (
    <>
      <Helmet>
        <title>{t("helmet.title")}</title>
      </Helmet>

      <div className="container mx-auto min-h-screen px-4 pb-12">
        <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>
        {!cart || cart.items.length === 0 ? (
          <div className="rounded-xl border bg-muted/30 p-10 text-center">
            <p className="mb-5 text-muted-foreground">{t("empty")}</p>
            <Button asChild>
              <Link to="/products">{t("continueShopping")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {cart.items.map((line) => (
                <CartLineRow
                  key={line.id}
                  line={line}
                  disabled={isMutating}
                  onQuantityChange={(quantity) =>
                    void updateLine({ productId: line.productId, quantity })
                  }
                  onRemove={() => void removeLine(line.productId)}
                />
              ))}
            </div>
            <aside className="h-fit rounded-xl border p-6">
              <div className="flex items-center justify-between text-lg">
                <span>{t("total")}</span>
                <strong>{formatPrice(cart.subtotal, i18n.language)}</strong>
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-6 w-full"
                disabled={isMutating}
                onClick={() => void clearCart()}
              >
                {t("clear")}
              </Button>
            </aside>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
