import { vi } from "vitest";
import type { Location as RouterLocation } from "react-router-dom";

export const navigate = vi.fn();

// fabrique une Location avec des valeurs par défaut
const makeLocation = (over: Partial<RouterLocation> = {}): RouterLocation => ({
  pathname: "/",
  search: "",
  hash: "",
  state: null,
  key: "test",
  ...over,
});

// vi.fn qui RETOURNE une Location
export const location = vi.fn<() => RouterLocation>(() => makeLocation());

// helper pour ajuster la valeur retournée par useLocation()
export const setLocation = (over: Partial<Location>) => {
  location.mockReturnValue(makeLocation(over));
};

// Mock pour useSearchParams
export const useSearchParams = vi.fn(() => [new URLSearchParams(), vi.fn()]);

// helper pour ajuster la valeur retournée par useSearchParams()
export const setSearchParams = (searchParams: string) => {
  useSearchParams.mockReturnValue([new URLSearchParams(searchParams), vi.fn()]);
};

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom"
    );

  // ⬇⬇ garde onClick, className, id, etc.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Anchor = ({ to, children, onClick, ...rest }: any) => {
    const href = typeof to === "string" ? to : (to?.pathname ?? "#");
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault(); // ⬅️ empêche jsdom de "naviguer"
      onClick?.(e); // ⬅️ déclenche tes handlers (closeAuthNow, etc.)
    };

    return (
      <a href={href} onClick={handleClick} {...rest}>
        {children}
      </a>
    );
  };

  return {
    ...actual,
    Link: Anchor,
    NavLink: Anchor,
    useNavigate: () => navigate,
    useLocation: () => location(),
    useSearchParams: () => useSearchParams(),
  };
});
