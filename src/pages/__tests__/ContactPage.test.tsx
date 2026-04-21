import { screen } from "@testing-library/react";
import { renderPage } from "@/utils/tests/renderPage";

describe("ContactPage", () => {
  it("renders the contact page and form", () => {
    renderPage("/contact");

    expect(
      screen.getByRole("heading", { name: /contactez-nous/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /envoyer le message/i })
    ).toBeInTheDocument();
  });
});
