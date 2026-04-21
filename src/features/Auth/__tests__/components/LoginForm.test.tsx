import "@/utils/tests/mocks/mockRouterHelper";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/features/Auth/components/LoginForm";
import { renderComponentQuery } from "@/utils/tests/renderComponent";

const loginSpy = vi.fn();

vi.mock("@/features/Auth/hooks/useLogin", () => ({
  useLogin: () => ({
    login: loginSpy,
    isPending: false,
  }),
}));

describe("LoginForm", () => {
  it("renders the current login form", () => {
    renderComponentQuery(<LoginForm />);

    expect(screen.getByLabelText(/adresse email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^mot de passe$/i)).toBeInTheDocument();
  });

  it("submits credentials through the login hook", async () => {
    renderComponentQuery(<LoginForm />);

    await userEvent.type(
      screen.getByLabelText(/adresse email/i),
      "john@example.com"
    );
    await userEvent.type(
      screen.getByLabelText(/^mot de passe$/i),
      "Password1!"
    );
    await userEvent.click(screen.getByRole("button", { name: /se connecter/i }));

    expect(loginSpy).toHaveBeenCalledWith({
      email: "john@example.com",
      password: "Password1!",
    });
  });
});
