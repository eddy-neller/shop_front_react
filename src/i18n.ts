import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

i18n
  .use(LanguageDetector)
  .use(
    resourcesToBackend((lng: string, ns: string) => {
      // Détection automatique de tous les namespaces Auth
      if (ns === "auth" || ns.startsWith("auth-")) {
        return import(`@/features/Auth/locales/${lng}/${ns}.json`);
      }
      if (ns === "user") {
        return import(`@/features/User/locales/${lng}/${ns}.json`);
      }
      if (
        ns === "catalog" ||
        ns === "addresses" ||
        ns === "cart" ||
        ns === "shop-common"
      ) {
        return import(`@/features/Shop/locales/${lng}/${ns}.json`);
      }
      return import(`@/locales/${lng}/${ns}.json`);
    })
  )
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "fr"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    interpolation: {
      escapeValue: false,
    },
    // Resources are loaded on-demand via resourcesToBackend
    ns: [
      "common",
      "navbar",
      "home",
      "about",
      "contact-us",
      "notFound",
      "auth",
      "auth-forgotPassword",
      "auth-register",
      "auth-registerValidation",
      "contact",
      "user",
      "catalog",
      "addresses",
      "cart",
      "shop-common",
    ],
    defaultNS: "common",
    react: {
      useSuspense: true,
    },
  });

export default i18n;
