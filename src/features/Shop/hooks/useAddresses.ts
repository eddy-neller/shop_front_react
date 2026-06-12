import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {
  createAddress,
  deleteAddress,
  getAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "@/features/Shop/lib/api/addresses";
import type {
  ShopAddress,
  ShopAddressCreatePayload,
  ShopAddressUpdatePayload,
} from "@/features/Shop/types/address";
import type { AuthUser } from "@/features/User/types/user";
import { shopKeys } from "@/lib/utils/queryKeys";

const useUserId = () => useAuthUser<AuthUser | null>()?.id;

export const useAddresses = () => {
  const userId = useUserId();

  return useQuery<ShopAddress[]>({
    queryKey: shopKeys.addresses(userId),
    queryFn: getAddresses,
    enabled: !!userId,
  });
};

export const useAddress = (id: string | undefined) => {
  const userId = useUserId();

  return useQuery<ShopAddress>({
    queryKey: shopKeys.address(userId, id),
    queryFn: () => {
      if (!id) {
        throw new Error("ID not found.");
      }

      return getAddress(id);
    },
    enabled: !!userId && !!id,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: (data: ShopAddressCreatePayload) => createAddress(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: shopKeys.addresses(userId),
      });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ShopAddressUpdatePayload;
    }) => updateAddress(id, data),
    onSuccess: (address) => {
      queryClient.setQueryData(shopKeys.address(userId, address.id), address);
      void queryClient.invalidateQueries({
        queryKey: shopKeys.addresses(userId),
      });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: shopKeys.addresses(userId),
      });
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();

  return useMutation({
    mutationFn: (id: string) => setDefaultAddress(id),
    onSuccess: (address) => {
      queryClient.setQueryData(shopKeys.address(userId, address.id), address);
      void queryClient.invalidateQueries({
        queryKey: shopKeys.addresses(userId),
      });
    },
  });
};
