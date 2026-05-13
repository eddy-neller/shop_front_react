import { MemoryRouter, useLocation } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShopProvider, useShop } from "@/features/Shop/contexts/ShopContext";

function ShopContextProbe() {
  const { selectedCategoryId, setSelectedCategoryId } = useShop();
  const location = useLocation();

  return (
    <div>
      <p>Selected category: {selectedCategoryId ?? "none"}</p>
      <p data-testid="location">{location.search}</p>
      <button type="button" onClick={() => setSelectedCategoryId("new-cat")}>
        Select category
      </button>
      <button type="button" onClick={() => setSelectedCategoryId(null)}>
        Clear category
      </button>
    </div>
  );
}

function renderShopProvider(path = "/products") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ShopProvider>
        <ShopContextProbe />
      </ShopProvider>
    </MemoryRouter>
  );
}

describe("ShopContext", () => {
  it("uses the category from the URL search params", () => {
    renderShopProvider("/products?cat=category-1&page=2");

    expect(
      screen.getByText("Selected category: category-1")
    ).toBeInTheDocument();
  });

  it("updates the category URL param and resets pagination", async () => {
    renderShopProvider("/products?cat=category-1&page=2");

    await userEvent.click(
      screen.getByRole("button", { name: "Select category" })
    );

    expect(screen.getByText("Selected category: new-cat")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("?cat=new-cat");
  });

  it("clears category and pagination URL params", async () => {
    renderShopProvider("/products?cat=category-1&page=2");

    await userEvent.click(
      screen.getByRole("button", { name: "Clear category" })
    );

    expect(screen.getByText("Selected category: none")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toBeEmptyDOMElement();
  });
});
