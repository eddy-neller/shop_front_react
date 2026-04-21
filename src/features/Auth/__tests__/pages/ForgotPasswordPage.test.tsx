import { screen } from "@testing-library/react";
import { renderPage } from "@/utils/tests/renderPage";

describe("ForgotPasswordPage", () => {
  it("renders the password reset request page", () => {
    renderPage("/forgot-password");

    expect(
      screen.getByRole("heading", { name: /mot de passe oublié/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /envoyer l'email de réinitialisation/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /retour à la connexion/i })
    ).toHaveAttribute("href", "/login");
  });
});
