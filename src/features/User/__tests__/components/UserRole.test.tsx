import { screen } from "@testing-library/react";
import UserRole from "@/features/User/components/UserRole";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";

describe("UserRole", () => {
  const COLOR_ADMIN = "rgb(255, 0, 0)";
  const COLOR_MODERATOR = "rgb(0, 0, 255)";
  const COLOR_MEMBER = "rgb(0, 128, 0)";
  const COLOR_UNKNOWN = "rgb(128, 128, 128)";

  const setup = (roles: string[]) => {
    renderComponentQuery(<UserRole roles={roles} />);
  };

  it("renders 'Administrator' with red color when ROLE_ADMIN is present", () => {
    setup(["ROLE_ADMIN"]);

    const roleLabel = screen.getByText("Admin");
    expect(roleLabel).toBeInTheDocument();
    expect(roleLabel).toHaveStyle({ color: COLOR_ADMIN });
  });

  it("renders 'Moderator' with blue color when ROLE_MODERATEUR is present", () => {
    setup(["ROLE_MODERATEUR"]);

    const roleLabel = screen.getByText("Moderator");
    expect(roleLabel).toBeInTheDocument();
    expect(roleLabel).toHaveStyle({ color: COLOR_MODERATOR });
  });

  it("renders 'Member' with green color when ROLE_USER is present", () => {
    setup(["ROLE_USER"]);

    const roleLabel = screen.getByText("Member");
    expect(roleLabel).toBeInTheDocument();
    expect(roleLabel).toHaveStyle({ color: COLOR_MEMBER });
  });

  it("renders 'Unknown' with gray color when no known role is present", () => {
    setup(["ROLE_UNKNOWN"]);

    const roleLabel = screen.getByText("Unknown");
    expect(roleLabel).toBeInTheDocument();
    expect(roleLabel).toHaveStyle({ color: COLOR_UNKNOWN });
  });

  it("prioritizes roles correctly when multiple roles are present", () => {
    setup(["ROLE_USER", "ROLE_MODERATEUR", "ROLE_ADMIN"]);

    const roleLabel = screen.getByText("Admin");
    expect(roleLabel).toBeInTheDocument();
    expect(roleLabel).toHaveStyle({ color: COLOR_ADMIN });
  });

  it("renders 'Unknown' when the roles array is empty", () => {
    setup([]);

    const roleLabel = screen.getByText("Unknown");
    expect(roleLabel).toBeInTheDocument();
    expect(roleLabel).toHaveStyle({ color: COLOR_UNKNOWN });
  });
});
