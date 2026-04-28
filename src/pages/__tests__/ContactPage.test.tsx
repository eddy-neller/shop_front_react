import { screen } from "@testing-library/react";
import { renderPage } from "@/lib/utils/tests/renderPage";

describe("ContactPage", () => {
  it("renders the contact page and form", async () => {
    renderPage("/contact");

    expect(
      await screen.findByRole("heading", { level: 1, name: /contact us/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/feel free to write to us/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /contact us/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^message$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });
});
