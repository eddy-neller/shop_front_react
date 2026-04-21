import "@/lib/utils/tests/mocks/mockAuthHelper";
import "@/i18n";
import { render } from "@testing-library/react";
import { AbilityContext } from "@/contexts/AbilityContext";
import { defineAbilityFor } from "@/utils/ability";
import { UserType, userMap } from "@/lib/utils/tests/userTypes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { User } from "@/features/User/types/user";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  });
}

export const renderComponentQuery = (children: React.ReactNode) => {
  const queryClient = createTestQueryClient();

  return {
    ...render(
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    queryClient,
  };
};

export const renderComponentAbility = (
  children: React.ReactNode,
  typeUser?: UserType,
  customUser?: User
) => {
  const queryClient = createTestQueryClient();

  const user = typeUser ? userMap[typeUser] : customUser;
  const ability = defineAbilityFor(user);

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <AbilityContext.Provider value={ability}>
          {children}
        </AbilityContext.Provider>
      </QueryClientProvider>
    ),
    queryClient,
  };
};
