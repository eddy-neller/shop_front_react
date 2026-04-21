import "@/utils/tests/mocks/mockAuthHelper";
import "@/utils/tests/mocks/mockRouterHelper";
import "@/utils/tests/mocks/mockToastify";
import { toast } from "@/utils/tests/mocks/mockToastify";
import { navigate } from "@/utils/tests/mocks/mockRouterHelper";
import { signIn } from "@/utils/tests/mocks/mockAuthHelper";
import { waitFor } from "@testing-library/react";
import { renderHookTest } from "@/utils/tests/renderHook";
import { useLogin } from "@/features/Auth/hooks/useLogin";
import { login } from "@/features/Auth/services/auth";
import { setupAuthLogoutListener } from "@/features/Auth/utils/authEventListener";

const updateAbilitySpy = vi.fn();
const clearAndRedirectSpy = vi.fn();

vi.mock("@/contexts/AbilityContext", () => ({
  useAbility: () => ({ update: updateAbilitySpy }),
}));

vi.mock("@/features/Auth/services/auth", () => ({
  login: vi.fn(),
}));

vi.mock("jwt-decode", () => ({
  jwtDecode: () => ({
    id: "1",
    username: "venom",
    email: "venom@example.com",
    roles: ["ROLE_USER"],
  }),
}));

vi.mock("@/features/Auth/utils/authEventListener", () => ({
  setupAuthLogoutListener: vi.fn(),
}));

vi.mock("@/features/Auth/hooks/useLogout", () => ({
  useLogout: () => ({ clearAndRedirect: clearAndRedirectSpy }),
}));

describe("useLogin", () => {
  it("exposes the current mutation state", () => {
    const { result } = renderHookTest({ hook: () => useLogin() });

    expect(typeof result.current.login).toBe("function");
    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("logs the user in successfully", async () => {
    vi.mocked(login).mockResolvedValueOnce({ token: "jwt-token" });
    signIn.mockReturnValueOnce(true);

    const { result } = renderHookTest({ hook: () => useLogin() });
    result.current.login({ email: "john@example.com", password: "Password1!" });

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: "john@example.com",
        password: "Password1!",
      });
      expect(signIn).toHaveBeenCalled();
      expect(updateAbilitySpy).toHaveBeenCalled();
      expect(setupAuthLogoutListener).toHaveBeenCalledWith(clearAndRedirectSpy);
      expect(navigate).toHaveBeenCalledWith("/user", { replace: true });
    });
  });

  it("shows an error toast when the login request fails", async () => {
    vi.mocked(login).mockRejectedValueOnce(new Error("bad credentials"));

    const { result } = renderHookTest({ hook: () => useLogin() });
    result.current.login({ email: "john@example.com", password: "wrong" });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
