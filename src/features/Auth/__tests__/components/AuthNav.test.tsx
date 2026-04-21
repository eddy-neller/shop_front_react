import "@/utils/tests/mocks/mockRouterHelper";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthNav from "@/features/Auth/components/AuthNav";
import { renderComponentQuery } from "@/utils/tests/renderComponent";

describe("AuthNav", () => {
  it("renders the auth trigger", () => {
    renderComponentQuery(<AuthNav />);

    expect(
      screen.getByRole("button", { name: /s'inscrire \/ se connecter/i })
    ).toBeInTheDocument();
  });

  it("opens the auth panel on hover", async () => {
    renderComponentQuery(<AuthNav />);

    await userEvent.hover(
      screen.getByRole("button", { name: /s'inscrire \/ se connecter/i })
    );

    expect(screen.getByText(/choisissez une option pour continuer/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^se connecter$/i })).toHaveAttribute("href", "/login");
  });
});
