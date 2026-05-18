import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import type { Product } from "@/features/Shop/types/catalog";

export default function HomePage() {
  const { t } = useTranslation("home");

  const featuredProducts: Product[] = [
    {
      id: "1",
      name: t("featured.products.0.name"),
      description: t("featured.products.0.description"),
      price: 99.99,
      image: "/api/placeholder/300/200",
      category: t("featured.products.0.category"),
    },
    {
      id: "2",
      name: t("featured.products.1.name"),
      description: t("featured.products.1.description"),
      price: 49.99,
      image: "/api/placeholder/300/200",
      category: t("featured.products.1.category"),
    },
    {
      id: "3",
      name: t("featured.products.2.name"),
      description: t("featured.products.2.description"),
      price: 29.99,
      image: "/api/placeholder/300/200",
      category: t("featured.products.2.category"),
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Produits en vedette */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("featured.title")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("featured.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col overflow-hidden">
              <div className="h-48 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">
                  {t("featured.imagePlaceholder")}
                </span>
              </div>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center justify-between mt-auto">
                <span className="text-2xl font-bold text-primary">
                  {product.price.toFixed(2)} €
                </span>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-100 font-medium"
                >
                  {t("featured.cta")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Section À propos */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t("benefits.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t("benefits.items.fastDelivery.title")}
                </h3>
                <p className="text-gray-600">
                  {t("benefits.items.fastDelivery.description")}
                </p>
              </div>
              <div>
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t("benefits.items.quality.title")}
                </h3>
                <p className="text-gray-600">
                  {t("benefits.items.quality.description")}
                </p>
              </div>
              <div>
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t("benefits.items.support.title")}
                </h3>
                <p className="text-gray-600">
                  {t("benefits.items.support.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
