import { screen } from "@testing-library/react";
import { renderPage } from "@/lib/utils/tests/renderPage";

describe("HomePage", () => {
  it("renders the hero, featured products and benefits", async () => {
    renderPage("/");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /welcome to e\.n shop/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /featured products/i })
    ).toBeInTheDocument();

    expect(screen.getAllByRole("button", { name: /view more/i })).toHaveLength(
      3
    );
    expect(screen.getByRole("link", { name: /contact us/i })).toHaveAttribute(
      "href",
      "/contact"
    );

    expect(
      screen.getByRole("heading", { name: /why choose us\?/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Fast delivery")).toBeInTheDocument();
    expect(screen.getByText("Guaranteed quality")).toBeInTheDocument();
    expect(screen.getByText("Customer support")).toBeInTheDocument();
  });
});
