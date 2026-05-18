import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CatalogMenu from "@/features/Shop/components/Catalog/CatalogMenu";
import { CatalogProvider } from "@/features/Shop/contexts/CatalogContext";

export default function CatalogLayout() {
  const { t } = useTranslation("catalog");

  return (
    <>
      <Helmet>
        <title>{t("helmet.products.title")}</title>
        <meta name="description" content={t("helmet.products.description")} />
      </Helmet>
      <CatalogProvider>
        <div className="container mx-auto flex min-h-screen flex-col gap-6 px-4 pb-12 md:flex-row">
          <aside className="w-full shrink-0 md:w-72">
            <CatalogMenu />
          </aside>
          <section className="min-w-0 flex-1">
            <Outlet />
          </section>
        </div>
      </CatalogProvider>
    </>
  );
}
