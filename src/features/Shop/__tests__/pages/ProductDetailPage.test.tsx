import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock, vi } from "vitest";
import { renderPage } from "@/lib/utils/tests/renderPage";
import { useProduct } from "@/features/Shop/hooks/useShop";
import { expectSpinnerWhileLoading } from "@/lib/utils/tests/base-tests";
import rawProduct from "@/features/Shop/__tests__/fixtures/product.json";
import type { ShopProductDetail } from "@/features/Shop/types/shop";

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom"
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/features/Shop/hooks/useShop", () => ({
  useProduct: vi.fn(),
  useCategories: vi.fn(),
}));

vi.mock("@/features/Shop/components/ShopMenu", () => ({
  default: () => <div>Shop menu</div>,
}));

vi.mock("@/features/Shop/contexts/ShopContext", () => ({
  useShop: vi.fn().mockReturnValue({
    selectedCategoryId: null,
    setSelectedCategoryId: vi.fn(),
  }),
  ShopProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockUseProduct = useProduct as Mock;
const product: ShopProductDetail = rawProduct as ShopProductDetail;

describe("ProductDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseProduct.mockReturnValue({
      data: product,
      isPending: false,
      isError: false,
    });
  });

  const setup = () => {
    renderPage(`/products/${product.id}`);
  };

  it("should render the page title in the Helmet", async () => {
    setup();

    await waitFor(() => {
      expect(document.title).toBe(`${product.title} | E.N Shop`);
    });
  });

  it("should set the breadcrumb with the product title as the active item", async () => {
    setup();

    const breadcrumbNav = screen.getByRole("navigation", {
      name: /breadcrumb/i,
    });
    expect(breadcrumbNav).toBeInTheDocument();

    const breadcrumbList = within(breadcrumbNav).getByRole("list");
    expect(breadcrumbList).toBeInTheDocument();

    expect(within(breadcrumbList).getAllByRole("listitem")).toHaveLength(3);

    const activeItem = await within(breadcrumbList).findByRole("link", {
      name: product.title,
    });
    expect(activeItem).toBeInTheDocument();
    expect(activeItem).toHaveAttribute("aria-current", "page");
  });

  it("should render the loading spinner while product is loading", async () => {
    mockUseProduct.mockReturnValue({
      data: null,
      isPending: true,
      isError: false,
    });

    setup();

    await waitFor(() => {
      expectSpinnerWhileLoading();
    });
  });

  it("displays an error message if data fetching fails", async () => {
    mockUseProduct.mockReturnValue({
      data: null,
      isPending: false,
      isError: true,
    });

    setup();

    await waitFor(() => {
      expect(
        screen.getByText(/unable to load this product/i)
      ).toBeInTheDocument();
    });
  });

  it("renders product title, subtitle and description", async () => {
    setup();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: product.title })
      ).toBeInTheDocument();
    });

    expect(screen.getByText(product.subtitle!)).toBeInTheDocument();
    expect(screen.getByText(product.description!)).toBeInTheDocument();
  });

  it("uses the product description as meta description when subtitle is missing", async () => {
    mockUseProduct.mockReturnValue({
      data: { ...product, subtitle: "" },
      isPending: false,
      isError: false,
    });

    setup();

    await waitFor(() => {
      expect(
        document.querySelector('meta[name="description"]')
      ).toHaveAttribute("content", product.description);
    });
  });

  it("renders the product image when imageUrl is provided", async () => {
    setup();

    await waitFor(() => {
      const img = screen.getByRole("img", { name: product.title });
      expect(img).toBeInTheDocument();
    });
  });

  it("renders the fallback icon when imageUrl is null", async () => {
    mockUseProduct.mockReturnValue({
      data: { ...product, imageUrl: null },
      isPending: false,
      isError: false,
    });

    setup();

    await waitFor(() => {
      expect(
        screen.queryByRole("img", { name: product.title })
      ).not.toBeInTheDocument();
    });
  });

  it("renders the back to products button", async () => {
    setup();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /back to products/i })
      ).toBeInTheDocument();
    });
  });

  it("navigates back when clicking the back to products button", async () => {
    setup();

    await userEvent.click(
      await screen.findByRole("button", { name: /back to products/i })
    );

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
