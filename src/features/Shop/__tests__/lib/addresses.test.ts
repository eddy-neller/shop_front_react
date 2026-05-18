import { Mock, vi } from "vitest";
import httpClient from "@/lib/api/httpClient";
import {
  createAddress,
  deleteAddress,
  getAddress,
  getAddresses,
  updateAddress,
} from "@/features/Shop/lib/api/addresses";
import rawAddresses from "@/features/Shop/__tests__/fixtures/addresses.json";
import { makeAxiosResponse } from "@/lib/utils/tests/axiosHelper";
import type { ShopAddress } from "@/features/Shop/types/address";

vi.mock("@/lib/api/httpClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockGet = httpClient.get as Mock;
const mockPost = httpClient.post as Mock;
const mockPatch = httpClient.patch as Mock;
const mockDelete = httpClient.delete as Mock;

describe("shop addresses api", () => {
  const addresses = rawAddresses as ShopAddress[];
  const payload = {
    name: "Home",
    firstname: "Jean",
    lastname: "Dupont",
    company: null,
    address: "12 rue de la Paix",
    zip: "75001",
    city: "Paris",
    country: "France",
    phone: "+33 1 23 45 67 89",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads addresses without pagination params", async () => {
    mockGet.mockResolvedValueOnce(makeAxiosResponse(addresses));

    const result = await getAddresses();

    expect(httpClient.get).toHaveBeenCalledWith("/shop/me/addresses");
    expect(result).toEqual(addresses);
  });

  it("loads one address by id", async () => {
    mockGet.mockResolvedValueOnce(makeAxiosResponse(addresses[0]));

    const result = await getAddress(addresses[0].id);

    expect(httpClient.get).toHaveBeenCalledWith(
      `/shop/me/addresses/${addresses[0].id}`
    );
    expect(result).toEqual(addresses[0]);
  });

  it("creates an address", async () => {
    mockPost.mockResolvedValueOnce(makeAxiosResponse(addresses[0], 201));

    const result = await createAddress(payload);

    expect(httpClient.post).toHaveBeenCalledWith("/shop/me/addresses", payload);
    expect(result).toEqual(addresses[0]);
  });

  it("updates an address with merge-patch content type", async () => {
    mockPatch.mockResolvedValueOnce(makeAxiosResponse(addresses[0]));

    const result = await updateAddress(addresses[0].id, { name: "Updated" });

    expect(httpClient.patch).toHaveBeenCalledWith(
      `/shop/me/addresses/${addresses[0].id}`,
      { name: "Updated" },
      {
        headers: {
          "Content-Type": "application/merge-patch+json",
        },
      }
    );
    expect(result).toEqual(addresses[0]);
  });

  it("deletes an address", async () => {
    mockDelete.mockResolvedValueOnce(makeAxiosResponse(null, 204, "No Content"));

    await deleteAddress(addresses[0].id);

    expect(httpClient.delete).toHaveBeenCalledWith(
      `/shop/me/addresses/${addresses[0].id}`
    );
  });
});
