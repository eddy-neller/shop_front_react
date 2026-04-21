import { useQuery } from "@tanstack/react-query";
import { getMe, getUser } from "@/features/User/lib/api/user";
import { User } from "@/features/User/types/user";
import { userKeys } from "@/lib/utils/queryKeys";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

export const useUser = (id: string | undefined) => {
  return useQuery<User>({
    queryKey: userKeys.detail(id),
    queryFn: () => {
      if (!id) throw new Error("ID not found.");
      return getUser(id);
    },
    enabled: !!id,
  });
};

export const useMe = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery<User>({
    queryKey: userKeys.me(),
    queryFn: getMe,
    enabled: isAuthenticated,
  });
};
