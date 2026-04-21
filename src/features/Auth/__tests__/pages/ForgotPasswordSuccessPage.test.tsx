import { screen } from "@testing-library/react";
import { renderPage } from "@/utils/tests/renderPage";

describe("ForgotPasswordSuccessPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem("forgotPasswordEmail", "john@example.com");
  });

  it("renders the forgot password success state", async () => {
    renderPage("/forgot-password/success");

    expect(
      await screen.findByRole("heading", { name: /email envoyé avec succès/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /retour à la connexion/i })
    ).toHaveAttribute("href", "/login");
  });
});
