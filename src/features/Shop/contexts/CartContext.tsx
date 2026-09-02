import { createContext, useContext, useMemo, type ReactNode } from "react";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import {
  useAddToCart,
  useCart,
  useClearCart,
  useRemoveCartLine,
  useUpdateCartLine,
} from "@/features/Shop/hooks/useCart";
import type {
  AddToCartPayload,
  Cart,
  UpdateCartLinePayload,
} from "@/features/Shop/types/cart";

interface CartContextValue {
  isAuthenticated: boolean;
  cart: Cart | undefined;
  isPending: boolean;
  itemCount: number;
  isMutating: boolean;
  addToCart: (payload: AddToCartPayload) => Promise<Cart>;
  updateLine: (payload: UpdateCartLinePayload) => Promise<Cart>;
  removeLine: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useIsAuthenticated();
  const cartQuery = useCart();
  const addMutation = useAddToCart();
  const updateMutation = useUpdateCartLine();
  const removeMutation = useRemoveCartLine();
  const clearMutation = useClearCart();

  const value: CartContextValue = useMemo(
    () => ({
      isAuthenticated,
      cart: isAuthenticated ? cartQuery.data : undefined,
      isPending: isAuthenticated && cartQuery.isPending,
      itemCount: isAuthenticated ? (cartQuery.data?.totalQuantity ?? 0) : 0,
      isMutating:
        addMutation.isPending ||
        updateMutation.isPending ||
        removeMutation.isPending ||
        clearMutation.isPending,
      addToCart: addMutation.mutateAsync,
      updateLine: updateMutation.mutateAsync,
      removeLine: removeMutation.mutateAsync,
      clearCart: clearMutation.mutateAsync,
    }),
    [
      isAuthenticated,
      cartQuery.data,
      cartQuery.isPending,
      addMutation.isPending,
      updateMutation.isPending,
      removeMutation.isPending,
      clearMutation.isPending,
      addMutation.mutateAsync,
      updateMutation.mutateAsync,
      removeMutation.mutateAsync,
      clearMutation.mutateAsync,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within CartProvider.");
  }

  return context;
};
