import type { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Products from "@/features/Shop/components/Catalog/Products";
import rawProducts from "@/features/Shop/__tests__/fixtures/products.json";
import type { ShopProductSummary } from "@/features/Shop/types/catalog";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";

describe("Products", () => {
  const products = rawProducts as ShopProductSummary[];
  const onPageChange = vi.fn();

  const setup = (overrides?: Partial<ComponentProps<typeof Products>>) => {
    const props: ComponentProps<typeof Products> = {
      products,
      page: 1,
      totalPages: 1,
      totalItems: products.length,
      onPageChange,
      ...overrides,
    };

    return renderComponentQuery(
      <MemoryRouter>
        <Products {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    onPageChange.mockClear();
  });

  it("renders product cards with product links and cart buttons", () => {
    setup();

    expect(screen.getByText("Mechanical Keyboard")).toBeInTheDocument();
    expect(screen.getByText("USB-C Dock")).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /mechanical keyboard/i })[0]
    ).toHaveAttribute("href", `/products/${products[0].id}`);
    expect(
      screen.getAllByRole("button", { name: /add to cart/i })
    ).toHaveLength(products.length);
  });

  it("renders an empty state without products", () => {
    setup({ products: [], totalItems: 0 });

    expect(
      screen.getByText(/no products found in this category/i)
    ).toBeInTheDocument();
  });

  it("does not render pagination when there is only one page", () => {
    setup({ totalPages: 1 });

    expect(
      screen.queryByRole("navigation", { name: /pagination/i })
    ).not.toBeInTheDocument();
  });

  it("renders pagination before and after products when there are multiple pages", () => {
    setup({ totalPages: 3, totalItems: 12 });

    expect(
      screen.getAllByRole("navigation", { name: /pagination/i })
    ).toHaveLength(2);
  });

  it("calls onPageChange when a pagination page is selected", async () => {
    setup({ totalPages: 3, totalItems: 12 });

    const pagination = screen.getAllByRole("navigation", {
      name: /pagination/i,
    })[0];

    await userEvent.click(
      within(pagination).getByRole("link", { name: "Page 2" })
    );

    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
