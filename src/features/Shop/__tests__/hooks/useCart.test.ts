import "@/lib/utils/tests/mocks/mockAuthHelper";
import { waitFor } from "@testing-library/react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {
  useAddToCart,
  useCart,
  useClearCart,
  useRemoveCartLine,
  useUpdateCartLine,
} from "@/features/Shop/hooks/useCart";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartLine,
  updateCartLine,
} from "@/features/Shop/lib/api/cart";
import type { Cart } from "@/features/Shop/types/cart";
import { renderHookTest } from "@/lib/utils/tests/renderHook";

vi.mock("@/features/Shop/lib/api/cart", () => ({
  getCart: vi.fn(),
  addToCart: vi.fn(),
  updateCartLine: vi.fn(),
  removeCartLine: vi.fn(),
  clearCart: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const cart: Cart = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  items: [],
  totalQuantity: 0,
  subtotal: 0,
  currency: "EUR",
  createdAt: "2026-06-08T12:00:00+00:00",
  updatedAt: "2026-06-08T12:00:00+00:00",
};

const authUser = { id: "user-1", roles: [] };
const cartKey = ["shop", "cart", "mine", authUser.id];

describe("cart hooks", () => {
  beforeEach(() => {
    vi.mocked(useAuthUser).mockReturnValue(authUser);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads the authenticated customer cart", async () => {
    vi.mocked(getCart).mockResolvedValue(cart);
    const { result } = renderHookTest({ hook: useCart });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(cart);
  });

  it("does not load a cart for a visitor", () => {
    vi.mocked(useAuthUser).mockReturnValue(null);
    const { result } = renderHookTest({ hook: useCart });

    expect(result.current.fetchStatus).toBe("idle");
    expect(getCart).not.toHaveBeenCalled();
  });

  it("adds a product and updates the cart cache", async () => {
    vi.mocked(addToCart).mockResolvedValue(cart);
    const { result, queryClient } = renderHookTest({ hook: useAddToCart });
    const setQueryData = vi.spyOn(queryClient, "setQueryData");

    result.current.mutate({ productId: "product-id", quantity: 1 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(setQueryData).toHaveBeenCalledWith(
      cartKey,
      cart
    );
  });

  it("updates a line and updates the cart cache", async () => {
    vi.mocked(updateCartLine).mockResolvedValue(cart);
    const { result, queryClient } = renderHookTest({
      hook: useUpdateCartLine,
    });
    const setQueryData = vi.spyOn(queryClient, "setQueryData");

    result.current.mutate({ productId: "product-id", quantity: 2 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(setQueryData).toHaveBeenCalledWith(
      cartKey,
      cart
    );
  });

  it("invalidates the cart after removing a line", async () => {
    vi.mocked(removeCartLine).mockResolvedValue();
    const { result, queryClient } = renderHookTest({
      hook: useRemoveCartLine,
    });
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

    result.current.mutate("product-id");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: cartKey,
    });
  });

  it("invalidates the cart after clearing it", async () => {
    vi.mocked(clearCart).mockResolvedValue();
    const { result, queryClient } = renderHookTest({ hook: useClearCart });
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: cartKey,
    });
  });
});
