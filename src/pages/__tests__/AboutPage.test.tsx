import { screen } from "@testing-library/react";
import { renderPage } from "@/lib/utils/tests/renderPage";

describe("AboutPage", () => {
  it("renders the shop story", async () => {
    renderPage("/about");

    expect(
      await screen.findByRole("heading", { level: 1, name: /about/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /discover the story of our online store and our commitment to quality/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /we are an online store passionate about quality and customer satisfaction/i
      )
    ).toBeInTheDocument();
  });
});
