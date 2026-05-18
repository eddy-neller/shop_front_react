import { screen, waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { renderPage } from "@/lib/utils/tests/renderPage";
import { useCatalog } from "@/features/Shop/contexts/CatalogContext";

vi.mock("@/features/Shop/contexts/CatalogContext", () => ({
  useCatalog: vi.fn(),
  CatalogProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/features/Shop/components/Catalog/CatalogCard", () => ({
  default: ({ selectedCategoryId }: { selectedCategoryId: string }) => (
    <div>Catalog card for {selectedCategoryId}</div>
  ),
}));

vi.mock("@/features/Shop/components/Catalog/CatalogMenu", () => ({
  default: () => <div>Catalog menu</div>,
}));

const mockUseCatalog = useCatalog as Mock;

describe("ProductsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("asks the user to select a category when none is selected", async () => {
    mockUseCatalog.mockReturnValue({
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
    mockUseCatalog.mockReturnValue({
      selectedCategoryId: "category-1",
      setSelectedCategoryId: vi.fn(),
    });

    renderPage("/products");

    await waitFor(() => {
      expect(
        screen.getByText("Catalog card for category-1")
      ).toBeInTheDocument();
    });
  });
});
