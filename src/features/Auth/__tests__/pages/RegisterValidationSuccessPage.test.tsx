import { screen } from "@testing-library/react";
import { renderPage } from "@/utils/tests/renderPage";

describe("RegisterValidationSuccessPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem("registerValidationSuccess", "true");
  });

  it("renders the account activation success state", async () => {
    renderPage("/register/validation/success");

    expect(
      await screen.findByText(/compte activé avec succès/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /^se connecter$/i })
    ).toHaveAttribute("href", "/login");
  });
});
