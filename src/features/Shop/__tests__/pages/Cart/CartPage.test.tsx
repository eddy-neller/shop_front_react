import "@/lib/utils/tests/mocks/mockAuthHelper";
import { screen } from "@testing-library/react";
import { useCartContext } from "@/features/Shop/contexts/CartContext";
import type { Cart } from "@/features/Shop/types/cart";
import { renderPage } from "@/lib/utils/tests/renderPage";

vi.mock("@/features/Shop/contexts/CartContext", () => ({
  CartProvider: ({ children }: { children: React.ReactNode }) => children,
  useCartContext: vi.fn(),
}));

const mockUseCartContext = vi.mocked(useCartContext);

const cart: Cart = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  items: [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      productId: "550e8400-e29b-41d4-a716-446655440002",
      productTitle: "Mechanical Keyboard",
      productSlug: "mechanical-keyboard",
      imageUrl: null,
      unitPrice: 129.99,
      quantity: 2,
      lineTotal: 259.98,
    },
  ],
  totalQuantity: 2,
  subtotal: 259.98,
  currency: "EUR",
  createdAt: "2026-06-08T12:00:00+00:00",
  updatedAt: "2026-06-08T12:00:00+00:00",
};

describe("CartPage", () => {
  it("renders the empty state", async () => {
    mockUseCartContext.mockReturnValue({
      isAuthenticated: true,
      cart: { ...cart, items: [], totalQuantity: 0, subtotal: 0 },
      isPending: false,
      itemCount: 0,
      isMutating: false,
      addToCart: vi.fn(),
      updateLine: vi.fn(),
      removeLine: vi.fn(),
      clearCart: vi.fn(),
    });

    renderPage("/cart");

    expect(await screen.findByText("Your cart is empty.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Continue shopping" })
    ).toHaveAttribute("href", "/products");
  });

  it("renders cart lines and subtotal", async () => {
    mockUseCartContext.mockReturnValue({
      isAuthenticated: true,
      cart,
      isPending: false,
      itemCount: 2,
      isMutating: false,
      addToCart: vi.fn(),
      updateLine: vi.fn(),
      removeLine: vi.fn(),
      clearCart: vi.fn(),
    });

    renderPage("/cart");

    expect(await screen.findByText("Mechanical Keyboard")).toBeInTheDocument();
    expect(screen.getAllByText("€259.98")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "Clear cart" })
    ).toBeInTheDocument();
  });
});
