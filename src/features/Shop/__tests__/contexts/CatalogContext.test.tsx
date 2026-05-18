import { MemoryRouter, useLocation } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  CatalogProvider,
  useCatalog,
} from "@/features/Shop/contexts/CatalogContext";

function CatalogContextProbe() {
  const { selectedCategoryId, setSelectedCategoryId } = useCatalog();
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

function renderCatalogProvider(path = "/products") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <CatalogProvider>
        <CatalogContextProbe />
      </CatalogProvider>
    </MemoryRouter>
  );
}

describe("CatalogContext", () => {
  it("uses the category from the URL search params", () => {
    renderCatalogProvider("/products?cat=category-1&page=2");

    expect(
      screen.getByText("Selected category: category-1")
    ).toBeInTheDocument();
  });

  it("updates the category URL param and resets pagination", async () => {
    renderCatalogProvider("/products?cat=category-1&page=2");

    await userEvent.click(
      screen.getByRole("button", { name: "Select category" })
    );

    expect(screen.getByText("Selected category: new-cat")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("?cat=new-cat");
  });

  it("clears category and pagination URL params", async () => {
    renderCatalogProvider("/products?cat=category-1&page=2");

    await userEvent.click(
      screen.getByRole("button", { name: "Clear category" })
    );

    expect(screen.getByText("Selected category: none")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toBeEmptyDOMElement();
  });
});
