import "@/lib/utils/tests/mocks/mockAuthHelper";
import "@/lib/utils/tests/mocks/mockRouterHelper";
import "@/lib/utils/tests/mocks/mockToastHelper";
import { toast } from "@/lib/utils/tests/mocks/mockToastHelper";
import { navigate } from "@/lib/utils/tests/mocks/mockRouterHelper";
import { signOut } from "@/lib/utils/tests/mocks/mockAuthHelper";
import { renderHookTest } from "@/lib/utils/tests/renderHook";
import { useLogout } from "@/features/Auth/hooks/useLogout";
import { defineAbilityFor } from "@/lib/utils/ability";
import { removeAuthLogoutListener } from "@/features/Auth/utils/authEventListener";
import { vi, type Mock } from "vitest";

const updateAbilitySpy = vi.fn();

vi.mock("@/contexts/AbilityContext", () => ({
  useAbility: vi.fn(() => ({ update: updateAbilitySpy })),
}));

vi.mock("@/lib/utils/ability", () => ({
  defineAbilityFor: vi.fn(),
}));

vi.mock("@/features/Auth/utils/authEventListener", () => ({
  removeAuthLogoutListener: vi.fn(),
}));

const mockDefineAbilityFor = defineAbilityFor as Mock;
const mockRemoveAuthLogoutListener = removeAuthLogoutListener as Mock;

describe("useLogout", () => {
  const setup = () => renderHookTest({ hook: () => useLogout() });

  beforeEach(() => {
    signOut.mockReturnValue(true);
    mockDefineAbilityFor.mockReturnValue({ rules: [] });
  });

  it("should return logout function", () => {
    const { result } = setup();

    expect(result.current.logout).toBeDefined();
    expect(typeof result.current.logout).toBe("function");
  });

  it("should return clearAndRedirect function", () => {
    const { result } = setup();

    expect(result.current.clearAndRedirect).toBeDefined();
    expect(typeof result.current.clearAndRedirect).toBe("function");
  });

  it("should call signOut, update ability, remove queries and navigate when logout is called", () => {
    const { result } = setup();

    result.current.logout();

    expect(mockRemoveAuthLogoutListener).toHaveBeenCalled();
    expect(signOut).toHaveBeenCalled();
    expect(mockDefineAbilityFor).toHaveBeenCalledWith(null);
    expect(updateAbilitySpy).toHaveBeenCalledWith([]);
    expect(navigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  it("should call removeAuthLogoutListener when logout is called", () => {
    const { result } = setup();

    result.current.logout();

    expect(mockRemoveAuthLogoutListener).toHaveBeenCalled();
  });

  it("should not display toast when logout is called manually without reason", () => {
    const { result } = setup();

    result.current.logout();

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.warning).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.info).not.toHaveBeenCalled();
  });

  it("should handle clearAndRedirect with 'expired' reason and display warning toast", () => {
    const { result } = setup();

    result.current.clearAndRedirect("expired");

    expect(mockRemoveAuthLogoutListener).toHaveBeenCalled();
    expect(toast.warning).toHaveBeenCalledWith("Session expirée", {
      description: "Votre session a expiré. Veuillez vous reconnecter.",
    });
    expect(signOut).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  it("should handle clearAndRedirect with 'invalid' reason and display error toast", () => {
    const { result } = setup();

    result.current.clearAndRedirect("invalid");

    expect(mockRemoveAuthLogoutListener).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Session invalide", {
      description:
        "Votre token de session est invalide. Veuillez vous reconnecter.",
    });
    expect(signOut).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  it("should handle clearAndRedirect with 'missing' reason and display info toast", () => {
    const { result } = setup();

    result.current.clearAndRedirect("missing");

    expect(mockRemoveAuthLogoutListener).toHaveBeenCalled();
    expect(toast.info).toHaveBeenCalledWith("Authentification requise", {
      description: "Veuillez vous connecter pour accéder à cette page.",
    });
    expect(signOut).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  it("should handle clearAndRedirect with unknown reason and display default error toast", () => {
    const { result } = setup();

    result.current.clearAndRedirect("unknown_reason");

    expect(mockRemoveAuthLogoutListener).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Accès non autorisé", {
      description:
        "Vous n'êtes pas autorisé à accéder à cette ressource. Veuillez vous reconnecter.",
    });
    expect(signOut).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  it("should fallback to 'others' for unrecognized reasons", () => {
    const { result } = setup();

    result.current.clearAndRedirect("some_random_reason");

    expect(mockRemoveAuthLogoutListener).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Accès non autorisé", {
      description:
        "Vous n'êtes pas autorisé à accéder à cette ressource. Veuillez vous reconnecter.",
    });
    expect(signOut).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  it("should handle clearAndRedirect without reason and not display toast", () => {
    const { result } = setup();

    result.current.clearAndRedirect();

    expect(mockRemoveAuthLogoutListener).toHaveBeenCalled();
    expect(signOut).toHaveBeenCalled();
    expect(mockDefineAbilityFor).toHaveBeenCalledWith(null);
    expect(updateAbilitySpy).toHaveBeenCalledWith([]);
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.warning).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.info).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  it("should handle multiple logout calls without issues", () => {
    const { result } = setup();

    result.current.logout();
    result.current.logout();

    expect(signOut).toHaveBeenCalledTimes(2);
    expect(navigate).toHaveBeenCalledTimes(2);
  });
});
