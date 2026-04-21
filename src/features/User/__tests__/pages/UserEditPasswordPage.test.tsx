import { screen } from "@testing-library/react";
import { renderPage } from "@/utils/tests/renderPage";

describe("UserEditPasswordPage", () => {
  it("renders the password form", () => {
    renderPage("/user/password");

    expect(screen.getByText(/modifier le mot de passe/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /mettre à jour le mot de passe/i })
    ).toBeInTheDocument();
  });
});
