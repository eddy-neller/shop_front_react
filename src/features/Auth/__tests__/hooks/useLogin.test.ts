import "@/lib/utils/tests/mocks/mockAuthHelper";
import "@/lib/utils/tests/mocks/mockRouterHelper";
import "@/lib/utils/tests/mocks/mockToastHelper";
import { toast } from "@/lib/utils/tests/mocks/mockToastHelper";
import { navigate } from "@/lib/utils/tests/mocks/mockRouterHelper";
import { signIn } from "@/lib/utils/tests/mocks/mockAuthHelper";
import { waitFor } from "@testing-library/react";
import { renderHookTest } from "@/lib/utils/tests/renderHook";
import { useLogin } from "@/features/Auth/hooks/useLogin";
import { login } from "@/features/Auth/lib/api/auth";
import { jwtDecode } from "jwt-decode";
import { defineAbilityFor } from "@/lib/utils/ability";
import { setupAuthLogoutListener } from "@/features/Auth/utils/authEventListener";
import { vi, type Mock } from "vitest";

vi.mock("@/contexts/AbilityContext", () => ({
  useAbility: vi.fn(() => ({ update: updateAbilitySpy })),
}));

vi.mock("@/lib/utils/ability", () => ({
  defineAbilityFor: vi.fn(),
}));

vi.mock("@/features/Auth/lib/api/auth", () => ({
  login: vi.fn(),
}));

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

vi.mock("@/features/Auth/utils/authEventListener", () => ({
  setupAuthLogoutListener: vi.fn(),
}));

vi.mock("@/features/Auth/hooks/useLogout", () => ({
  useLogout: vi.fn(() => ({
    logout: vi.fn(),
    clearAndRedirect: mockClearAndRedirect,
  })),
}));

const updateAbilitySpy = vi.fn();
const mockClearAndRedirect = vi.fn();
const mockLogin = login as Mock;
const mockJwtDecode = jwtDecode as Mock;
const mockDefineAbilityFor = defineAbilityFor as Mock;
const mockSetupAuthLogoutListener = setupAuthLogoutListener as Mock;

describe("useLogin", () => {
  const mockToken = "mock.jwt.token";
  const mockDecodedToken = {
    id: "user-123",
    username: "testuser",
    email: "test@example.com",
    roles: ["ROLE_USER"],
    exp: 1234567890,
  };
  const mockLoginResponse = { token: mockToken };

  const setup = () => renderHookTest({ hook: () => useLogin() });

  beforeEach(() => {
    signIn.mockReturnValue(true);
    mockDefineAbilityFor.mockReturnValue({ rules: [] });
  });

  describe("Initial state", () => {
    it("should return login function and initial states", () => {
      const { result } = setup();

      expect(result.current.login).toBeDefined();
      expect(typeof result.current.login).toBe("function");
      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("Successful login", () => {
    it("should call the login API with provided credentials", async () => {
      mockLogin.mockResolvedValueOnce(mockLoginResponse);
      mockJwtDecode.mockReturnValueOnce(mockDecodedToken);

      const { result } = setup();

      result.current.login({
        email: "test@example.com",
        password: "password123",
      });

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
        });
      });
    });

    it("should call signIn with correct auth and userState", async () => {
      mockLogin.mockResolvedValueOnce(mockLoginResponse);
      mockJwtDecode.mockReturnValueOnce(mockDecodedToken);

      const { result } = setup();

      result.current.login({
        email: "test@example.com",
        password: "password123",
      });

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith({
          auth: { token: mockToken, type: "Bearer" },
          userState: {
            id: mockDecodedToken.id,
            username: mockDecodedToken.username,
            email: mockDecodedToken.email,
            roles: mockDecodedToken.roles,
          },
        });
      });
    });

    it("should update ability with decoded token rules", async () => {
      mockLogin.mockResolvedValueOnce(mockLoginResponse);
      mockJwtDecode.mockReturnValueOnce(mockDecodedToken);

      const { result } = setup();

      result.current.login({
        email: "test@example.com",
        password: "password123",
      });

      await waitFor(() => {
        expect(mockDefineAbilityFor).toHaveBeenCalledWith(mockDecodedToken);
        expect(updateAbilitySpy).toHaveBeenCalledWith([]);
      });
    });

    it("should navigate to /user with replace after successful login", async () => {
      mockLogin.mockResolvedValueOnce(mockLoginResponse);
      mockJwtDecode.mockReturnValueOnce(mockDecodedToken);

      const { result } = setup();

      result.current.login({
        email: "test@example.com",
        password: "password123",
      });

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith("/user", { replace: true });
      });
    });

    it("should setup auth logout listener after successful login", async () => {
      mockLogin.mockResolvedValueOnce(mockLoginResponse);
      mockJwtDecode.mockReturnValueOnce(mockDecodedToken);

      const { result } = setup();

      result.current.login({
        email: "test@example.com",
        password: "password123",
      });

      await waitFor(() => {
        expect(mockSetupAuthLogoutListener).toHaveBeenCalledWith(
          mockClearAndRedirect
        );
      });
    });

    it("should not display error toast on successful login", async () => {
      mockLogin.mockResolvedValueOnce(mockLoginResponse);
      mockJwtDecode.mockReturnValueOnce(mockDecodedToken);

      const { result } = setup();

      result.current.login({
        email: "test@example.com",
        password: "password123",
      });

      await waitFor(() => {
        expect(navigate).toHaveBeenCalled();
      });

      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe("Login errors", () => {
    it("should display error toast when API returns an error", async () => {
      mockLogin.mockRejectedValueOnce(new Error("Bad credentials"));

      const { result } = setup();

      result.current.login({
        email: "test@example.com",
        password: "wrongpassword",
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Identifiants invalides", {
          description: "Vérifiez votre email et votre mot de passe.",
        });
      });
    });

    it("should display error toast when signIn returns false", async () => {
      mockLogin.mockResolvedValueOnce(mockLoginResponse);
      mockJwtDecode.mockReturnValueOnce(mockDecodedToken);
      signIn.mockReturnValueOnce(false);

      const { result } = setup();

      result.current.login({
        email: "test@example.com",
        password: "password123",
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Connexion impossible", {
          description:
            "Une erreur est survenue lors de la création de la session.",
        });
      });

      expect(mockSetupAuthLogoutListener).not.toHaveBeenCalled();
    });

    it("should display error toast when JWT decode throws", async () => {
      mockLogin.mockResolvedValueOnce(mockLoginResponse);
      mockJwtDecode.mockImplementationOnce(() => {
        throw new Error("Invalid token");
      });

      const { result } = setup();

      result.current.login({
        email: "test@example.com",
        password: "password123",
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Connexion impossible", {
          description:
            "Une erreur est survenue lors de la création de la session.",
        });
      });

      expect(mockSetupAuthLogoutListener).not.toHaveBeenCalled();
    });

    it("should not navigate when login fails", async () => {
      mockLogin.mockRejectedValueOnce(new Error("Bad credentials"));

      const { result } = setup();

      result.current.login({
        email: "test@example.com",
        password: "wrongpassword",
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });

      expect(navigate).not.toHaveBeenCalled();
    });

    it("should not update ability when login fails", async () => {
      mockLogin.mockRejectedValueOnce(new Error("Bad credentials"));

      const { result } = setup();

      result.current.login({
        email: "test@example.com",
        password: "wrongpassword",
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });

      expect(updateAbilitySpy).not.toHaveBeenCalled();
    });

    it("should not setup auth logout listener when login fails", async () => {
      mockLogin.mockRejectedValueOnce(new Error("Bad credentials"));

      const { result } = setup();

      result.current.login({
        email: "test@example.com",
        password: "wrongpassword",
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });

      expect(mockSetupAuthLogoutListener).not.toHaveBeenCalled();
    });
  });

  describe("Loading state", () => {
    it("should set isPending to true while login is in progress", async () => {
      mockLogin.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockLoginResponse), 100)
          )
      );
      mockJwtDecode.mockReturnValueOnce(mockDecodedToken);

      const { result } = setup();

      result.current.login({
        email: "test@example.com",
        password: "password123",
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });
    });
  });

  describe("Error state", () => {
    it("should set isError to true when login fails", async () => {
      mockLogin.mockRejectedValueOnce(new Error("Bad credentials"));

      const { result } = setup();

      result.current.login({
        email: "test@example.com",
        password: "wrongpassword",
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });

    it("should set error object when login fails", async () => {
      mockLogin.mockRejectedValueOnce(new Error("Bad credentials"));

      const { result } = setup();

      result.current.login({
        email: "test@example.com",
        password: "wrongpassword",
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });
  });

  describe("Multiple login attempts", () => {
    it("should handle multiple sequential login calls", async () => {
      mockLogin
        .mockResolvedValueOnce(mockLoginResponse)
        .mockResolvedValueOnce(mockLoginResponse);
      mockJwtDecode
        .mockReturnValueOnce(mockDecodedToken)
        .mockReturnValueOnce(mockDecodedToken);

      const { result } = setup();

      result.current.login({
        email: "test@example.com",
        password: "password123",
      });

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledTimes(1);
      });

      result.current.login({
        email: "test@example.com",
        password: "password123",
      });

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Different user roles", () => {
    it("should handle user with ROLE_ADMIN", async () => {
      const adminToken = {
        ...mockDecodedToken,
        roles: ["ROLE_USER", "ROLE_ADMIN"],
      };

      mockLogin.mockResolvedValueOnce(mockLoginResponse);
      mockJwtDecode.mockReturnValueOnce(adminToken);

      const { result } = setup();

      result.current.login({
        email: "admin@example.com",
        password: "password123",
      });

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith(
          expect.objectContaining({
            userState: expect.objectContaining({
              roles: ["ROLE_USER", "ROLE_ADMIN"],
            }),
          })
        );
      });
    });

    it("should handle user with ROLE_MODERATEUR", async () => {
      const modToken = {
        ...mockDecodedToken,
        roles: ["ROLE_USER", "ROLE_MODERATEUR"],
      };

      mockLogin.mockResolvedValueOnce(mockLoginResponse);
      mockJwtDecode.mockReturnValueOnce(modToken);

      const { result } = setup();

      result.current.login({
        email: "mod@example.com",
        password: "password123",
      });

      await waitFor(() => {
        expect(mockDefineAbilityFor).toHaveBeenCalledWith(modToken);
      });
    });
  });
});
