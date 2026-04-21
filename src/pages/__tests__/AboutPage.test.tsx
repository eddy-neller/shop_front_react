import { screen } from "@testing-library/react";
import { renderPage } from "@/utils/tests/renderPage";

describe("AboutPage", () => {
  it("renders the shop story", () => {
    renderPage("/about");

    expect(screen.getByRole("heading", { name: /à propos/i })).toBeInTheDocument();
    expect(
      screen.getByText(/histoire de notre boutique en ligne/i)
    ).toBeInTheDocument();
  });
});
