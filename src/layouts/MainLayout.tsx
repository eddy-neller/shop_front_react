import { Link, Outlet, useLocation } from "react-router-dom";
import { Fragment, useEffect } from "react";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import Hero from "@/components/home/Hero";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

function MainLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const isAuthenticated = useIsAuthenticated();
  const { breadcrumbItems } = useBreadcrumb();

  useEffect(() => {
    if (!isAuthenticated && localStorage.getItem("_auth_shop")) {
      window.dispatchEvent(
        new CustomEvent("auth:logout", {
          detail: { reason: "expired" },
        })
      );
    }
  }, [isAuthenticated]);

  return (
    <>
      <Helmet>
        <title>E.N Shop</title>
        <meta
          name="description"
          content="Découvrez notre sélection de produits de qualité, soigneusement choisis pour vous offrir la meilleure expérience d'achat en ligne."
        />
      </Helmet>
      <ScrollToTop />
      <Header />
      <main>
        {isHomePage ? (
          <Hero />
        ) : (
          <Breadcrumb className="container mx-auto px-4 py-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbItems.map((item) => (
                <Fragment key={item.key}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {item.active ? (
                      <BreadcrumbPage>{item.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          to={item.linkProps?.to ?? "#"}
                          {...item.linkProps}
                        >
                          {item.title}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <Outlet />
        <Footer />
      </main>
      <Toaster />
    </>
  );
}

export default MainLayout;
