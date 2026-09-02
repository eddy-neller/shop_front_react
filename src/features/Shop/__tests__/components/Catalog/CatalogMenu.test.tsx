import { screen, waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";
import CatalogMenu from "@/features/Shop/components/Catalog/CatalogMenu";
import { useCategories } from "@/features/Shop/hooks/useCatalog";
import { useCatalogContext } from "@/features/Shop/contexts/CatalogContext";
import rawCategories from "@/features/Shop/__tests__/fixtures/categories.json";
import type { ShopCategory } from "@/features/Shop/types/catalog";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";
import { expectSpinnerWhileLoading } from "@/lib/utils/tests/base-tests";

vi.mock("@/features/Shop/hooks/useCatalog", () => ({
  useCategories: vi.fn(),
}));

vi.mock("@/features/Shop/contexts/CatalogContext", () => ({
  useCatalogContext: vi.fn(),
}));

const mockUseCategories = useCategories as Mock;
const mockUseCatalogContext = useCatalogContext as Mock;

describe("CatalogMenu", () => {
  const categories = rawCategories as ShopCategory[];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCatalogContext.mockReturnValue({
      selectedCategoryId: null,
      setSelectedCategoryId: vi.fn(),
    });
  });

  it("displays a spinner while loading categories", () => {
    mockUseCategories.mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    });

    renderComponentQuery(<CatalogMenu />);

    expectSpinnerWhileLoading();
  });

  it("displays an error message when categories fail", async () => {
    mockUseCategories.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    });

    renderComponentQuery(<CatalogMenu />);

    await waitFor(() => {
      expect(
        screen.getByText(/unable to load product categories/i)
      ).toBeInTheDocument();
    });
  });

  it("renders the shared category menu with shop categories", async () => {
    mockUseCategories.mockReturnValue({
      data: categories,
      isPending: false,
      isError: false,
    });

    renderComponentQuery(<CatalogMenu />);

    await waitFor(() => {
      expect(
        screen.getByRole("list", { name: /tree category menu/i })
      ).toBeInTheDocument();
    });
  });
});
