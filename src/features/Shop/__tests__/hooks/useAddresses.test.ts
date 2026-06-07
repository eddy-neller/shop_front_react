import { waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { renderHookTest } from "@/lib/utils/tests/renderHook";
import {
  useAddresses,
  useAddress,
  useCreateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useUpdateAddress,
} from "@/features/Shop/hooks/useAddresses";
import {
  getAddresses,
  getAddress,
  createAddress,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
} from "@/features/Shop/lib/api/addresses";
import rawAddresses from "@/features/Shop/__tests__/fixtures/addresses.json";
import type {
  ShopAddress,
  ShopAddressCreatePayload,
  ShopAddressUpdatePayload,
} from "@/features/Shop/types/address";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

vi.mock("@/features/Shop/lib/api/addresses", () => ({
  getAddresses: vi.fn(),
  getAddress: vi.fn(),
  createAddress: vi.fn(),
  updateAddress: vi.fn(),
  deleteAddress: vi.fn(),
  setDefaultAddress: vi.fn(),
}));

const mockGetAddresses = getAddresses as Mock;
const mockGetAddress = getAddress as Mock;
const mockCreateAddress = createAddress as Mock;
const mockUpdateAddress = updateAddress as Mock;
const mockDeleteAddress = deleteAddress as Mock;
const mockSetDefaultAddress = setDefaultAddress as Mock;

describe("useAddresses hooks", () => {
  const addresses = rawAddresses as ShopAddress[];
  const address = addresses[0];

  beforeEach(() => {
    vi.mocked(useIsAuthenticated).mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("useAddresses", () => {
    it("loads the address list", async () => {
      mockGetAddresses.mockResolvedValueOnce(addresses);

      const { result } = renderHookTest({ hook: () => useAddresses() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(addresses);
      expect(getAddresses).toHaveBeenCalled();
    });

    it("does not fetch when the user is not authenticated", () => {
      vi.mocked(useIsAuthenticated).mockReturnValue(false);

      const { result } = renderHookTest({ hook: () => useAddresses() });

      expect(result.current.fetchStatus).toBe("idle");
      expect(getAddresses).not.toHaveBeenCalled();
    });

    it("handles an API error", async () => {
      mockGetAddresses.mockRejectedValueOnce(new Error("API error"));

      const { result } = renderHookTest({ hook: () => useAddresses() });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(new Error("API error"));
    });
  });

  describe("useAddress", () => {
    it("loads an address by id", async () => {
      mockGetAddress.mockResolvedValueOnce(address);

      const { result } = renderHookTest({
        hook: () => useAddress(address.id),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(address);
      expect(getAddress).toHaveBeenCalledWith(address.id);
    });

    it("does not fetch without an id", () => {
      const { result } = renderHookTest({
        hook: () => useAddress(undefined),
      });

      expect(result.current.fetchStatus).toBe("idle");
      expect(getAddress).not.toHaveBeenCalled();
    });

    it("does not fetch when the user is not authenticated", () => {
      vi.mocked(useIsAuthenticated).mockReturnValue(false);

      const { result } = renderHookTest({
        hook: () => useAddress(address.id),
      });

      expect(result.current.fetchStatus).toBe("idle");
      expect(getAddress).not.toHaveBeenCalled();
    });

    it("throws when queryFn is called without an id", async () => {
      const { result } = renderHookTest({
        hook: () => useAddress(undefined),
      });

      const refetchResult = await result.current.refetch();

      expect(refetchResult.isError).toBe(true);
      expect((refetchResult.error as Error).message).toBe("ID not found.");
    });

    it("handles an API error", async () => {
      mockGetAddress.mockRejectedValueOnce(new Error("API error"));

      const { result } = renderHookTest({
        hook: () => useAddress(address.id),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(new Error("API error"));
    });
  });

  describe("useCreateAddress", () => {
    const payload: ShopAddressCreatePayload = {
      name: "Bureau",
      firstname: "Jean",
      lastname: "Dupont",
      address: "1 rue de la Paix",
      zip: "75001",
      city: "Paris",
      country: "France",
      phone: "+33 1 00 00 00 00",
    };

    it("creates an address and returns the created resource", async () => {
      mockCreateAddress.mockResolvedValueOnce(address);

      const { result } = renderHookTest({ hook: () => useCreateAddress() });

      result.current.mutate(payload);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(address);
      expect(createAddress).toHaveBeenCalledWith(payload);
    });

    it("invalidates the addresses cache after creation", async () => {
      mockCreateAddress.mockResolvedValueOnce(address);
      mockGetAddresses.mockResolvedValue(addresses);

      const { result, queryClient } = renderHookTest({
        hook: () => useCreateAddress(),
      });

      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      result.current.mutate(payload);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ["shop", "addresses"] })
      );
    });

    it("handles an API error", async () => {
      mockCreateAddress.mockRejectedValueOnce(new Error("API error"));

      const { result } = renderHookTest({ hook: () => useCreateAddress() });

      result.current.mutate(payload);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(new Error("API error"));
    });
  });

  describe("useUpdateAddress", () => {
    const payload: ShopAddressUpdatePayload = { city: "Lyon" };
    const updatedAddress: ShopAddress = { ...address, city: "Lyon" };

    it("updates an address and returns the updated resource", async () => {
      mockUpdateAddress.mockResolvedValueOnce(updatedAddress);

      const { result } = renderHookTest({ hook: () => useUpdateAddress() });

      result.current.mutate({ id: address.id, data: payload });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(updatedAddress);
      expect(updateAddress).toHaveBeenCalledWith(address.id, payload);
    });

    it("updates the individual address cache entry after update", async () => {
      mockUpdateAddress.mockResolvedValueOnce(updatedAddress);

      const { result, queryClient } = renderHookTest({
        hook: () => useUpdateAddress(),
      });

      const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

      result.current.mutate({ id: address.id, data: payload });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(setQueryDataSpy).toHaveBeenCalledWith(
        ["shop", "address", address.id],
        updatedAddress
      );
    });

    it("invalidates the addresses cache after update", async () => {
      mockUpdateAddress.mockResolvedValueOnce(updatedAddress);

      const { result, queryClient } = renderHookTest({
        hook: () => useUpdateAddress(),
      });

      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      result.current.mutate({ id: address.id, data: payload });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ["shop", "addresses"] })
      );
    });

    it("handles an API error", async () => {
      mockUpdateAddress.mockRejectedValueOnce(new Error("API error"));

      const { result } = renderHookTest({ hook: () => useUpdateAddress() });

      result.current.mutate({ id: address.id, data: payload });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(new Error("API error"));
    });
  });

  describe("useDeleteAddress", () => {
    it("deletes an address", async () => {
      mockDeleteAddress.mockResolvedValueOnce(undefined);

      const { result } = renderHookTest({ hook: () => useDeleteAddress() });

      result.current.mutate(address.id);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(deleteAddress).toHaveBeenCalledWith(address.id);
    });

    it("invalidates the addresses cache after deletion", async () => {
      mockDeleteAddress.mockResolvedValueOnce(undefined);

      const { result, queryClient } = renderHookTest({
        hook: () => useDeleteAddress(),
      });

      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      result.current.mutate(address.id);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ["shop", "addresses"] })
      );
    });

    it("handles an API error", async () => {
      mockDeleteAddress.mockRejectedValueOnce(new Error("API error"));

      const { result } = renderHookTest({ hook: () => useDeleteAddress() });

      result.current.mutate(address.id);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(new Error("API error"));
    });
  });

  describe("useSetDefaultAddress", () => {
    it("sets an address as default", async () => {
      mockSetDefaultAddress.mockResolvedValueOnce(address);

      const { result } = renderHookTest({
        hook: () => useSetDefaultAddress(),
      });

      result.current.mutate(address.id);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(address);
      expect(setDefaultAddress).toHaveBeenCalledWith(address.id);
    });

    it("updates caches after setting the default address", async () => {
      mockSetDefaultAddress.mockResolvedValueOnce(address);

      const { result, queryClient } = renderHookTest({
        hook: () => useSetDefaultAddress(),
      });
      const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      result.current.mutate(address.id);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(setQueryDataSpy).toHaveBeenCalledWith(
        ["shop", "address", address.id],
        address
      );
      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ["shop", "addresses"] })
      );
    });

    it("handles an API error", async () => {
      mockSetDefaultAddress.mockRejectedValueOnce(new Error("API error"));

      const { result } = renderHookTest({
        hook: () => useSetDefaultAddress(),
      });

      result.current.mutate(address.id);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(new Error("API error"));
    });
  });
});
