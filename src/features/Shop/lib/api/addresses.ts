import httpClient from "@/lib/api/httpClient";
import type {
  ShopAddress,
  ShopAddressCreatePayload,
  ShopAddressUpdatePayload,
} from "@/features/Shop/types/address";

const ADDRESS_BASE_URL = "/shop/me/addresses";

export const getAddresses = async (): Promise<ShopAddress[]> => {
  const response = await httpClient.get<ShopAddress[]>(ADDRESS_BASE_URL);

  return response.data;
};

export const getAddress = async (id: string): Promise<ShopAddress> => {
  const response = await httpClient.get<ShopAddress>(
    `${ADDRESS_BASE_URL}/${id}`
  );

  return response.data;
};

export const createAddress = async (
  data: ShopAddressCreatePayload
): Promise<ShopAddress> => {
  const response = await httpClient.post<ShopAddress>(ADDRESS_BASE_URL, data);

  return response.data;
};

export const updateAddress = async (
  id: string,
  data: ShopAddressUpdatePayload
): Promise<ShopAddress> => {
  const response = await httpClient.patch<ShopAddress>(
    `${ADDRESS_BASE_URL}/${id}`,
    data,
    {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    }
  );

  return response.data;
};

export const deleteAddress = async (id: string): Promise<void> => {
  await httpClient.delete(`${ADDRESS_BASE_URL}/${id}`);
};
