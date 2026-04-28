import { waitFor } from "@testing-library/react";
import { renderHookTest } from "@/lib/utils/tests/renderHook";
import { useUser } from "@/features/User/hooks/useUser";
import { getUser } from "@/features/User/lib/api/user";
import rawUser from "@/features/User/__tests__/fixtures/user-member.json";
import { User } from "@/features/User/types/user";
import { Mock, vi } from "vitest";

vi.mock("@/features/User/lib/api/user", () => ({
  getUser: vi.fn(),
}));

const mockGetUser = getUser as Mock;

describe("useUser", () => {
  const user: User = rawUser;

  const setup = (id?: string) => {
    return renderHookTest({ hook: () => useUser(id) });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return data successfully", async () => {
    mockGetUser.mockResolvedValueOnce(user);

    const { result } = setup(user.id);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(user);

    expect(getUser).toHaveBeenCalledWith(user.id);
  });

  it("should manage error successfully", async () => {
    const apiError = new Error("Erreur API");
    mockGetUser.mockRejectedValueOnce(apiError);

    const { result } = setup(user.id);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(apiError);

    expect(getUser).toHaveBeenCalledWith(user.id);
  });

  it("should return an error when refetching without id", async () => {
    const { result } = setup();

    result.current.refetch();

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(new Error("ID not found."));
    expect(getUser).not.toHaveBeenCalled();
  });
});
