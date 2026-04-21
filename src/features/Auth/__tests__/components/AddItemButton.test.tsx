import "@/utils/tests/mocks/mockAuthHelper";
import "@/utils/tests/mocks/mockRouterHelper";
import { screen } from "@testing-library/react";
import AddItemButton from "@/features/Auth/components/AddItemButton";
import { SubjectType } from "@/utils/ability";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { renderComponentAbility } from "@/utils/tests/renderComponent";

describe("AddItemButton", () => {
  it("renders a creation button for an authenticated member", () => {
    vi.mocked(useIsAuthenticated).mockReturnValue(true);

    renderComponentAbility(
      <AddItemButton
        permission={SubjectType.PARTNER}
        to="/partner/add"
        buttonText="Ajouter"
        message="pour ajouter un partenaire"
      />,
      "UserMember"
    );

    expect(screen.getByRole("link", { name: /ajouter/i })).toHaveAttribute("href", "/partner/add");
  });

  it("renders the login message for guests", () => {
    vi.mocked(useIsAuthenticated).mockReturnValue(false);

    renderComponentAbility(
      <AddItemButton
        permission={SubjectType.PARTNER}
        to="/partner/add"
        buttonText="Ajouter"
        message="pour ajouter un partenaire"
      />
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/login");
  });
});
