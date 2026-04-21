import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("common");

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer.brand")}</h3>
            <p className="text-gray-400">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t("footer.navigation.title")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footer.navigation.home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footer.navigation.contact")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t("footer.contact.title")}
            </h4>
            <p className="text-gray-400">
              {t("footer.contact.emailLabel")}: {t("footer.contact.email")}
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {t("footer.copyrightBrand")}{" "}
            {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
