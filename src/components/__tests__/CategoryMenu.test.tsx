import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryMenu from "@/components/CategoryMenu";
import { renderComponentQuery } from "@/utils/tests/renderComponent";
import type { CategoryTree } from "@/utils/category-tree";

const categories: CategoryTree[] = [
  { id: "cat-1", title: "Alpha", children: [], count: 2 },
  { id: "cat-2", title: "Beta", children: [], count: 3 },
];

describe("CategoryMenu", () => {
  it("renders categories", () => {
    const setSelectedCategoryId = vi.fn();

    renderComponentQuery(
      <CategoryMenu
        rawCategories={categories}
        getCategory={vi.fn()}
        context={() => ({ selectedCategoryId: null, setSelectedCategoryId })}
      />
    );

    expect(screen.getByText(/alpha/i)).toBeInTheDocument();
    expect(screen.getByText(/beta/i)).toBeInTheDocument();
  });

  it("calls the selection handler when a category is clicked", async () => {
    const setSelectedCategoryId = vi.fn();

    renderComponentQuery(
      <CategoryMenu
        rawCategories={categories}
        getCategory={vi.fn()}
        context={() => ({ selectedCategoryId: null, setSelectedCategoryId })}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /select category cat-1/i }));
    expect(setSelectedCategoryId).toHaveBeenCalledWith("cat-1");
  });
});
