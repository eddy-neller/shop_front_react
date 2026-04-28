import "@/lib/utils/tests/mocks/mockRouterHelper";
import { screen } from "@testing-library/react";
import UserDashboard from "@/features/User/components/UserDashboard";
import { renderComponentAbility } from "@/lib/utils/tests/renderComponent";
import { UserType } from "@/lib/utils/tests/userTypes";
import rawUser from "@/features/User/__tests__/fixtures/user-admin.json";
import { User } from "@/features/User/types/user";

describe("UserDashboard", () => {
  const user: User = rawUser;

  const setup = (typeUser?: UserType) => {
    renderComponentAbility(<UserDashboard user={user} />, typeUser);
  };

  it("renders admin content for admin", () => {
    setup("UserAdmin");

    expect(screen.getByText(/Administrator/i)).toBeInTheDocument();
    expect(screen.queryByText(/Moderator/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Member/i)).not.toBeInTheDocument();
  });

  it("renders moderator content for moderators", () => {
    setup("UserModer");

    expect(
      screen.getByRole("heading", { name: /Moderator/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /Administrator/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /Member/i })
    ).not.toBeInTheDocument();
  });

  it("renders member content for members", () => {
    setup("UserMember");

    expect(
      screen.getByRole("heading", { name: /Member/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /Administrator/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /Moderator/i })
    ).not.toBeInTheDocument();
  });

  it("renders nothing for users without any permissions", () => {
    setup(undefined);

    expect(
      screen.queryByRole("heading", { name: /Administrator/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /Moderator/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /Member/i })
    ).not.toBeInTheDocument();
  });
});
