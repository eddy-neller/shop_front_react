import { waitFor } from "@testing-library/react";
import { renderHookTest } from "@/lib/utils/tests/renderHook";
import { useMe } from "@/features/User/hooks/useUser";
import { getMe } from "@/features/User/lib/api/user";
import rawUser from "@/features/User/__tests__/fixtures/user-admin.json";
import { User } from "@/features/User/types/user";
import { Mock, vi } from "vitest";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

vi.mock("@/features/User/lib/api/user", () => ({
  getMe: vi.fn(),
}));

const mockGetMe = getMe as Mock;

describe("useMe", () => {
  const user: User = rawUser;

  const setup = () => {
    return renderHookTest({
      hook: () => useMe(),
    });
  };

  beforeEach(() => {
    vi.mocked(useIsAuthenticated).mockReturnValue(true);
    localStorage.setItem("_auth_shop", "test-token");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should return data successfully", async () => {
    mockGetMe.mockResolvedValueOnce(user);

    const { result } = setup();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(user);
    expect(getMe).toHaveBeenCalled();
  });

  it("should manage error successfully", async () => {
    mockGetMe.mockRejectedValueOnce(new Error("Erreur API"));

    const { result } = setup();

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(new Error("Erreur API"));

    expect(getMe).toHaveBeenCalled();
  });
});
