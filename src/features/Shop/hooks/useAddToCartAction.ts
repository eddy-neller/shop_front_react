import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useCartContext } from "@/features/Shop/contexts/CartContext";

export const useAddToCartAction = () => {
  const { t } = useTranslation("catalog");
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, isAuthenticated, isMutating } = useCartContext();

  const handleAddToCart = (productId: string, quantity = 1) => {
    if (!isAuthenticated) {
      toast.info(t("products.loginRequired"));
      navigate("/login", {
        state: { from: `${location.pathname}${location.search}` },
      });
      return;
    }

    void addToCart({ productId, quantity });
  };

  return { handleAddToCart, isAuthenticated, isMutating };
};
