# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E.N Shop React — frontend e-commerce SPA built on **React 18 + Vite 7 + TypeScript 5 (strict)**. Talks to the Symfony/API Platform backend `en_shop_api`. Currently ships the public site, full auth flow (login / register / activation / password reset), and an authenticated user space (dashboard / profile / avatar / password). The `Shop` feature directory exists but is not yet wired into the routes.

## Commands

```bash
npm install          # Dev install (resolves package-lock.json)
npm ci               # Strict install from lockfile — preferred in CI
npm run dev          # Vite dev server on :4100, binds 0.0.0.0
npm run build        # tsc -b (project refs) + Vite production build → dist/
npm run preview      # Serve the dist/ build locally
npm run lint         # ESLint 9 (flat config)
npm run test         # Vitest watch mode
npm run test:ci      # Vitest single run (used by pre-commit hook)
npm run test:cov     # Coverage HTML report → coverage/
npm run test-ui      # Vitest UI
npm run prepare      # Initialize Husky (auto-run on install)
```

Run a single test or a filtered subset:
```bash
npx vitest run src/features/Auth/__tests__/hooks/useLogin.test.ts
npx vitest run -t "should call signIn with correct auth"
```

## Environment

`.env` defines the variable names; per-developer values go in `.env.local` (git-ignored). Both are read by Vite's `import.meta.env`.

```env
VITE_API_URL=/api                       # Base URL for httpClient (relative or absolute)
VITE_STATIC_URL=http://127.0.0.1:20900  # Optional; absolute URL for static assets (avatars, etc.)
```

`VITE_API_URL` may be relative (`/api`) — the dev server proxies `/api` to `http://localhost:20900` (see `vite.config.ts`). In production it is typically an absolute URL.

`resolveStaticUrl()` in `src/lib/utils/url.ts` resolves user-uploaded asset paths: it prefers `VITE_STATIC_URL`, falls back to the origin of `VITE_API_URL`, and passes through absolute URLs untouched.

**Never hardcode a backend host** in components or API modules — always go through `VITE_API_URL` / `VITE_STATIC_URL` (directly or via `httpClient` / `resolveStaticUrl`).

## Pre-commit Hook (Husky)

`.husky/pre-commit`:
1. **Refuses commits on `main` / `master`** (use a feature branch; `--no-verify` only in emergencies).
2. Runs `npm run lint`.
3. Runs `npm run test:ci`.

If you push directly to `main` you bypass the hook — don't.

## Path Alias

`@/` → `src/`. Wired in `tsconfig.app.json` (`paths`), `vite.config.ts`, and `vitest.config.ts`. Always import via `@/...`, never relative `../../...`.

## Architecture

### Provider Stack

`src/main.tsx` mounts `QueryClientProvider` → `<App />`. Inside `App.tsx` (outermost → innermost):

```
QueryClientProvider          // TanStack Query (one shared client)
└─ HelmetProvider            // <head> management
   └─ BreadcrumbProvider     // global breadcrumb state
      └─ AuthProvider        // react-auth-kit (store: name "_auth_shop", type "localstorage")
         └─ AbilityProvider  // CASL ability derived from auth user
            └─ RouterProvider
```

A `<Toaster />` from `sonner` is rendered inside `MainLayout`.

### Routing (`src/routes.tsx`)

All routes share `MainLayout`. Three access tiers:
- **Public**: `/`, `/about`, `/contact`
- **Guest-only** (`GuestOnlyOutlet`, redirects authenticated users to `/user`):
  `/login`, `/register` (+ `/success`, `/validation`, `/validation/success`),
  `/forgot-password` (+ `/success`, `/reset`)
- **Auth-required** (`@auth-kit/react-router/AuthOutlet`, fallback `/login`):
  `/user`, `/user/profile`, `/user/password`, `/user/avatar`

`MainLayout` renders `<Hero />` on `/`, otherwise renders the breadcrumb chain from `BreadcrumbContext`. It also detects "stale token" state (`!isAuthenticated && localStorage._auth_shop`) and dispatches `auth:logout` with `reason: "expired"`.

Pages that live below `/` should populate the breadcrumb on mount by calling `setBreadcrumbItems([...])` from `useBreadcrumb()`, using **translated** titles. Items have shape `{ key, title, active?, linkProps? }` — set `active: true` on the trailing item.

### Feature-First Layout

Each feature in `src/features/<Name>/` is self-contained:
```
components/  pages/  hooks/  schemas/ (Zod)  types/
lib/api/     (feature-scoped axios calls)
locales/<lng>/<ns>.json
utils/       (feature-scoped utilities)
__tests__/   (mirrors source layout: components/, hooks/, pages/, fixtures/)
```

Existing features: `Auth`, `User`, `Shop` (types only; not yet routed).
Public-page components without a feature live in `src/components/<topic>/` (e.g. `home/Hero.tsx`, `contact/ContactForm.tsx`, `not-found/BackButton.tsx`).

### Shared Infrastructure (`src/lib/`)

- **`lib/api/httpClient.ts`** — single Axios instance. Reads `VITE_API_URL`, injects `Authorization: Bearer <token>` from `localStorage._auth_shop`, sets `Accept-Language` from `i18nextLng` (clamped to `fr` or `en`), strips `Content-Type` for `FormData`. Response interceptor maps 401s to `auth:logout` events using `ERROR_CODES.JWT.*` from `lib/utils/errorCodes.ts` (synced with the backend's `InfoCodes.php`):
  - `EXPIRED_TOKEN` → `reason: "expired"`
  - `INVALID_TOKEN` → `reason: "invalid"`
  - `MISSING_TOKEN` → `reason: "missing"`
  - other 401 → silent token cleanup
  - network/no-response → `reason: "others"`
  - `/login` and `/token/invalidate` are exempt (don't trigger auto-logout).
- **`lib/api/contact.ts`** — top-level (non-feature) API call.
- **`lib/utils/queryKeys.ts`** — TanStack Query key factories. Add new keys here, never inline. Current: `userKeys.all | me() | detail(id) | others(id)`.
- **`lib/utils/ability.ts`** — CASL setup. Roles `ROLE_USER < ROLE_MODERATEUR < ROLE_ADMIN` with hierarchical inheritance. Subjects: `ADMIN_CONTENT`, `MODERATOR_CONTENT`, `MEMBER_CONTENT`. Use the `<Can I={Action.READ} a={SubjectType.X}>` component from `contexts/AbilityContext.tsx` (and `Can not` for negation). On login, `useLogin` calls `ability.update(defineAbilityFor(decoded).rules)`; on logout, `useLogout` resets it.
- **`lib/utils/axiosErrorHandler.ts`** — centralized form-error handler. Maps **422 violations** onto `react-hook-form` via `setError(violation.propertyPath, ...)`, plus toast-friendly messages for 403/404/429/5xx/network errors. Canonical call shape in mutation `onError`: `handleAxiosError(error, setError, true, defaultMessage)`.
- **`lib/utils/errorCodes.ts`** — `ERROR_CODES.JWT.*` (sync'd with backend `InfoCodes.php`). Extend here when the backend adds new code families.
- **`lib/utils/url.ts`** — `resolveStaticUrl(path)` for backend-served files; `getStaticBaseUrl()` resolves the asset origin.
- **`lib/utils/format.ts` / `helper.ts`** — date/string formatters (`formatDate`, `diffForHumans`, `truncate`, `formatFileSize`, `coupeMot`, `supRepLettre`). `helper.ts` is the canonical export; `format.ts` predates it and only ships a subset (`formatDate`, `coupeMot`, `supRepLettre`). Prefer `helper.ts` for new code.
- **`lib/utils/category-tree.ts`** — types/helpers for nested category trees (used by `CategoryMenu`).
- **`lib/utils/form.ts`** — shared form constants (`ADDON_W`, `PASSWORD_REGEX`).
- **`lib/utils.ts`** — shadcn's `cn(...)` (clsx + tailwind-merge).

### Auth Flow (Read This Before Touching Auth)

Auth state lives in **two coordinated places** — `react-auth-kit`'s store and the JWT in `localStorage._auth_shop`:

1. **Login** (`features/Auth/hooks/useLogin.ts`):
   POST `/login` → decode JWT → `signIn({ auth: { token, type: "Bearer" }, userState: { id, username, email, roles } })` → `ability.update(defineAbilityFor(decoded).rules)` → `setupAuthLogoutListener(clearAndRedirect)` → `navigate("/user", { replace: true })`.
2. **Auto-logout**: anywhere in the app, dispatch `window.dispatchEvent(new CustomEvent("auth:logout", { detail: { reason } }))`. The listener registered at login calls `clearAndRedirect(reason)` from `useLogout`, which: removes the listener, removes user queries (`userKeys.all`), `signOut()`, resets ability, shows a localized toast keyed by reason (`expired` | `invalid` | `missing` | `others`), then `navigate("/login", { replace: true })`.
3. **Listener lifecycle** is centralized in `features/Auth/utils/authEventListener.ts` (singleton: `setup`/`remove`/`isActive`). Don't add raw `window.addEventListener("auth:logout", ...)` calls — go through these helpers to avoid duplicates.
4. **Token storage**: `react-auth-kit` writes `_auth_shop`, `_auth_shop_type`, `_auth_shop_state` to `localStorage`. `removeAuthToken()` clears all three.

When extending auth, **prefer dispatching `auth:logout` events** over calling `useLogout` directly from non-React code (axios interceptors, the layout's stale-token check, etc.).

### i18n (`src/i18n.ts`)

- Languages: `en` (default + fallback) and `fr`. Persisted in `localStorage.i18nextLng`.
- Detection order: `localStorage` then `navigator`.
- **Lazy-loaded namespaces** via `i18next-resources-to-backend`:
  - Global namespaces (`common`, `navbar`, `home`, `about`, `contact-us`, `notFound`, `contact`) → `src/locales/<lng>/<ns>.json`
  - Auth namespaces — anything starting with `auth-` plus the bare `auth` namespace → `src/features/Auth/locales/<lng>/<ns>.json`
  - `user` namespace → `src/features/User/locales/<lng>/<ns>.json`
- When **adding a new namespace**: register it in the `ns` array of `src/i18n.ts`, ensure both `en` and `fr` JSON files exist, and add a routing rule to the `resourcesToBackend` callback if the namespace lives outside `src/locales/`.
- The header language switcher (`components/layout/Header.tsx`) calls `queryClient.invalidateQueries()` + `refetchQueries({ type: "active" })` after `i18n.changeLanguage` so server data re-fetches with the new `Accept-Language` header.

### Forms

Standard pattern (e.g. `LoginForm.tsx`): `react-hook-form` + `zodResolver` + Zod **schema factory** that takes a `TFunction` for localized messages (`createLoginSchema(t)`). **Validation messages must come from i18n** (`t("...")`) — never hardcode strings inside Zod schemas. UI primitives are shadcn-style components in `src/components/ui/` (`Field`, `FieldLabel`, `FieldContent`, `FieldError`, `FieldGroup`). Submit buttons use the project's `LoadingButton` (combines `Button` + `Spinner`, manages `aria-busy` and `disabled`). Server-side validation errors are mapped to form fields via `handleAxiosError(error, setError, true, defaultMessage)`.

For password-related logic, **reuse `PASSWORD_REGEX` and constants from `src/lib/utils/form.ts`** rather than redefining them per schema.

### UI Layer

- **shadcn-ui** ("new-york" style, base color `neutral`, no RSC) — generated components live in `src/components/ui/`, configured in `components.json`. CSS variables are defined in `src/index.css`; Tailwind's color tokens (`primary`, `muted`, `destructive`, …) map to `hsl(var(--token))` via `tailwind.config.ts`.
- **Sass globals** in `src/styles/` (`_globals.scss`, `_mixins.scss`, `_variables.scss`) imported by `src/App.scss`.
- **Icons**: `lucide-react` (preferred, set as `iconLibrary` in components.json) + `react-icons` for legacy.
- **Toasts**: `sonner` (`<Toaster />` in `MainLayout`).
- **Dark mode**: class-based (`darkMode: ["class"]`) — `next-themes` is installed but not yet wired up.

**Accessibility expectations** (enforced by review, not by lint):
- Icon-only buttons need an `aria-label`.
- Form controls need an associated label (`<FieldLabel htmlFor=...>` or `<label>`).
- Loading/busy states must expose `role="status"` (Spinner) or `aria-busy` (LoadingButton).
- Use `<Link>` / `<NavLink>` for navigation, never manual `window.location` mutations.

## Testing

### Configuration

- **Vitest 4 + jsdom**, globals enabled (`describe`, `it`, `expect`, `vi` are ambient — `tsconfig.app.json` has `"types": ["vitest/globals"]`).
- Test discovery: `src/**/*.test.{ts,tsx}` and `src/**/__tests__/**/*.{ts,tsx}`.
- Setup file `src/setupTests.ts`: imports `@testing-library/jest-dom/vitest`, resets `i18n` to `en` before each test, polyfills `scrollTo` / `URL.createObjectURL` / `matchMedia`, and trims Testing Library's verbose DOM dump (only the first error line + roles list is suppressed). `vi.clearAllMocks()` runs before each test; `cleanup()` after.
- Reporter: `dot`. Test timeout: **10 s**.
- **Coverage exclusions** (`vitest.config.ts`): `contexts/`, `layouts/`, `lib/api/`, `lib/utils/`, `types/`, `components/ui/`, `main.tsx`, `i18n.ts`, `features/Auth/utils/authEventListener.ts`. Don't write tests against these expecting them to count toward coverage — they're considered framework glue.

### Render Helpers (`src/lib/utils/tests/`)

Pick the **smallest helper that fits**, never re-build providers manually:

- **`renderPage(path, userType?, customUser?, initialState?)`** (`renderPage.tsx`) — renders the full app via `createMemoryRouter(AppRoutes)` with HelmetProvider + BreadcrumbProvider + AbilityContext + QueryClientProvider + Suspense. Mocks `AuthOutlet` to a passthrough `<Outlet />` so protected pages render unconditionally. Use for **page integration tests**.
- **`renderComponentQuery(children)` / `renderComponentAbility(children, userType?, customUser?)`** (`renderComponent.tsx`) — narrower providers for **component-level** tests.
- **`renderHookTest({ hook, queryClient? })`** (`renderHook.tsx`) — wraps in `QueryClientProvider` for **hook tests**.
- All three create a fresh `QueryClient` with `retry: false`, `staleTime: 0`, `gcTime: 0` and auto-import `mockAuthHelper` + `i18n`.

### Mock Helpers (`src/lib/utils/tests/mocks/`)

Import them at the **top of the test file** to apply their `vi.mock(...)` side effects globally:
- **`mockAuthHelper.ts`** — mocks all `react-auth-kit/hooks/*`. Exports `signIn` / `signOut` spies.
- **`mockRouterHelper.tsx`** — mocks `react-router-dom`. Replaces `Link` / `NavLink` with an anchor that calls `preventDefault()` so jsdom doesn't navigate. Exports `navigate`, `location` (plus `setLocation(over)`), and `useSearchParams` (plus `setSearchParams(qs)`).
- **`mockToastHelper.ts`** — mocks `sonner`'s `toast.{success,error,warning,info}` (preserves the rest of the module).
- **`mockFunctionHelper.ts`** — mocks `@/lib/utils/helper.ts` formatters (date/file-size/string utils) so date-driven snapshots stay stable.

### Axios Builders (`src/lib/utils/tests/axiosHelper.ts`)

`makeAxiosResponse`, `AxiosResponseOK`, `makeAxiosError`, `makeValidationError422(violations)`, `makeRateLimitError429(message?, retryAfterSeconds?)` — use these instead of hand-rolling `AxiosError` / `AxiosResponse` (axios v1 expects `InternalAxiosRequestConfig`, the helpers stub it).

### Test Fixtures & User Types

`src/lib/utils/tests/userTypes.ts` exposes `userMap: { UserAdmin, UserModer, UserMember }` backed by the JSON fixtures in `src/features/User/__tests__/fixtures/`. Pass `"UserAdmin" | "UserModer" | "UserMember"` to the render helpers to get the corresponding ability + auth state. There's also `user-member-empty.json` for the "minimal-data" case.

### Test Generation Conventions (mandatory — base every generated test on this)

All generated tests **must** follow these conventions, derived from the existing test suite. Do not invent patterns not listed here.

#### File structure and import order

Imports must appear in this exact order — mock side-effect imports first, then everything else:

```typescript
// 1. Mock side-effect imports (must precede component imports so vi.mock hoisting works)
import "@/lib/utils/tests/mocks/mockAuthHelper";
import "@/lib/utils/tests/mocks/mockRouterHelper";
import "@/lib/utils/tests/mocks/mockToastHelper";
import "@/lib/utils/tests/mocks/mockFunctionHelper"; // only when testing date/string formatters

// 2. Named exports from mock helpers (after the side-effect import of the same file)
import { signIn, signOut } from "@/lib/utils/tests/mocks/mockAuthHelper";
import { navigate, toast } from "@/lib/utils/tests/mocks/mockToastHelper";

// 3. Testing library + vitest
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, type Mock } from "vitest";

// 4. Render helpers
import { renderPage } from "@/lib/utils/tests/renderPage";
import { renderComponentQuery, renderComponentAbility } from "@/lib/utils/tests/renderComponent";
import { renderHookTest } from "@/lib/utils/tests/renderHook";

// 5. Axios builders
import { makeAxiosResponse, makeAxiosError, makeValidationError422 } from "@/lib/utils/tests/axiosHelper";

// 6. Fixtures and types
import rawUser from "@/features/User/__tests__/fixtures/user-admin.json";
import type { User } from "@/features/User/types/user";

// 7. vi.mock declarations (module mocks hoisted by Vitest)
vi.mock("@/features/Shop/lib/api/addresses", () => ({
  getAddresses: vi.fn(),
}));

// 8. Subject under test
import { ComponentOrHook } from "@/features/...";
```

#### Choosing the right render helper

| Scenario | Helper |
|---|---|
| Full page with routing, breadcrumb, Helmet | `renderPage(path, userType?)` |
| Component using `useQuery` / `useMutation` | `renderComponentQuery(<Component />)` |
| Component using `<Can>` or `useAbility()` | `renderComponentAbility(<Component />, userType?)` |
| Custom hook (React Query or standalone) | `renderHookTest({ hook: () => useMyHook() })` |

Never build providers manually — always use the helpers above.

#### Setup function pattern

Every `describe` block exposes a local `setup()` function. Render once per test, never share render state across tests:

```typescript
describe("ComponentName", () => {
  const setup = (overrides?: Partial<Props>) => {
    return renderComponentQuery(<Component {...overrides} />);
  };

  it("should render correctly", () => {
    setup();
    expect(screen.getByRole("heading", { name: /title/i })).toBeInTheDocument();
  });
});
```

#### Mock patterns

**API functions**: cast the import to `Mock` at the top of the describe block, then use `mockResolvedValueOnce` / `mockRejectedValueOnce` per test:

```typescript
import { getAddresses } from "@/features/Shop/lib/api/addresses";
const mockGetAddresses = getAddresses as Mock;

it("loads addresses", async () => {
  mockGetAddresses.mockResolvedValueOnce(makeAxiosResponse(addresses));
  // ...
});
```

**Hook returns**: mock hooks with `mockReturnValue` in `beforeEach`, then override per test:

```typescript
import { useMe } from "@/features/User/hooks/useMe";
vi.mock("@/features/User/hooks/useMe");

beforeEach(() => {
  vi.mocked(useMe).mockReturnValue({ data: user, isPending: false, isError: false });
});
```

**spyOn**: use `vi.spyOn` only for methods on already-constructed objects (e.g. `queryClient`, `i18n`). Never spyOn a module function that could be mocked with `vi.mock`.

#### Assertions and selectors

Prefer selectors in this priority order: ARIA role → label → placeholder → visible text → `data-testid` (last resort).

```typescript
// ✅ preferred
screen.getByRole("button", { name: /sign in/i });
screen.getByLabelText(/email address/i);
screen.getByPlaceholderText(/name@example\.com/i);

// ✅ async variants
await screen.findByRole("alert");
await waitFor(() => expect(result.current.isSuccess).toBe(true));

// ⚠️ last resort
screen.getByTestId("my-element");
```

Use `within(container)` when multiple identical elements exist in the DOM:

```typescript
const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
expect(within(nav).getByRole("link", { name: "Home" })).toBeInTheDocument();
```

#### Async interactions

Always set up `userEvent` before rendering:

```typescript
it("submits the form", async () => {
  const user = userEvent.setup();
  setup();

  await user.type(screen.getByLabelText(/email/i), "test@example.com");
  await user.click(screen.getByRole("button", { name: /submit/i }));

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({ email: "test@example.com" });
  });
});
```

#### Testing React Query hooks

```typescript
describe("useAddresses", () => {
  const setup = () => renderHookTest({ hook: () => useAddresses() });

  it("returns addresses on success", async () => {
    mockGetAddresses.mockResolvedValueOnce(makeAxiosResponse(addresses));
    const { result } = setup();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(addresses);
  });

  it("invalidates cache on mutation", async () => {
    mockCreateAddress.mockResolvedValueOnce(makeAxiosResponse(newAddress));
    const { result, queryClient } = renderHookTest({ hook: () => useCreateAddress() });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    result.current.mutate(payload);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: expect.arrayContaining(["shop", "addresses"]) })
    );
  });
});
```

#### Fixtures

Store test data as JSON in `src/features/<Feature>/__tests__/fixtures/`. Type-cast on import — never inline large objects in test files:

```typescript
import rawAddresses from "@/features/Shop/__tests__/fixtures/addresses.json";
import type { Address } from "@/features/Shop/types/address";
const addresses = rawAddresses as Address[];
```

#### Describe / it naming

- `describe`: component or hook name, exactly as exported (`"AddressForm"`, `"useAddresses"`). Nest with a topic string for grouping (`"validation"`, `"on success"`, `"loading state"`).
- `it`: starts with `"should"` + present-tense verb. Always in **English**.

```typescript
describe("AddressForm", () => {
  describe("validation", () => {
    it("should show required field errors on empty submission", async () => { ... });
    it("should accept a valid address", async () => { ... });
  });
  describe("on submit error", () => {
    it("should map 422 violations onto form fields", async () => { ... });
    it("should display a toast on 500 error", async () => { ... });
  });
});
```

#### What to cover per file type

| File type | Minimum coverage |
|---|---|
| Page component | renders without crashing; Helmet title; breadcrumb items; loading state (spinner); error state; happy-path data display |
| Form component | renders fields; client-side validation errors; successful submission (API called with correct payload, toast shown, navigation triggered); 422 violations mapped to fields; loading button disabled while submitting |
| Hook (query) | success path; error path; correct query key used |
| Hook (mutation) | success path (correct API called, cache invalidated / refetched); error path (toast or `setError`); loading state |
| Non-form component | renders given props; conditional rendering branches |

#### Reusable test utilities

`src/lib/utils/tests/base-tests.ts` exposes helpers like `expectSpinnerWhileLoading()`. Use them instead of duplicating the same assertions across files.

## Code Conventions

- **TypeScript strict** + `noUnusedLocals` + `noUnusedParameters` + `noUncheckedSideEffectImports`. The build will fail on dead code or unused parameters — prefix unused args with `_` only when truly intentional.
- **ESLint flat config** (`eslint.config.js`): JS recommended + TypeScript ESLint recommended + React + React Hooks. `react/react-in-jsx-scope` is off (the JSX runtime is `react-jsx`). Vite/Vitest/Tailwind config files are ignored.
- **Prettier**: 2-space indent, double quotes, semicolons, trailing commas `es5`, `printWidth: 80`, `arrowParens: always`, LF line endings.
- **File / symbol naming**: `PascalCase` for components and pages (`LoginForm.tsx`, `UserHomePage.tsx`), `camelCase` for hooks/utils (`useLogin.ts`, `format.ts`). Schema factories are `createXxxSchema`, types are `XxxFormData = z.infer<...>`.
- **Imports**: always `@/` absolute. Group order in practice: external libs, then `@/...`.
- **Locale of comments and toasts**: French (this is the project's working language; commit messages and runtime UI strings are bilingual via i18n, but inline comments are predominantly French).
- **Test titles** (`describe` / `it` strings): always in **English**. This matches the existing test suite and keeps output readable in CI regardless of locale.

## Common Patterns

- **Adding an API call**: put it in the feature's `lib/api/<entity>.ts` (or `src/lib/api/` if cross-cutting). Always go through the shared `httpClient` so auth/locale/FormData handling stays consistent.
- **Adding a new query**: add the key factory to `lib/utils/queryKeys.ts`, then write the hook (e.g. `useThing(id)`) using `useQuery` + that key. Gate authenticated queries with `enabled: useIsAuthenticated()` (see `useMe`).
- **Adding a new mutation that touches user data**: invalidate or remove `userKeys.*` in `onSuccess`. On logout the queryClient's `userKeys.all` is removed by `useLogout` — don't duplicate that elsewhere.
- **Adding a permission-gated UI**: wrap with `<Can I={Action.READ} a={SubjectType.X}>`. Add the corresponding `can(...)` rule in `ROLE_PERMISSIONS` inside `lib/utils/ability.ts` if it's a new (action, subject) pair. Subjects are role-keyed (`ADMIN_CONTENT` etc.) and inherited via `ROLE_HIERARCHY`.
- **Adding a guarded route**: nest under `<Route element={<AuthOutlet fallbackPath="/login" />}>` in `routes.tsx`. For guest-only flows, use the local `<GuestOnlyOutlet fallbackPath="/user" />`.
- **Adding a translated screen**: create `<ns>.json` files under the appropriate `locales/<lng>/`, register the namespace in `src/i18n.ts` (and the `resourcesToBackend` routing if outside `src/locales/`), then `useTranslation("<ns>")` in the component.

## CI

GitLab CI uses **Node 20**, runs `npm ci`, then `npm run lint`, then `npm run test:cov`. The `coverage/` directory is uploaded as an artifact. Keep tests fast and deterministic — no real network calls, no real timers without `vi.useFakeTimers()`.

## Commits & Pull Requests

Commit subjects: short, imperative, scoped to one change (existing examples: `Set Up Initial Tests`, `Initial commit`). The pre-commit hook blocks `main`/`master` and runs lint + tests; bypassing with `--no-verify` is for emergencies only.

PR / MR description should include:
- Summary of behavior and the affected routes/features.
- Linked issue if any.
- Test commands run + their results.
- Screenshots / recordings for visible UI changes.
- Any required env vars or backend assumptions.

## Security

- Never commit secrets, `.env.local`, generated `coverage/` / `dist/`, or `node_modules/`.
- Only `VITE_`-prefixed variables reach the browser bundle. Anything sensitive must stay backend-side.
- `src/lib/utils/errorCodes.ts` is a **frontend ↔ backend contract** mirrored from `InfoCodes.php`. Keep it in sync; a desync silently breaks the JWT-driven auto-logout reasons.

## Agent Workflow

- Run `git status --short` before editing — never overwrite uncommitted user work.
- Keep diffs scoped to the requested change; match existing architecture instead of refactoring opportunistically.
- For new features, add or update tests next to the code (mirroring `__tests__/` layout).
- Doc-only changes don't require tests — say so explicitly in the final report.
- Don't rewrite generated UI primitives in `src/components/ui/` or broad style files unless the task requires it.
