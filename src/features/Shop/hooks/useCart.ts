import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartLine,
  updateCartLine,
} from "@/features/Shop/lib/api/cart";
import type {
  AddToCartPayload,
  Cart,
  UpdateCartLinePayload,
} from "@/features/Shop/types/cart";
import type { AuthUser } from "@/features/User/types/user";
import { handleAxiosError } from "@/lib/utils/axiosErrorHandler";
import { cartKeys } from "@/lib/utils/queryKeys";

const useUserId = () => useAuthUser<AuthUser | null>()?.id;
const useCartKey = () => cartKeys.mine(useUserId());

export const useCart = () => {
  const userId = useUserId();

  return useQuery<Cart>({
    queryKey: useCartKey(),
    queryFn: getCart,
    enabled: !!userId,
    staleTime: 0,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const cartKey = useCartKey();
  const { t } = useTranslation("cart");

  return useMutation({
    mutationFn: (payload: AddToCartPayload) => addToCart(payload),
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKey, cart);
      toast.success(t("toast.added"));
    },
    onError: (error) =>
      handleAxiosError(error, undefined, true, t("toast.error")),
  });
};

export const useUpdateCartLine = () => {
  const queryClient = useQueryClient();
  const cartKey = useCartKey();
  const { t } = useTranslation("cart");

  return useMutation({
    mutationFn: (payload: UpdateCartLinePayload) => updateCartLine(payload),
    onSuccess: (cart) => queryClient.setQueryData(cartKey, cart),
    onError: (error) =>
      handleAxiosError(error, undefined, true, t("toast.error")),
  });
};

export const useRemoveCartLine = () => {
  const queryClient = useQueryClient();
  const cartKey = useCartKey();
  const { t } = useTranslation("cart");

  return useMutation({
    mutationFn: (productId: string) => removeCartLine(productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartKey });
      toast.success(t("toast.removed"));
    },
    onError: (error) =>
      handleAxiosError(error, undefined, true, t("toast.error")),
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const cartKey = useCartKey();
  const { t } = useTranslation("cart");

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartKey });
      toast.success(t("toast.cleared"));
    },
    onError: (error) =>
      handleAxiosError(error, undefined, true, t("toast.error")),
  });
};
