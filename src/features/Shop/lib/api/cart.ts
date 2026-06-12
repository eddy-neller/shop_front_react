import httpClient from "@/lib/api/httpClient";
import type {
  AddToCartPayload,
  Cart,
  UpdateCartLinePayload,
} from "@/features/Shop/types/cart";

export const getCart = async (): Promise<Cart> => {
  const response = await httpClient.get<Cart>("/shop/me/cart");
  return response.data;
};

export const addToCart = async (payload: AddToCartPayload): Promise<Cart> => {
  const response = await httpClient.post<Cart>("/shop/me/cart/items", payload);
  return response.data;
};

export const updateCartLine = async ({
  productId,
  quantity,
}: UpdateCartLinePayload): Promise<Cart> => {
  const response = await httpClient.patch<Cart>(
    `/shop/me/cart/items/${productId}`,
    { quantity },
    {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    }
  );
  return response.data;
};

export const removeCartLine = async (productId: string): Promise<void> => {
  await httpClient.delete(`/shop/me/cart/items/${productId}`);
};

export const clearCart = async (): Promise<void> => {
  await httpClient.delete("/shop/me/cart");
};
