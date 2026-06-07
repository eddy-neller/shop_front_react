import {
  Building2,
  MapPin,
  Pencil,
  Phone,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ShopAddress } from "@/features/Shop/types/address";
import { cn } from "@/lib/utils";

interface AddressCardProps {
  address: ShopAddress;
  onEdit: (address: ShopAddress) => void;
  onDelete: (address: ShopAddress) => void;
  onSetDefault: (address: ShopAddress) => void;
  isDeleting?: boolean;
  isSettingDefault?: boolean;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting = false,
  isSettingDefault = false,
}: AddressCardProps) {
  const { t } = useTranslation("addresses");
  const fullName = `${address.firstname} ${address.lastname}`;

  return (
    <Card
      className={cn(
        "overflow-hidden border shadow-sm transition-shadow",
        address.isDefault
          ? "border-primary/30 bg-primary/[0.03] shadow-md ring-1 ring-primary/10"
          : "border-transparent"
      )}
    >
      {address.isDefault && <div className="h-1 bg-primary" aria-hidden />}
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  {address.name}
                </h2>
                {address.isDefault && (
                  <Badge className="gap-1 rounded-full">
                    <Star className="h-3 w-3 fill-current" />
                    {t("card.default")}
                  </Badge>
                )}
              </div>
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
            {!address.isDefault && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isSettingDefault}
                aria-busy={isSettingDefault}
                onClick={() => onSetDefault(address)}
              >
                <Star className="h-4 w-4" />
                {isSettingDefault
                  ? t("card.settingDefault")
                  : t("card.setDefault")}
              </Button>
            )}
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
