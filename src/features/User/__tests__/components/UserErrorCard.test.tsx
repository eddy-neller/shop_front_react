import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import i18n from "@/i18n";
import UserErrorCard from "@/features/User/components/UserErrorCard";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";

describe("UserErrorCard", () => {
  const setup = () => {
    return renderComponentQuery(<UserErrorCard />);
  };

  beforeAll(async () => {
    await i18n.loadNamespaces("user");
  });

  it("renders the translated error card", async () => {
    setup();

    expect(
      screen.getByText(/unable to load your profile information/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeInTheDocument();
  });

  it("reloads the page when the retry button is clicked", async () => {
    const reload = vi.fn();
    const windowMock = Object.create(window, {
      location: {
        value: {
          ...window.location,
          reload,
        },
      },
    });

    vi.stubGlobal("window", windowMock);

    try {
      setup();

      await userEvent.click(screen.getByRole("button", { name: /try again/i }));

      expect(reload).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
