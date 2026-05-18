import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import {
  createAddress,
  deleteAddress,
  getAddress,
  getAddresses,
  updateAddress,
} from "@/features/Shop/lib/api/addresses";
import type {
  ShopAddress,
  ShopAddressCreatePayload,
  ShopAddressUpdatePayload,
} from "@/features/Shop/types/address";
import { shopKeys } from "@/lib/utils/queryKeys";

export const useAddresses = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery<ShopAddress[]>({
    queryKey: shopKeys.addresses(),
    queryFn: getAddresses,
    enabled: isAuthenticated,
  });
};

export const useAddress = (id: string | undefined) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery<ShopAddress>({
    queryKey: shopKeys.address(id),
    queryFn: () => {
      if (!id) {
        throw new Error("ID not found.");
      }

      return getAddress(id);
    },
    enabled: isAuthenticated && !!id,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ShopAddressCreatePayload) => createAddress(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shopKeys.addresses() });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ShopAddressUpdatePayload;
    }) => updateAddress(id, data),
    onSuccess: (address) => {
      queryClient.setQueryData(shopKeys.address(address.id), address);
      void queryClient.invalidateQueries({ queryKey: shopKeys.addresses() });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shopKeys.addresses() });
    },
  });
};
