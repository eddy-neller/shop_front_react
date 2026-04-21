import { screen } from "@testing-library/react";
import { renderPage } from "@/utils/tests/renderPage";

describe("LoginPage", () => {
  it("renders the login page", () => {
    renderPage("/login");

    expect(screen.getByRole("heading", { name: /bienvenue/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /se connecter/i }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: /créer un compte/i })
    ).toHaveAttribute("href", "/register");
    expect(
      screen.getByRole("link", { name: /mot de passe oublié/i })
    ).toHaveAttribute("href", "/forgot-password");
  });
});
