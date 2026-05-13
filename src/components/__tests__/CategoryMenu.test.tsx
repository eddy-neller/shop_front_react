import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryMenu from "@/components/CategoryMenu";
import mockShopCategories from "@/features/Shop/__tests__/fixtures/categories.json";
import type { ShopCategory } from "@/features/Shop/types/shop";
import type { CategoryTree } from "@/lib/utils/category-tree";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";

const mockRawCategories = vi.fn();
const mockGetCategoryChildren = vi.fn();
const mockContext = vi.fn();
const mockSetSelectedCategoryId = vi.fn();

describe("CategoryMenu", () => {
  const shopCategories: ShopCategory[] = mockShopCategories;

  beforeEach(() => {
    vi.clearAllMocks();

    mockContext.mockReturnValue({
      setSelectedCategoryId: mockSetSelectedCategoryId,
      selectedCategoryId: null,
    });
  });

  const setup = () => {
    mockRawCategories.mockReturnValue(shopCategories);

    renderComponentQuery(
      <CategoryMenu
        rawCategories={mockRawCategories()}
        getCategoryChildren={mockGetCategoryChildren}
        context={mockContext}
      />
    );
  };

  it("renders the gallery categories menu", async () => {
    setup();

    await waitFor(() => {
      const menuContainer = screen.getByRole("list", {
        name: /tree category menu/i,
      });
      expect(menuContainer).toBeInTheDocument();
    });

    const categories = screen.getAllByRole("button", {
      name: /select category/i,
    });
    expect(categories.length).toBeGreaterThan(0);
  });

  it("handles category selection", async () => {
    setup();

    const regex = new RegExp(`select category ${shopCategories[0].id}`, "i");
    const category = screen.getByRole("button", {
      name: regex,
    });

    await userEvent.click(category);

    await waitFor(() => {
      expect(mockSetSelectedCategoryId).toHaveBeenCalled();
    });
  });

  it("renders the active state if category id matches selectedCategoryId", async () => {
    mockContext.mockReturnValue({
      setSelectedCategoryId: mockSetSelectedCategoryId,
      selectedCategoryId: shopCategories[0].id,
    });

    setup();

    const regex = new RegExp(`select category ${shopCategories[0].id}`, "i");
    const category = screen.getByRole("button", {
      name: regex,
    });
    const parentElement = category.closest(".custom-hover");
    expect(parentElement).toHaveClass("active");
  });

  it("loads and renders child categories when a category is expanded once", async () => {
    const parentCategory = shopCategories[0];
    const childCategories: CategoryTree[] = [
      {
        id: "child-zulu",
        title: "Zulu Cases",
        slug: "zulu-cases",
        nbProduct: 9,
        hasChildren: true,
      },
      {
        id: "child-alpha",
        title: "Alpha Accessories",
        slug: "alpha-accessories",
        nbProduct: 3,
        hasChildren: false,
      },
    ];

    mockGetCategoryChildren.mockResolvedValue(childCategories);
    setup();

    const expandButton = screen.getByRole("button", {
      name: new RegExp(`expand category ${parentCategory.id}`, "i"),
    });

    await userEvent.click(expandButton);

    await waitFor(() => {
      expect(mockGetCategoryChildren).toHaveBeenCalledWith(parentCategory.id);
      expect(
        screen.getByRole("button", { name: /select category child-alpha/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /select category child-zulu/i })
      ).toBeInTheDocument();
    });

    const alphaCategory = screen.getByRole("button", {
      name: /select category child-alpha/i,
    });
    const zuluCategory = screen.getByRole("button", {
      name: /select category child-zulu/i,
    });

    expect(alphaCategory).toHaveTextContent("Alpha Accessories");
    expect(zuluCategory).toHaveTextContent("Zulu Cases");
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", {
        name: new RegExp(`expand category ${parentCategory.id}`, "i"),
      })
    );
    await userEvent.click(
      screen.getByRole("button", {
        name: new RegExp(`expand category ${parentCategory.id}`, "i"),
      })
    );

    expect(mockGetCategoryChildren).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", {
        name: /expand category child-zulu/i,
      })
    ).toBeInTheDocument();
  });
});
