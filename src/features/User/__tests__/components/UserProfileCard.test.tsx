import { screen } from "@testing-library/react";
import UserProfileCard from "@/features/User/components/UserProfileCard";
import { renderComponentQuery } from "@/utils/tests/renderComponent";

const user = {
  id: "1",
  firstname: "John",
  lastname: "Doe",
  username: "venom",
  email: "venom@example.com",
  roles: ["ROLE_USER"],
  status: 1,
  dateNaissance: "1990-01-01",
  ville: "Paris",
  passion: "Code",
  travail: "Dev",
  citation: "Hello",
  signature: "JD",
  siteweb: "",
  avatarUrl: "",
  userbarUrl: "",
  lastVisit: "2026-04-18T12:00:00+00:00",
  nbLogin: 7,
  nbForumMessage: 0,
  nbMessageSent: 0,
  nbMessageReceived: 0,
  createdAt: "2026-04-01T12:00:00+00:00",
  updatedAt: "2026-04-18T12:00:00+00:00",
};

describe("UserProfileCard", () => {
  it("renders the public profile data", () => {
    renderComponentQuery(<UserProfileCard user={user} />);

    expect(screen.getByText("venom")).toBeInTheDocument();
    expect(screen.getByText(/member/i)).toBeInTheDocument();
  });

  it("renders private account details when requested", () => {
    renderComponentQuery(<UserProfileCard user={user} isPrivate />);

    expect(screen.getByText(/venom@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/nombre de connexions/i)).toBeInTheDocument();
  });
});
