import { screen } from "@testing-library/react";
import { renderPage } from "@/utils/tests/renderPage";

describe("RegisterSuccessPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem("registerEmail", "john@example.com");
  });

  it("renders the registration success state", async () => {
    renderPage("/register/success");

    expect(
      await screen.findByText(/inscription réussie/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /aller à la page de connexion/i })
    ).toHaveAttribute("href", "/login");
  });
});
