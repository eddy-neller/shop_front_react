import { screen } from "@testing-library/react";
import { renderPage } from "@/utils/tests/renderPage";

describe("ResetPasswordPage", () => {
  it("renders the invalid token state when no token is present", async () => {
    renderPage("/forgot-password/reset");

    expect(
      await screen.findByText(/lien invalide ou expiré/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /demander un nouveau lien/i })
    ).toHaveAttribute("href", "/forgot-password");
  });
});
