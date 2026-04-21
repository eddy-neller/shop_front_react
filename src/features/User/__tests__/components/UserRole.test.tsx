import { screen } from "@testing-library/react";
import UserRole from "@/features/User/components/UserRole";
import { renderComponentQuery } from "@/utils/tests/renderComponent";

describe("UserRole", () => {
  it("renders the admin label", () => {
    renderComponentQuery(<UserRole roles={["ROLE_ADMIN"]} />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("renders nothing when there are no roles", () => {
    const { container } = renderComponentQuery(<UserRole roles={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
