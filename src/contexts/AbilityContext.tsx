import { AppAbility, defineAbilityFor } from "@/lib/utils/ability";
import { ReactNode, createContext, useContext } from "react";
import { createContextualCan } from "@casl/react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { AuthUser } from "@/features/User/types/user";

export const AbilityContext = createContext<AppAbility>(defineAbilityFor(null));
AbilityContext.displayName = "AbilityContext";

export const Can = createContextualCan(AbilityContext.Consumer);

export const useAbility = () => {
  const ctx = useContext(AbilityContext);
  if (!ctx) throw new Error("useAbility must be used within a AbilityProvider");
  return ctx;
};

type AbilityProviderProps = {
  children: ReactNode;
};

export const AbilityProvider = ({ children }: AbilityProviderProps) => {
  const authUser = useAuthUser<AuthUser | null>();
  const ability = defineAbilityFor(authUser);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};
