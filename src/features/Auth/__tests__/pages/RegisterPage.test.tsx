import { screen } from "@testing-library/react";
import { renderPage } from "@/utils/tests/renderPage";

describe("RegisterPage", () => {
  it("renders the register page", () => {
    renderPage("/register");

    expect(
      screen.getByRole("heading", { name: /créer un compte/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continuer avec google/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /créer le compte/i })
    ).toBeInTheDocument();
  });
});
