import "@/i18n";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BackButton from "@/components/not-found/BackButton";

describe("BackButton", () => {
  const setup = () => {
    render(<BackButton />);
  };

  it("renders the translated back button label", async () => {
    setup();

    expect(
      await screen.findByRole("button", { name: /previous page/i })
    ).toBeInTheDocument();
  });

  it("goes back in browser history when clicked", async () => {
    const historyBack = vi
      .spyOn(window.history, "back")
      .mockImplementation(() => undefined);

    setup();

    await userEvent.click(
      await screen.findByRole("button", { name: /previous page/i })
    );

    expect(historyBack).toHaveBeenCalledTimes(1);

    historyBack.mockRestore();
  });
});
