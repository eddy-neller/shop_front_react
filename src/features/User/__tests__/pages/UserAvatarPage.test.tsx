import { screen } from "@testing-library/react";
import { renderPage } from "@/utils/tests/renderPage";

vi.mock("@/features/User/hooks/useUser", () => ({
  useMe: () => ({
    data: {
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
      avatarUrl: "/uploads/avatar.png",
      userbarUrl: "",
      lastVisit: "2026-04-18T12:00:00+00:00",
      nbLogin: 7,
      nbForumMessage: 0,
      nbMessageSent: 0,
      nbMessageReceived: 0,
      createdAt: "2026-04-01T12:00:00+00:00",
      updatedAt: "2026-04-18T12:00:00+00:00",
    },
    isPending: false,
    isError: false,
  }),
}));

describe("UserAvatarPage", () => {
  it("renders the avatar instructions and form", () => {
    renderPage("/user/avatar");

    expect(screen.getByText(/un avatar est une petite image/i)).toBeInTheDocument();
    expect(screen.getByText(/modifier l'avatar/i)).toBeInTheDocument();
  });
});
