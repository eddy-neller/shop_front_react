import { screen } from "@testing-library/react";
import UserProfileCard from "@/features/User/components/UserProfileCard";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";
import { coupeMot, supRepLettre } from "@/lib/utils/helper";
import { User } from "@/features/User/types/user";
import userMock from "@/features/User/__tests__/fixtures/user-admin.json";

describe("UserProfileCard", () => {
  const user: User = userMock;
  const formattedUser = {
    username: coupeMot(supRepLettre(user.username), 15),
    ville: coupeMot(supRepLettre(user.ville), 15),
    passion: coupeMot(supRepLettre(user.passion), 15),
    travail: coupeMot(supRepLettre(user.travail), 15),
    citation: coupeMot(supRepLettre(user.citation), 15),
    signature: coupeMot(supRepLettre(user.signature), 15),
  };

  const setup = () => {
    renderComponentQuery(<UserProfileCard user={user} />);
  };

  it("renders the header with username transformation", () => {
    setup();

    expect(screen.getByText(formattedUser.username)).toBeInTheDocument();

    expect(screen.getByText(/venom@en-develop.fr/i)).toBeInTheDocument();
    expect(screen.getByText(/sign-ins/i)).toBeInTheDocument();
  });
});
