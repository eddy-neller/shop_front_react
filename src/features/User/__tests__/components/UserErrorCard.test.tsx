import { render, screen } from "@testing-library/react";
import i18n from "@/i18n";
import UserErrorCard from "@/features/User/components/UserErrorCard";

describe("UserErrorCard", () => {
  it("renders the translated error card", async () => {
    await i18n.changeLanguage("fr");
    await i18n.loadNamespaces("user");

    render(<UserErrorCard />);

    expect(screen.getByText(/impossible de charger/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /réessayer/i })
    ).toBeInTheDocument();
  });
});
