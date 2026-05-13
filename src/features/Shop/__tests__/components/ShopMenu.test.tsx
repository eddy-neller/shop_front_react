import { screen, waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";
import ShopMenu from "@/features/Shop/components/ShopMenu";
import { useCategories } from "@/features/Shop/hooks/useShop";
import { useShop } from "@/features/Shop/contexts/ShopContext";
import rawCategories from "@/features/Shop/__tests__/fixtures/categories.json";
import type { ShopCategory } from "@/features/Shop/types/shop";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";
import { expectSpinnerWhileLoading } from "@/lib/utils/tests/base-tests";

vi.mock("@/features/Shop/hooks/useShop", () => ({
  useCategories: vi.fn(),
}));

vi.mock("@/features/Shop/contexts/ShopContext", () => ({
  useShop: vi.fn(),
}));

const mockUseCategories = useCategories as Mock;
const mockUseShop = useShop as Mock;

describe("ShopMenu", () => {
  const categories = rawCategories as ShopCategory[];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseShop.mockReturnValue({
      selectedCategoryId: null,
      setSelectedCategoryId: vi.fn(),
    });
  });

  it("displays a spinner while loading categories", () => {
    mockUseCategories.mockReturnValueOnce({
      data: undefined,
      isPending: true,
      isError: false,
    });

    renderComponentQuery(<ShopMenu />);

    expectSpinnerWhileLoading();
  });

  it("displays an error message when categories fail", async () => {
    mockUseCategories.mockReturnValueOnce({
      data: undefined,
      isPending: false,
      isError: true,
    });

    renderComponentQuery(<ShopMenu />);

    await waitFor(() => {
      expect(
        screen.getByText(/unable to load product categories/i)
      ).toBeInTheDocument();
    });
  });

  it("renders the shared category menu with shop categories", async () => {
    mockUseCategories.mockReturnValueOnce({
      data: categories,
      isPending: false,
      isError: false,
    });

    renderComponentQuery(<ShopMenu />);

    await waitFor(() => {
      expect(
        screen.getByRole("list", { name: /tree category menu/i })
      ).toBeInTheDocument();
    });
  });
});
