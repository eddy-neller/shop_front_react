import { MemoryRouter, useLocation } from "react-router-dom";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CatalogCard from "@/features/Shop/components/Catalog/CatalogCard";
import { useCatalogData } from "@/features/Shop/hooks/useCatalog";
import categoryFixture from "@/features/Shop/__tests__/fixtures/category.json";
import productsFixture from "@/features/Shop/__tests__/fixtures/products.json";
import type {
  PaginatedResult,
  ShopCategory,
  ShopProductSummary,
} from "@/features/Shop/types/catalog";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";

vi.mock("@/features/Shop/hooks/useCatalog", () => ({
  useCatalogData: vi.fn(),
}));

vi.mock("@/components/Spinner", () => ({
  default: ({ loading }: { loading: boolean }) =>
    loading ? <div role="status">Loading...</div> : null,
}));

vi.mock("@/components/ErrorLoadingCard", () => ({
  default: ({ message }: { message: string }) => (
    <div role="alert">{message}</div>
  ),
}));

vi.mock("@/features/Shop/components/Catalog/CategoryCard", () => ({
  default: ({ category }: { category: ShopCategory }) => (
    <div>{category.title}</div>
  ),
}));

vi.mock("@/features/Shop/components/Catalog/Products", () => ({
  default: ({
    page,
    onPageChange,
  }: {
    page: number;
    onPageChange: (page: number) => void;
  }) => (
    <div>
      <p>Page {page}</p>
      <button type="button" onClick={() => onPageChange(1)}>
        Go page 1
      </button>
      <button type="button" onClick={() => onPageChange(2)}>
        Go page 2
      </button>
    </div>
  ),
}));

const mockUseCatalogData = vi.mocked(useCatalogData);

function LocationProbe() {
  const location = useLocation();

  return <div data-testid="location">{location.search}</div>;
}

function renderCatalogCard(path = "/products") {
  return renderComponentQuery(
    <MemoryRouter initialEntries={[path]}>
      <CatalogCard selectedCategoryId="category-1" />
      <LocationProbe />
    </MemoryRouter>
  );
}

describe("CatalogCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCatalogData.mockReturnValue({
      category: { data: categoryFixture as unknown as ShopCategory },
      products: {
        data: {
          items: productsFixture as ShopProductSummary[],
          totalItems: 24,
          totalPages: 4,
        } satisfies PaginatedResult<ShopProductSummary>,
      },
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useCatalogData>);
  });

  it("shows a spinner while loading", () => {
    mockUseCatalogData.mockReturnValue({
      category: { data: undefined },
      products: { data: undefined },
      isPending: true,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useCatalogData>);

    renderCatalogCard();

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows an error card when isError is true", () => {
    mockUseCatalogData.mockReturnValue({
      category: { data: undefined },
      products: { data: undefined },
      isPending: false,
      isError: true,
      error: null,
    } as unknown as ReturnType<typeof useCatalogData>);

    renderCatalogCard();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load this category products."
    );
  });

  it("shows an error card when category data is missing", () => {
    mockUseCatalogData.mockReturnValue({
      category: { data: undefined },
      products: {
        data: {
          items: productsFixture as ShopProductSummary[],
          totalItems: 24,
          totalPages: 4,
        } satisfies PaginatedResult<ShopProductSummary>,
      },
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useCatalogData>);

    renderCatalogCard();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load this category products."
    );
  });

  it("shows an error card when products data is missing", () => {
    mockUseCatalogData.mockReturnValue({
      category: { data: categoryFixture as unknown as ShopCategory },
      products: { data: undefined },
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useCatalogData>);

    renderCatalogCard();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load this category products."
    );
  });

  it("uses the page from the URL search params", () => {
    renderCatalogCard("/products?page=3");

    expect(mockUseCatalogData).toHaveBeenLastCalledWith("category-1", 3);
    expect(screen.getByText("Page 3")).toBeInTheDocument();
  });

  it("updates the URL search params when the page changes", async () => {
    renderCatalogCard("/products");

    await userEvent.click(screen.getByRole("button", { name: "Go page 2" }));

    expect(await screen.findByText("Page 2")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("?page=2");
  });

  it("removes the page param for the first page", async () => {
    renderCatalogCard("/products?page=3");

    await userEvent.click(screen.getByRole("button", { name: "Go page 1" }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).toBeEmptyDOMElement();
    });
  });
});
