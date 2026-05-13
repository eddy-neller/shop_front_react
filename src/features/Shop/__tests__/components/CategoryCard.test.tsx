import { screen, waitFor } from "@testing-library/react";
import CategoryCard from "@/features/Shop/components/CategoryCard";
import type { ShopCategory } from "@/features/Shop/types/shop";
import rawCategory from "@/features/Shop/__tests__/fixtures/category.json";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";

describe("CategoryCard", () => {
  const category: ShopCategory = rawCategory as ShopCategory;

  const setup = (cat: ShopCategory) => {
    renderComponentQuery(<CategoryCard category={cat} />);
  };

  it("renders the category title", async () => {
    setup(category);

    await waitFor(() => {
      expect(screen.getByText(category.title)).toBeInTheDocument();
    });
  });

  it("renders the product count badge with plural form", async () => {
    setup(category);

    await waitFor(() => {
      expect(screen.getByText("5 products")).toBeInTheDocument();
    });
  });

  it("renders the product count badge with singular form", async () => {
    setup({ ...category, nbProduct: 1 });

    await waitFor(() => {
      expect(screen.getByText("1 product")).toBeInTheDocument();
    });
  });

  it("renders the description when provided", async () => {
    setup(category);

    await waitFor(() => {
      expect(screen.getByText(category.description!)).toBeInTheDocument();
    });
  });

  it("does not render the description when null", async () => {
    setup({ ...category, description: null });

    await waitFor(() => {
      expect(
        screen.queryByText(category.description!)
      ).not.toBeInTheDocument();
    });
  });
});
