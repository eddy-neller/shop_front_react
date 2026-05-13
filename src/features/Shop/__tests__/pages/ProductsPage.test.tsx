import { screen, waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { renderPage } from "@/lib/utils/tests/renderPage";
import { useShop } from "@/features/Shop/contexts/ShopContext";

vi.mock("@/features/Shop/contexts/ShopContext", () => ({
  useShop: vi.fn(),
  ShopProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/features/Shop/components/ShopCard", () => ({
  default: ({ selectedCategoryId }: { selectedCategoryId: string }) => (
    <div>Shop card for {selectedCategoryId}</div>
  ),
}));

vi.mock("@/features/Shop/components/ShopMenu", () => ({
  default: () => <div>Shop menu</div>,
}));

const mockUseShop = useShop as Mock;

describe("ProductsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("asks the user to select a category when none is selected", async () => {
    mockUseShop.mockReturnValue({
      selectedCategoryId: null,
      setSelectedCategoryId: vi.fn(),
    });

    renderPage("/products");

    await waitFor(() => {
      expect(
        screen.getByText(/select a category to browse the product catalog/i)
      ).toBeInTheDocument();
    });
  });

  it("renders shop products for the selected category", async () => {
    mockUseShop.mockReturnValue({
      selectedCategoryId: "category-1",
      setSelectedCategoryId: vi.fn(),
    });

    renderPage("/products");

    await waitFor(() => {
      expect(screen.getByText("Shop card for category-1")).toBeInTheDocument();
    });
  });
});
