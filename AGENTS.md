# Repository Guidelines

## Project Overview

E.N Shop React is a Vite 7, React 18, and TypeScript 5 frontend for an
e-commerce project backed by the Symfony/API Platform `en_shop_api` backend.
The current app covers public pages, authentication flows, and the authenticated
user area. `src/features/Shop` exists for shop domain types and fixtures, but
shop routes are not wired yet.

## Project Structure & Module Organization

Use the existing feature-first layout.

- `src/main.tsx`: React root, `QueryClientProvider`, React Query devtools.
- `src/App.tsx`: global providers for Helmet, breadcrumbs, auth, CASL ability,
  and routing.
- `src/routes.tsx`: centralized route tree.
- `src/layouts/`: shared layouts, currently `MainLayout`.
- `src/pages/`: generic public pages.
- `src/features/<Name>/`: domain code. Keep feature-specific `components`,
  `pages`, `hooks`, `schemas`, `types`, `lib/api`, `locales`, and `__tests__`
  inside the feature.
- `src/components/`: shared components and page blocks. `src/components/ui/`
  contains shadcn-style primitives.
- `src/lib/api/`: cross-cutting API clients, especially the shared Axios
  `httpClient`.
- `src/lib/utils/`: shared helpers, query keys, permission rules, test helpers,
  URL/static asset helpers, and error handling.
- `src/contexts/`: app-level React contexts.
- `src/locales/<lng>/`: global i18n JSON namespaces.
- `src/styles/`, `src/index.css`, `src/App.scss`: Tailwind base, Sass globals,
  variables, mixins, and legacy component styles.
- `public/` and `src/assets/`: static files and imported assets such as flags.

Tests mirror source ownership in `__tests__` folders or `*.test.ts(x)` files
under `src`.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json` for local work.
- `npm ci`: install exactly from the lockfile, preferred in CI.
- `npm run dev`: start Vite on port `4100`, bound to `0.0.0.0`.
- `npm run build`: run `tsc -b`, then create the production build in `dist/`.
- `npm run preview`: serve the built app locally.
- `npm run lint`: run ESLint across the repository.
- `npm run test`: run Vitest in watch mode.
- `npm run test:ci`: run the test suite once for CI-style checks.
- `npm run test:cov`: generate HTML coverage in `coverage/`.
- `npm run test-ui`: open the Vitest UI.
- `npm run prepare`: initialize Husky hooks after install.

Do not run `npm run build` while implementing a new frontend feature. During
feature work, use `npm run lint` and focused Vitest commands instead; reserve
the production build for explicit verification requests.

Useful focused test examples:

```bash
npx vitest run src/features/Auth/__tests__/hooks/useLogin.test.ts
npx vitest run -t "renders user profile"
```

## Runtime Architecture

The provider stack is:

```text
QueryClientProvider
HelmetProvider
BreadcrumbProvider
AuthProvider
AbilityProvider
RouterProvider
```

All routes live under `MainLayout`. Public routes are `/`, `/about`, and
`/contact`. Guest-only routes are wrapped in `GuestOnlyOutlet` and include
`/login`, `/register/*`, and `/forgot-password/*`. Authenticated routes are
wrapped in `AuthOutlet` and include `/user`, `/user/profile`, `/user/password`,
and `/user/avatar`.

`MainLayout` renders the homepage hero only on `/`; other pages show breadcrumb
items from `BreadcrumbContext`. Pages that need breadcrumbs should call
`setBreadcrumbItems` and cleanly reflect their translated title. `MainLayout`
also renders the Sonner `<Toaster />` and detects stale auth state
(`!isAuthenticated` while `_auth_shop` still exists) to dispatch `auth:logout`
with reason `expired`.

## Environment & Configuration

Vite reads public runtime variables through `import.meta.env`. `.env` documents
the variable names; keep developer-specific values in `.env.local`, which is
git-ignored. The known variables are:

```env
VITE_API_URL=/api
VITE_STATIC_URL=http://127.0.0.1:20900
```

`VITE_API_URL` may be relative, such as `/api`, or absolute in production.
`vite.config.ts` proxies `/api` to `http://localhost:20900` during development.
`src/lib/utils/url.ts` resolves uploaded/static backend files by passing
absolute URLs through unchanged, then preferring `VITE_STATIC_URL`, then falling
back to the origin of `VITE_API_URL`. Never hardcode backend hosts inside
components or API modules.

## Coding Style & Naming Conventions

The project uses strict TypeScript with `noUnusedLocals`,
`noUnusedParameters`, and `noUncheckedSideEffectImports`. Prefer explicit types
at API boundaries, form payloads, and reusable utilities.

Prettier settings are authoritative: 2 spaces, double quotes, semicolons,
trailing commas where valid in ES5, `printWidth: 80`, and LF endings. ESLint is
flat-config based with JS recommended, TypeScript ESLint recommended, React,
and React Hooks rules. React import in JSX files is not required.

Naming conventions:

- Components and pages: `PascalCase`, for example `LoginForm.tsx`.
- Hooks: `useXxx.ts`, for example `useUser.ts`.
- Schema factories: `createXxxSchema(t)`.
- Zod form types: `XxxFormData = z.infer<ReturnType<typeof createXxxSchema>>`.
- Utilities: descriptive `camelCase` or local kebab-case matching nearby files,
  for example `httpClient.ts` and `category-tree.ts`.
- Imports from `src`: use the `@/` alias instead of deep `../../` paths.

The `@/` alias is wired in `tsconfig.app.json`, `vite.config.ts`, and
`vitest.config.ts`; keep all three in sync if the alias changes.

Keep comments short and useful. Existing comments are often in French; do not
add English/French duplicates for self-explanatory code.

## API, Data Fetching & Errors

Always use `src/lib/api/httpClient.ts` for backend calls. It centralizes:

- `VITE_API_URL` base URL.
- `Authorization: Bearer <token>` from `localStorage._auth_shop`.
- `Accept-Language` from `i18nextLng` or browser language, clamped to `en` or
  `fr`.
- Automatic removal of `Content-Type` for `FormData`.
- 401 handling through `auth:logout` events for expired, invalid, or missing
  JWTs.
- `/login` and `/token/invalidate` are exempt from auto-logout handling.
- Unknown 401 responses silently clear auth token storage; network/no-response
  failures dispatch `auth:logout` with reason `others`.

Put feature-specific API calls in `src/features/<Feature>/lib/api/`. Use
`src/lib/api/` only for cross-cutting endpoints such as contact. Put TanStack
Query keys in `src/lib/utils/queryKeys.ts`; do not inline ad hoc query keys in
components. Current user factories are `userKeys.all`, `userKeys.me()`,
`userKeys.detail(id)`, and `userKeys.others(id)`. Authenticated queries should
be gated when appropriate, as `useMe` does with `useIsAuthenticated()`.

**Per-user data must avoid cross-account leaks** with two defenses: (1) index
the query key on the account id (`useAuthUser<AuthUser>()?.id`, e.g.
`cartKeys.mine(userId)` / `shopKeys.addresses(userId)`) and gate with
`enabled: !!userId` — critical for providers mounted above the router (e.g.
`CartProvider`) that never unmount and would otherwise reuse one account's cache
for the next; (2) `useLogout` purges `userKeys.all`, `cartKeys.all`, and
`shopKeys.all`, so add any new per-user key family there. References: `useCart`,
`useAddresses`.

Use `handleAxiosError(error, setError, true, defaultMessage)` in mutation error
handlers. It maps 422 `violations` onto `react-hook-form`, handles 403, 404,
429, 5xx, and network failures, and keeps toast behavior consistent.

Prefer `src/lib/utils/helper.ts` for new date, file-size, and string formatting
helpers. `format.ts` predates it and only exposes a subset. Use
`category-tree.ts` for nested category data used by `CategoryMenu`.

## Auth & Permissions

Auth is coordinated through `react-auth-kit`, JWT storage, and CASL ability
rules.

- Login flow: call `login`, decode the JWT, call `signIn`, update CASL ability,
  install the auth logout listener, then navigate to `/user`.
- Logout flow: use `useLogout` from React code. For non-React code such as
  Axios interceptors, dispatch the `auth:logout` custom event with a `reason`
  detail.
- Auto-logout clears the listener, removes `userKeys.all` queries, calls
  `signOut()`, resets ability rules, shows a reason-specific toast, and
  navigates to `/login`.
- Listener lifecycle: use `setupAuthLogoutListener` and
  `removeAuthLogoutListener`; do not add raw duplicate listeners.
- Storage keys: `_auth_shop`, `_auth_shop_type`, and `_auth_shop_state` are
  managed together by `removeAuthToken()`.

Permissions are defined in `src/lib/utils/ability.ts`. Roles inherit upward:
`ROLE_USER`, `ROLE_MODERATEUR`, `ROLE_ADMIN`. Gate UI with the exported CASL
`Can` component and extend `ROLE_PERMISSIONS` when new subjects/actions are
added. Current actions are `READ`, `CREATE`, `UPDATE`, `DELETE`, and
`MODERATE`; current subjects are `ADMIN_CONTENT`, `MODERATOR_CONTENT`, and
`MEMBER_CONTENT`. Prefer `<Can I={Action.READ} a={SubjectType.X}>` for gated
rendering.

## Forms & Validation

Forms use `react-hook-form`, `zodResolver`, and localized Zod schema factories.
Keep validation messages in i18n files, not hardcoded inside schemas. Use
project UI primitives such as `Field`, `FieldLabel`, `FieldContent`,
`FieldError`, `Input`, and `LoadingButton`. `LoadingButton` already handles
disabled and `aria-busy` states; prefer it for async submissions.

When adding password-like logic, reuse `PASSWORD_REGEX` and constants from
`src/lib/utils/form.ts`. For server-side validation, rely on
`handleAxiosError` to bind backend violations to form fields.

## Internationalization

Supported languages are `en` and `fr`; `en` is fallback. Language detection uses
`localStorage.i18nextLng`, then the browser. Resources are lazy-loaded in
`src/i18n.ts`.

Namespace locations:

- Global namespaces: `src/locales/<lng>/<namespace>.json`.
- Auth namespaces: `src/features/Auth/locales/<lng>/auth*.json`.
- User namespace: `src/features/User/locales/<lng>/user.json`.

When adding a namespace, create both `en` and `fr` files, register it in the
`ns` array in `src/i18n.ts`, and update the `resourcesToBackend` routing if it
lives outside `src/locales`. The header language switcher invalidates and
refetches active TanStack Query data so API responses follow the new
`Accept-Language` header.

## UI & Styling

Use Tailwind utility classes for layout and shadcn-style primitives from
`src/components/ui/` for common UI. `components.json` is configured for the
`new-york` style, neutral base color, TypeScript, CSS variables, and Lucide
icons. Prefer `lucide-react` icons for new controls.

Use the `cn()` helper from `src/lib/utils.ts` when composing conditional
Tailwind classes. Theme tokens are CSS variables in `src/index.css` and are
mapped through `tailwind.config.ts`. Sass globals and component styles live in
`src/styles/` and are imported by `src/App.scss`; avoid adding new global CSS
unless the styling is genuinely shared.

Use Sonner for toast feedback; the toaster is mounted in `MainLayout`.
`lucide-react` is preferred for new icons, while `react-icons` remains available
for legacy code. Dark mode is class-based in Tailwind; `next-themes` is
installed but not currently wired into the app.

Keep UI accessible: icon-only buttons need `aria-label`, form controls need
labels, loading states should expose status or busy state, and navigation should
use `Link`/`NavLink` instead of manual location changes.

## Testing Guidelines

Vitest runs with `jsdom`, Testing Library, globals, `src/setupTests.ts`, dot
reporter, and a 10 second timeout. Setup resets mocks, resets i18n to English,
cleans up React trees, and polyfills `scrollTo`, `URL.createObjectURL`, and
`matchMedia`.

Use the smallest existing helper:

- `renderPage(path, userType?, customUser?, initialState?)` for routed page
  integration tests. It uses the real route tree and mocks `AuthOutlet` to a
  passthrough `<Outlet />` so protected pages can render in tests.
- `renderComponentQuery(children)` for components needing React Query.
- `renderComponentAbility(children, userType?, customUser?)` for
  permission-aware components.
- `renderHookTest({ hook, queryClient? })` for hooks.

Mock helpers in `src/lib/utils/tests/mocks/` must be imported at the top of the
test file so their `vi.mock` side effects apply before imports under test. Use
`axiosHelper.ts` builders for Axios responses/errors instead of hand-rolled
objects.

Available mocks include `mockAuthHelper` for `react-auth-kit` hooks,
`mockRouterHelper` for router navigation/location/search params,
`mockToastHelper` for Sonner toasts, and `mockFunctionHelper` for stable
formatter output. Test user fixtures are exposed through `userTypes.ts` as
`UserAdmin`, `UserModer`, and `UserMember`.

For any per-user query, add a **cross-account leak test**: on a shared
`QueryClient`, render the hook with one `useAuthUser` id, then with another, and
assert the second account gets a fresh fetch and never the first account's
cached data. Models: `useCart.test.ts` and `useAddresses.test.ts`.

Coverage excludes framework glue such as contexts, layouts, `lib/api`,
`lib/utils`, types, UI primitives, `main.tsx`, `i18n.ts`, and the auth listener.
Still test these files when behavior is risky, but do not expect them to improve
coverage metrics.

## Common Contribution Patterns

- New API call: add it under the feature's `lib/api/<entity>.ts`, or
  `src/lib/api/` only when it is cross-cutting, and always call `httpClient`.
- New query: add a factory in `src/lib/utils/queryKeys.ts`, then use it from the
  hook or component.
- User-data mutation: invalidate or remove the relevant `userKeys.*` entries in
  `onSuccess`.
- User-scoped data: index the query key on the account id and gate with
  `enabled: !!userId`; ensure `useLogout` purges its key family. Prevents
  cross-account cache leaks. References: `useCart`, `useAddresses`.
- Guarded route: nest authenticated screens under `AuthOutlet` with fallback
  `/login`; nest guest-only flows under `GuestOnlyOutlet` with fallback `/user`.
- Translated screen: create both `en` and `fr` JSON namespace files, register
  the namespace in `src/i18n.ts`, then call `useTranslation("<namespace>")`.

## Commit & Pull Request Guidelines

The Git history is sparse and uses short imperative subjects such as
`Set Up Initial Tests`. Keep commit subjects concise, action-oriented, and
scoped to one change.

Husky pre-commit blocks commits on `main`/`master`, then runs `npm run lint` and
`npm run test:ci`. GitLab CI uses Node 20, installs dependencies, runs lint, and
runs `npm run test:cov` with `coverage/` as an artifact.

Pull requests or merge requests should include:

- Summary of behavior and affected routes/features.
- Linked issue when available.
- Test commands run and results.
- Screenshots or recordings for visible UI changes.
- Any required environment or backend assumptions.

## Security & Configuration Tips

Do not commit secrets, tokens, generated `coverage/`, `dist/`, `node_modules/`,
or local environment overrides. Only expose browser-readable variables with the
`VITE_` prefix. Treat JWT error codes in `src/lib/utils/errorCodes.ts` as a
frontend/backend contract and keep them synchronized with backend codes.

## Agent-Specific Instructions

Before editing, check `git status --short` and preserve user changes. Keep
changes scoped to the requested behavior and matching the existing architecture.
For new features, add or update tests near the code. For documentation-only
changes, tests are usually unnecessary; state that clearly in the final report.
Do not rewrite generated UI primitives or broad style files unless the task
requires it.
