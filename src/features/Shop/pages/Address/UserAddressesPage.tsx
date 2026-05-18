import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { AlertCircle, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import AddressCard from "@/features/Shop/components/Address/AddressCard";
import AddressForm from "@/features/Shop/components/Address/AddressForm";
import {
  useAddresses,
  useDeleteAddress,
} from "@/features/Shop/hooks/useAddresses";
import type { ShopAddress } from "@/features/Shop/types/address";

export default function UserAddressesPage() {
  const { setBreadcrumbItems } = useBreadcrumb();
  const { t } = useTranslation("addresses");

  const { data: addresses, isPending, isError } = useAddresses();

  const deleteMutation = useDeleteAddress();

  const [formOpen, setFormOpen] = useState(false);
  const [editedAddress, setEditedAddress] = useState<ShopAddress | null>(null);

  useEffect(() => {
    setBreadcrumbItems([
      {
        key: "user",
        linkProps: { to: "/user" },
        title: t("breadcrumb.dashboard"),
      },
      {
        key: "addresses",
        title: t("breadcrumb.addresses"),
        active: true,
      },
    ]);
  }, [setBreadcrumbItems, t]);

  const openCreateForm = () => {
    setEditedAddress(null);
    setFormOpen(true);
  };

  const openEditForm = (address: ShopAddress) => {
    setEditedAddress(address);
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditedAddress(null);
    setFormOpen(false);
  };

  const handleDelete = (address: ShopAddress) => {
    if (!window.confirm(t("card.confirmDelete"))) {
      return;
    }

    deleteMutation.mutate(address.id, {
      onSuccess: () => {
        toast.success(t("form.toast.deleted"));
        if (editedAddress?.id === address.id) {
          closeForm();
        }
      },
      onError: () => {
        toast.error(t("form.toast.deleteError"));
      },
    });
  };

  const isEmpty = !addresses || addresses.length === 0;

  return (
    <>
      <Helmet>
        <title>{t("helmet.title")}</title>
        <meta name="description" content={t("helmet.description")} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {t("page.title")}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {t("page.description")}
              </p>
            </div>
            {!formOpen && (
              <Button type="button" onClick={openCreateForm}>
                <Plus className="h-4 w-4" />
                {t("page.add")}
              </Button>
            )}
          </div>

          {formOpen && (
            <div className="mb-6">
              <AddressForm
                address={editedAddress}
                onCancel={closeForm}
                onSaved={closeForm}
              />
            </div>
          )}

          {isPending && <Spinner loading={isPending} fullscreen />}

          {isError && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <CardTitle>{t("page.errorTitle")}</CardTitle>
                </div>
                <CardDescription>{t("page.errorDescription")}</CardDescription>
              </CardHeader>
            </Card>
          )}

          {!isPending && !isError && isEmpty && (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center px-6 py-12 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold">
                  {t("page.emptyTitle")}
                </h2>
                <p className="mt-2 max-w-md text-sm text-slate-600">
                  {t("page.emptyDescription")}
                </p>
                {!formOpen && (
                  <Button
                    type="button"
                    className="mt-5"
                    onClick={openCreateForm}
                  >
                    <Plus className="h-4 w-4" />
                    {t("page.add")}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {!isPending && !isError && !isEmpty && (
            <div className="space-y-4">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
