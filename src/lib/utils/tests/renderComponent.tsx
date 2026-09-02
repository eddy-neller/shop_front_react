import "@/lib/utils/tests/mocks/mockAuthHelper";
import "@/i18n";
import { render } from "@testing-library/react";
import { vi } from "vitest";
import { AbilityContext } from "@/contexts/AbilityContext";
import { defineAbilityFor } from "@/lib/utils/ability";
import { UserType, userMap } from "@/lib/utils/tests/userTypes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { User } from "@/features/User/types/user";
import { CartContext } from "@/features/Shop/contexts/CartContext";

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

function createTestCart() {
  return {
    isAuthenticated: false,
    cart: undefined,
    isPending: false,
    itemCount: 0,
    isMutating: false,
    addToCart: vi.fn(),
    updateLine: vi.fn(),
    removeLine: vi.fn(),
    clearCart: vi.fn(),
  };
}

export const renderComponentQuery = (children: React.ReactNode) => {
  const queryClient = createTestQueryClient();
  const cartValue = createTestCart();

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <CartContext.Provider value={cartValue}>
          {children}
        </CartContext.Provider>
      </QueryClientProvider>
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
  const cartValue = createTestCart();

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <CartContext.Provider value={cartValue}>
          <AbilityContext.Provider value={ability}>
            {children}
          </AbilityContext.Provider>
        </CartContext.Provider>
      </QueryClientProvider>
    ),
    queryClient,
  };
};
