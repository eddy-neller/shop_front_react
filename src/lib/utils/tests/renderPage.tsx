import "@/lib/utils/tests/mocks/mockAuthHelper";
import "@/i18n";
import { Suspense } from "react";
import { render } from "@testing-library/react";
import {
  createMemoryRouter,
  createRoutesFromElements,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "@/routes";
import { UserType, userMap } from "@/lib/utils/tests/userTypes";
import { AbilityContext } from "@/contexts/AbilityContext";
import { defineAbilityFor } from "@/lib/utils/ability";
import { CartProvider } from "@/features/Shop/contexts/CartContext";
import { User } from "@/features/User/types/user";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
    },
  },
});

// Unlock protected pages
vi.mock("@auth-kit/react-router/AuthOutlet", () => ({
  default: () => {
    return <Outlet />;
  },
}));

export const renderPage = (
  initialPath = "/",
  typeUser?: UserType,
  customUser?: User,
  initialState?: unknown
) => {
  const user = typeUser ? userMap[typeUser] : customUser;
  const ability = defineAbilityFor(user);

  const router = createMemoryRouter(createRoutesFromElements(AppRoutes), {
    initialEntries: [
      typeof initialState !== "undefined"
        ? { pathname: initialPath, state: initialState }
        : initialPath,
    ],
  });

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <BreadcrumbProvider>
            <AbilityContext.Provider value={ability}>
              <Suspense fallback={null}>
                <CartProvider>
                  <RouterProvider router={router} />
                </CartProvider>
              </Suspense>
            </AbilityContext.Provider>
          </BreadcrumbProvider>
        </HelmetProvider>
      </QueryClientProvider>
    ),
    queryClient,
  };
};
