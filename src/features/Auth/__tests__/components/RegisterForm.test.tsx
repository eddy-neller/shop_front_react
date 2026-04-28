import "@/lib/utils/tests/mocks/mockRouterHelper";
import "@/lib/utils/tests/mocks/mockToastHelper";
import { toast } from "@/lib/utils/tests/mocks/mockToastHelper";
import { navigate } from "@/lib/utils/tests/mocks/mockRouterHelper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "@/features/Auth/components/RegisterForm";
import { registration } from "@/features/Auth/lib/api/auth";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";
import { makeValidationError422 } from "@/lib/utils/tests/axiosHelper";

vi.mock("@/features/Auth/lib/api/auth", () => ({
  registration: vi.fn(),
}));

describe("RegisterForm", () => {
  const setup = () => {
    renderComponentQuery(<RegisterForm />);
  };

  beforeEach(() => {
    sessionStorage.clear();
  });

  it("should render the form correctly", () => {
    setup();

    expect(
      screen.getByPlaceholderText(/name@example.com/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/choose a username/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/choose a password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm your password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  it("should show validation errors on empty form submission", async () => {
    setup();

    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/please confirm your password/i)
      ).toBeInTheDocument();
    });
  });

  it("should show validation errors on invalid email format", async () => {
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/name@example.com/i),
      "invalid-email"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it("should show validation errors on short email", async () => {
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/name@example.com/i),
      "a@b"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/minimum 4 characters/i)).toBeInTheDocument();
    });
  });

  it("should show validation errors on long email", async () => {
    setup();

    const longEmail = "a".repeat(101) + "@example.com";
    await userEvent.type(
      screen.getByPlaceholderText(/name@example.com/i),
      longEmail
    );
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/maximum 100 characters/i)).toBeInTheDocument();
    });
  });

  it("should show validation errors on short username", async () => {
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/choose a username/i),
      "a"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/minimum 2 characters/i)).toBeInTheDocument();
    });
  });

  it("should show validation errors on long username", async () => {
    setup();

    const longUsername = "a".repeat(21);
    await userEvent.type(
      screen.getByPlaceholderText(/choose a username/i),
      longUsername
    );
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/maximum 20 characters/i)).toBeInTheDocument();
    });
  });

  it("should show validation errors on weak password", async () => {
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/choose a password/i),
      "weak"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/8.30 chars, with 1 uppercase, 1 number/i)
      ).toBeInTheDocument();
    });
  });

  it("should show validation errors on password mismatch", async () => {
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/choose a password/i),
      "ValidPass1!"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm your password/i),
      "DifferentPass1!"
    );

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("should submit the form successfully", async () => {
    vi.mocked(registration).mockResolvedValueOnce(undefined);
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/name@example.com/i),
      "john.doe@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/choose a username/i),
      "johndoe"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/choose a password/i),
      "ValidPass1!"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm your password/i),
      "ValidPass1!"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(registration).toHaveBeenCalledWith({
        email: "john.doe@example.com",
        username: "johndoe",
        password: "ValidPass1!",
        confirmPassword: "ValidPass1!",
        preferences: { lang: "FR" },
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Account created successfully.",
        expect.objectContaining({ description: expect.any(String) })
      );
      expect(sessionStorage.getItem("registerEmail")).toBe(
        "john.doe@example.com"
      );
      expect(navigate).toHaveBeenCalledWith("/register/success");
    });
  });

  it("should handle server-side validation errors", async () => {
    const violations = [
      { propertyPath: "email", message: "Email already exists" },
      { propertyPath: "username", message: "Username already taken" },
      { propertyPath: "password", message: "Password too weak" },
    ];
    vi.mocked(registration).mockRejectedValueOnce(
      makeValidationError422(violations)
    );
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/name@example.com/i),
      "existing@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/choose a username/i),
      "existinguser"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/choose a password/i),
      "ValidPass1!"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm your password/i),
      "ValidPass1!"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      expect(screen.getByText(/username already taken/i)).toBeInTheDocument();
      expect(screen.getByText(/password too weak/i)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("should show generic error message on failure", async () => {
    vi.mocked(registration).mockRejectedValueOnce(new Error("Network error"));
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/name@example.com/i),
      "test@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/choose a username/i),
      "testuser"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/choose a password/i),
      "ValidPass1!"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm your password/i),
      "ValidPass1!"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "An error occurred while creating your account."
      );
    });
  });

  it("should toggle password visibility", async () => {
    setup();

    const passwordInput = screen.getByPlaceholderText(
      /choose a password/i
    ) as HTMLInputElement;
    const confirmPasswordInput = screen.getByPlaceholderText(
      /confirm your password/i
    ) as HTMLInputElement;

    expect(passwordInput.type).toBe("password");
    expect(confirmPasswordInput.type).toBe("password");

    await userEvent.click(
      screen.getByRole("button", { name: /show password/i })
    );
    expect(passwordInput.type).toBe("text");

    await userEvent.click(
      screen.getByRole("button", { name: /show confirm password/i })
    );
    expect(confirmPasswordInput.type).toBe("text");
  });

  it("should trim email and username on submission", async () => {
    vi.mocked(registration).mockResolvedValueOnce(undefined);
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/name@example.com/i),
      "  john.doe@example.com  "
    );
    await userEvent.type(
      screen.getByPlaceholderText(/choose a username/i),
      "  johndoe  "
    );
    await userEvent.type(
      screen.getByPlaceholderText(/choose a password/i),
      "ValidPass1!"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm your password/i),
      "ValidPass1!"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(registration).toHaveBeenCalledWith({
        email: "john.doe@example.com",
        username: "johndoe",
        password: "ValidPass1!",
        confirmPassword: "ValidPass1!",
        preferences: { lang: "FR" },
      });
    });
  });
});
