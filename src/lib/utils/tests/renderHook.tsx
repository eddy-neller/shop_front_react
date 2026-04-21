import "@/lib/utils/tests/mocks/mockAuthHelper";
import "@/i18n";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

export const renderHookTest = ({
  hook,
  queryClient,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hook: () => any;
  queryClient?: QueryClient | undefined;
}) => {
  const client = queryClient || createTestQueryClient();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { ...renderHook(hook, { wrapper }), queryClient: client };
};
