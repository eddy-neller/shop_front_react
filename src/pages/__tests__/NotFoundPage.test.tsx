import { screen } from "@testing-library/react";
import { renderPage } from "@/lib/utils/tests/renderPage";

describe("NotFoundPage", () => {
  it("renders the 404 state", async () => {
    renderPage("/does-not-exist");

    expect(await screen.findByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(
      screen.getByText(
        /sorry, the page you are looking for does not exist or has been moved/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to home/i })
    ).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("button", { name: /previous page/i })
    ).toBeInTheDocument();
  });
});
