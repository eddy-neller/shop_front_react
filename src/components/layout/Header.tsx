import { Link, NavLink, useLocation } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import AuthNav from "@/features/Auth/components/AuthNav";
import UserNav from "@/features/User/components/UserNav";
import { cn } from "@/lib/utils";
import usFlag from "@/assets/flags/us.svg";
import frFlag from "@/assets/flags/fr.svg";

export default function Header() {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation("navbar");

  const navItems = [
    { href: "/about", label: t("about") },
    { href: "/products", label: t("products") },
    { href: "/contact", label: t("contact") },
  ];

  const locales = [
    {
      code: "en",
      imgSrc: usFlag,
      alt: t("switchToEnglish"),
    },
    {
      code: "fr",
      imgSrc: frFlag,
      alt: t("switchToFrench"),
    },
  ] as const;

  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;

  const handleChangeLang = async (code: string) => {
    if (currentLanguage.startsWith(code)) {
      return;
    }

    await i18n.changeLanguage(code);
    await queryClient.invalidateQueries();
    await queryClient.refetchQueries({ type: "active" });
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
            <Link
              to="/"
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
            >
              E.N Shop
            </Link>
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "relative rounded-lg px-4 py-2 text-base font-medium transition-all duration-300",
                      "active:scale-95 before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:h-0.5 before:w-0 before:bg-blue-600 before:transition-all before:duration-300 hover:before:w-3/4",
                      isActive
                        ? "text-blue-600 before:w-3/4"
                        : "text-gray-700 hover:text-blue-600"
                    )}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            {!isAuthenticated ? <AuthNav /> : <UserNav />}
            <div
              className="flex items-center gap-2"
              aria-label={t("languageSwitcher")}
            >
              {locales.map((locale) => {
                const isActive = currentLanguage.startsWith(locale.code);

                return (
                  <button
                    key={locale.code}
                    type="button"
                    onClick={() => void handleChangeLang(locale.code)}
                    aria-label={locale.alt}
                    aria-pressed={isActive}
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300",
                      isActive
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-blue-300"
                    )}
                  >
                    <img
                      src={locale.imgSrc}
                      alt={locale.alt}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
