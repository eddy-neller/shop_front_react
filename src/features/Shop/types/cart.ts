export interface Cart {
  id: string | null;
  items: CartLine[];
  totalQuantity: number;
  subtotal: number;
  currency: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CartLine {
  id: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  imageUrl?: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface UpdateCartLinePayload {
  productId: string;
  quantity: number;
}
