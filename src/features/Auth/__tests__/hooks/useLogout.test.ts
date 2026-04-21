import "@/utils/tests/mocks/mockAuthHelper";
import "@/utils/tests/mocks/mockRouterHelper";
import "@/utils/tests/mocks/mockToastify";
import { toast } from "@/utils/tests/mocks/mockToastify";
import { navigate } from "@/utils/tests/mocks/mockRouterHelper";
import { signOut } from "@/utils/tests/mocks/mockAuthHelper";
import { renderHookTest } from "@/utils/tests/renderHook";
import { useLogout } from "@/features/Auth/hooks/useLogout";

const updateAbilitySpy = vi.fn();
const removeQueriesSpy = vi.fn();
const removeAuthLogoutListenerSpy = vi.fn();

vi.mock("@/contexts/AbilityContext", () => ({
  useAbility: () => ({ update: updateAbilitySpy }),
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query"
  );

  return {
    ...actual,
    useQueryClient: () => ({ removeQueries: removeQueriesSpy }),
  };
});

vi.mock("@/features/Auth/utils/authEventListener", () => ({
  removeAuthLogoutListener: () => removeAuthLogoutListenerSpy(),
}));

describe("useLogout", () => {
  it("logs out and redirects to the login page", () => {
    const { result } = renderHookTest({ hook: () => useLogout() });
    result.current.logout();

    expect(signOut).toHaveBeenCalled();
    expect(updateAbilitySpy).toHaveBeenCalled();
    expect(removeQueriesSpy).toHaveBeenCalled();
    expect(removeAuthLogoutListenerSpy).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  it("shows the session-expired toast when a reason is provided", () => {
    const { result } = renderHookTest({ hook: () => useLogout() });
    result.current.clearAndRedirect("expired");

    expect(toast.warning).toHaveBeenCalledWith("Session expirée", {
      description: "Votre session a expiré. Veuillez vous reconnecter.",
    });
  });
});
