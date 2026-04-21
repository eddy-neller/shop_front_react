import { screen } from "@testing-library/react";
import { renderPage } from "@/utils/tests/renderPage";

describe("HomePage", () => {
  it("renders the main hero and featured products", () => {
    renderPage("/");

    expect(
      screen.getByRole("heading", { name: /bienvenue sur shop/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /produits en vedette/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /voir plus/i })).toHaveLength(3);
    expect(
      screen.getByRole("link", { name: /nous contacter/i })
    ).toHaveAttribute("href", "/contact");
  });
});
