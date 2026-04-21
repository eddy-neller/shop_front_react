import "@/utils/tests/mocks/mockRouterHelper";
import "@/utils/tests/mocks/mockToastify";
import { toast } from "@/utils/tests/mocks/mockToastify";
import { navigate } from "@/utils/tests/mocks/mockRouterHelper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "@/features/Auth/components/RegisterForm";
import { registration } from "@/features/Auth/services/auth";
import { renderComponentQuery } from "@/utils/tests/renderComponent";

vi.mock("@/features/Auth/services/auth", () => ({
  registration: vi.fn(),
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders the current register form", () => {
    renderComponentQuery(<RegisterForm />);

    expect(screen.getByLabelText(/adresse email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^mot de passe$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeInTheDocument();
  });

  it("submits the registration payload", async () => {
    vi.mocked(registration).mockResolvedValueOnce(undefined);
    renderComponentQuery(<RegisterForm />);

    await userEvent.type(
      screen.getByLabelText(/adresse email/i),
      " john@example.com "
    );
    await userEvent.type(screen.getByLabelText(/nom d'utilisateur/i), " venom ");
    await userEvent.type(screen.getByLabelText(/^mot de passe$/i), "Password1!");
    await userEvent.type(screen.getByLabelText(/confirmer le mot de passe/i), "Password1!");
    await userEvent.click(screen.getByRole("button", { name: /créer le compte/i }));

    await waitFor(() => {
      expect(registration).toHaveBeenCalledWith({
        email: "john@example.com",
        username: "venom",
        password: "Password1!",
        confirmPassword: "Password1!",
        preferences: { lang: "FR" },
      });
      expect(toast.success).toHaveBeenCalled();
      expect(sessionStorage.getItem("registerEmail")).toBe("john@example.com");
      expect(navigate).toHaveBeenCalledWith("/register/success");
    });
  });
});
