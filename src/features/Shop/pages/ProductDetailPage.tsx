import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { PackageSearch } from "lucide-react";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useProduct } from "@/features/Shop/hooks/useShop";
import { formatPrice } from "@/lib/utils/helper";
import { resolveStaticUrl } from "@/lib/utils/url";
import ErrorLoadingCard from "@/components/ErrorLoadingCard";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation("shop");
  const navigate = useNavigate();
  const { setBreadcrumbItems } = useBreadcrumb();
  const { data: product, isPending, isError } = useProduct(id);

  useEffect(() => {
    setBreadcrumbItems([
      {
        key: "products",
        title: t("title"),
        active: false,
        linkProps: { to: "/products" },
      },
      {
        key: "product",
        title: product?.title ?? t("detail.breadcrumb"),
        active: true,
      },
    ]);
  }, [product?.title, setBreadcrumbItems, t]);

  if (isPending) return <Spinner loading={isPending} />;
  if (isError || !product) {
    return <ErrorLoadingCard message={t("errors.loadProduct")} />;
  }

  const imageUrl = resolveStaticUrl(product.imageUrl ?? undefined);
  const formattedPrice = formatPrice(product.price, i18n.language);

  return (
    <>
      <Helmet>
        <title>{t("helmet.detail.title", { title: product.title })}</title>
        <meta
          name="description"
          content={product.subtitle || product.description}
        />
      </Helmet>
      <div className="container mx-auto min-h-screen px-4 pb-12">
        <Button
          type="button"
          variant="outline"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          {t("detail.backToProducts")}
        </Button>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-muted">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <PackageSearch
                className="h-24 w-24 text-muted-foreground"
                aria-hidden="true"
              />
            )}
          </div>
          <article className="space-y-5">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.title}
              </h1>
              <p className="mt-3 text-md text-muted-foreground">
                {product.subtitle}
              </p>
            </div>
            <p className="text-3xl font-bold text-primary">{formattedPrice}</p>
            <div className="prose max-w-none text-gray-700">
              <p>{product.description}</p>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
