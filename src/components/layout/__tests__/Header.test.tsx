import "@/lib/utils/tests/mocks/mockRouterHelper";
import "@/lib/utils/tests/mocks/mockAuthHelper";
import i18n from "@/i18n";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import Header from "@/components/layout/Header";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";
import { Mock } from "vitest";

const mockUseIsAuthenticated = useIsAuthenticated as Mock;

describe("Header", () => {
  const setup = () => {
    mockUseIsAuthenticated.mockReturnValue(false);

    return renderComponentQuery(<Header />);
  };

  it("does not change language when selecting the current language", async () => {
    const user = userEvent.setup();
    const { queryClient } = setup();
    const changeLanguageSpy = vi.spyOn(i18n, "changeLanguage");
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
    const refetchQueriesSpy = vi.spyOn(queryClient, "refetchQueries");

    await user.click(
      await screen.findByRole("button", { name: /switch to english/i })
    );

    expect(changeLanguageSpy).not.toHaveBeenCalled();
    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    expect(refetchQueriesSpy).not.toHaveBeenCalled();
  });

  it("changes language and refreshes active queries", async () => {
    const user = userEvent.setup();
    const { queryClient } = setup();
    const changeLanguageSpy = vi.spyOn(i18n, "changeLanguage");
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
    const refetchQueriesSpy = vi.spyOn(queryClient, "refetchQueries");

    await user.click(
      await screen.findByRole("button", { name: /switch to french/i })
    );

    await waitFor(() => {
      expect(changeLanguageSpy).toHaveBeenCalledWith("fr");
      expect(invalidateQueriesSpy).toHaveBeenCalledTimes(1);
      expect(refetchQueriesSpy).toHaveBeenCalledWith({ type: "active" });
    });
  });
});
