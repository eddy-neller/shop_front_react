import { screen } from "@testing-library/react";
import { renderPage } from "@/utils/tests/renderPage";

describe("RegisterValidationPage", () => {
  it("renders the invalid token state when no token is present", async () => {
    renderPage("/register/validation");

    expect(
      await screen.findByText(/lien d'activation invalide/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /nous contacter/i })
    ).toHaveAttribute("href", "/contact");
  });
});
