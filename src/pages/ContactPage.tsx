import ContactForm from "@/components/contact/ContactForm";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

export default function ContactPage() {
  const { t } = useTranslation("contact-us");
  const { setBreadcrumbItems } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbItems([{ key: "contact", title: t("title"), active: true }]);
  }, [setBreadcrumbItems, t]);

  return (
    <>
      <Helmet>
        <title>{t("helmet.title")}</title>
        <meta name="description" content={t("helmet.description")} />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t("hero.title")}
              </h1>
              <p className="text-gray-600">{t("hero.description")}</p>
            </div>

            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
