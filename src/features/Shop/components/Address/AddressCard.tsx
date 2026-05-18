import { Building2, MapPin, Pencil, Phone, Trash2, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ShopAddress } from "@/features/Shop/types/address";

interface AddressCardProps {
  address: ShopAddress;
  onEdit: (address: ShopAddress) => void;
  onDelete: (address: ShopAddress) => void;
  isDeleting?: boolean;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  isDeleting = false,
}: AddressCardProps) {
  const { t } = useTranslation("addresses");
  const fullName = `${address.firstname} ${address.lastname}`;

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {address.name}
              </h2>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                <User className="h-4 w-4" />
                <span>{fullName}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-700">
              {address.company && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-slate-500" />
                  <span>
                    {t("card.company")}: {address.company}
                  </span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-slate-500" />
                <span>
                  {address.address}, {address.zip} {address.city},{" "}
                  {address.country}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500" />
                <span>
                  {t("card.phone")}: {address.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:flex-col">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEdit(address)}
            >
              <Pencil className="h-4 w-4" />
              {t("card.edit")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={() => onDelete(address)}
            >
              <Trash2 className="h-4 w-4" />
              {t("card.delete")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
