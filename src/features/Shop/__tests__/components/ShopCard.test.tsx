import { MemoryRouter, useLocation } from "react-router-dom";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShopCard from "@/features/Shop/components/ShopCard";
import { useShopData } from "@/features/Shop/hooks/useShop";
import categoryFixture from "@/features/Shop/__tests__/fixtures/category.json";
import productsFixture from "@/features/Shop/__tests__/fixtures/products.json";
import type {
  PaginatedResult,
  ShopCategory,
  ShopProductSummary,
} from "@/features/Shop/types/shop";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";

vi.mock("@/features/Shop/hooks/useShop", () => ({
  useShopData: vi.fn(),
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

vi.mock("@/features/Shop/components/CategoryCard", () => ({
  default: ({ category }: { category: ShopCategory }) => (
    <div>{category.title}</div>
  ),
}));

vi.mock("@/features/Shop/components/Products", () => ({
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

const mockUseShopData = vi.mocked(useShopData);

function LocationProbe() {
  const location = useLocation();

  return <div data-testid="location">{location.search}</div>;
}

function renderShopCard(path = "/products") {
  return renderComponentQuery(
    <MemoryRouter initialEntries={[path]}>
      <ShopCard selectedCategoryId="category-1" />
      <LocationProbe />
    </MemoryRouter>
  );
}

describe("ShopCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseShopData.mockReturnValue({
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
    } as unknown as ReturnType<typeof useShopData>);
  });

  it("shows a spinner while loading", () => {
    mockUseShopData.mockReturnValue({
      category: { data: undefined },
      products: { data: undefined },
      isPending: true,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useShopData>);

    renderShopCard();

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows an error card when isError is true", () => {
    mockUseShopData.mockReturnValue({
      category: { data: undefined },
      products: { data: undefined },
      isPending: false,
      isError: true,
      error: null,
    } as unknown as ReturnType<typeof useShopData>);

    renderShopCard();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load this category products."
    );
  });

  it("shows an error card when category data is missing", () => {
    mockUseShopData.mockReturnValue({
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
    } as unknown as ReturnType<typeof useShopData>);

    renderShopCard();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load this category products."
    );
  });

  it("shows an error card when products data is missing", () => {
    mockUseShopData.mockReturnValue({
      category: { data: categoryFixture as unknown as ShopCategory },
      products: { data: undefined },
      isPending: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useShopData>);

    renderShopCard();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load this category products."
    );
  });

  it("uses the page from the URL search params", () => {
    renderShopCard("/products?page=3");

    expect(mockUseShopData).toHaveBeenLastCalledWith("category-1", 3);
    expect(screen.getByText("Page 3")).toBeInTheDocument();
  });

  it("updates the URL search params when the page changes", async () => {
    renderShopCard("/products");

    await userEvent.click(screen.getByRole("button", { name: "Go page 2" }));

    expect(await screen.findByText("Page 2")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("?page=2");
  });

  it("removes the page param for the first page", async () => {
    renderShopCard("/products?page=3");

    await userEvent.click(screen.getByRole("button", { name: "Go page 1" }));

    await waitFor(() => {
      expect(screen.getByTestId("location")).toBeEmptyDOMElement();
    });
  });
});
