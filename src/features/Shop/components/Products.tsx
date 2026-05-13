import { useTranslation } from "react-i18next";
import Paginate from "@/components/Paginate";
import ProductCard from "@/features/Shop/components/ProductCard";
import type { ShopProductSummary } from "@/features/Shop/types/shop";

interface ProductsProps {
  products: ShopProductSummary[];
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Products = ({
  products,
  page,
  totalPages,
  onPageChange,
}: ProductsProps) => {
  const { t } = useTranslation("shop");

  if (products.length === 0) {
    return (
      <h2 className="py-12 text-center text-2xl font-semibold text-gray-700">
        {t("products.empty")}
      </h2>
    );
  }

  return (
    <div role="region" aria-label={t("products.regionLabel")}>
      {totalPages > 1 && (
        <Paginate
          className="mb-5"
          currentPage={page}
          pageCount={totalPages}
          onPageChange={onPageChange}
          previousLabel={t("pagination.previous")}
          nextLabel={t("pagination.next")}
        />
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {totalPages > 1 && (
        <Paginate
          className="mt-5"
          currentPage={page}
          pageCount={totalPages}
          onPageChange={onPageChange}
          previousLabel={t("pagination.previous")}
          nextLabel={t("pagination.next")}
        />
      )}
    </div>
  );
};

export default Products;
