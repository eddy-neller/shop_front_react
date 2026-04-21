import { screen } from "@testing-library/react";
import { renderPage } from "@/utils/tests/renderPage";

describe("NotFoundPage", () => {
  it("renders the 404 state", async () => {
    renderPage("/does-not-exist");

    expect(await screen.findByText("404")).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: /retour à l'accueil/i })
    ).toHaveAttribute("href", "/");
  });
});
