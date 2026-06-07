import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  useCreateAddress,
  useUpdateAddress,
} from "@/features/Shop/hooks/useAddresses";
import {
  createAddressFormSchema,
  type AddressFormData,
} from "@/features/Shop/schemas/address";
import type {
  ShopAddress,
  ShopAddressCreatePayload,
} from "@/features/Shop/types/address";
import { handleAxiosError } from "@/lib/utils/axiosErrorHandler";

interface AddressFormProps {
  address?: ShopAddress | null;
  onCancel: () => void;
  onSaved: () => void;
}

const emptyValues: AddressFormData = {
  name: "",
  firstname: "",
  lastname: "",
  company: "",
  address: "",
  zip: "",
  city: "",
  country: "",
  phone: "",
};

const toFormValues = (address?: ShopAddress | null): AddressFormData => ({
  name: address?.name ?? "",
  firstname: address?.firstname ?? "",
  lastname: address?.lastname ?? "",
  company: address?.company ?? "",
  address: address?.address ?? "",
  zip: address?.zip ?? "",
  city: address?.city ?? "",
  country: address?.country ?? "",
  phone: address?.phone ?? "",
});

const normalizePayload = (data: AddressFormData): ShopAddressCreatePayload => ({
  name: data.name.trim(),
  firstname: data.firstname.trim(),
  lastname: data.lastname.trim(),
  company: data.company?.trim() ? data.company.trim() : null,
  address: data.address.trim(),
  zip: data.zip.trim(),
  city: data.city.trim(),
  country: data.country.trim(),
  phone: data.phone.trim(),
});

export default function AddressForm({
  address,
  onCancel,
  onSaved,
}: AddressFormProps) {
  const { t } = useTranslation("addresses");

  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();

  const isEditing = !!address;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(createAddressFormSchema(t)),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    reset(toFormValues(address));
  }, [address, reset]);

  const onSubmit = (data: AddressFormData) => {
    const payload = normalizePayload(data);

    if (isEditing) {
      updateMutation.mutate(
        { id: address.id, data: payload },
        {
          onSuccess: () => {
            toast.success(t("form.toast.updated"));
            onSaved();
          },
          onError: (error) => {
            handleAxiosError(
              error,
              setError,
              true,
              t("form.toast.updateError")
            );
          },
        }
      );
      return;
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(t("form.toast.created"));
        reset(emptyValues);
        onSaved();
      },
      onError: (error) => {
        if (isAxiosError(error) && error.response?.status === 409) {
          toast.error(t("form.toast.addressLimitTitle"), {
            description: t("form.toast.addressLimitDescription"),
          });
          return;
        }

        handleAxiosError(error, setError, true, t("form.toast.createError"));
      },
    });
  };

  const isBusy =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {isEditing ? t("form.editTitle") : t("form.createTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">
                  {t("form.fields.name.label")}
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="name"
                    placeholder={t("form.fields.name.placeholder")}
                    {...register("name")}
                  />
                  <FieldError
                    errors={errors.name ? [errors.name] : undefined}
                  />
                </FieldContent>
              </Field>

              <Field data-invalid={!!errors.company}>
                <FieldLabel htmlFor="company">
                  {t("form.fields.company.label")}
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="company"
                    placeholder={t("form.fields.company.placeholder")}
                    {...register("company")}
                  />
                  <FieldError
                    errors={errors.company ? [errors.company] : undefined}
                  />
                </FieldContent>
              </Field>

              <Field data-invalid={!!errors.firstname}>
                <FieldLabel htmlFor="firstname">
                  {t("form.fields.firstname.label")}
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="firstname"
                    placeholder={t("form.fields.firstname.placeholder")}
                    {...register("firstname")}
                  />
                  <FieldError
                    errors={errors.firstname ? [errors.firstname] : undefined}
                  />
                </FieldContent>
              </Field>

              <Field data-invalid={!!errors.lastname}>
                <FieldLabel htmlFor="lastname">
                  {t("form.fields.lastname.label")}
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="lastname"
                    placeholder={t("form.fields.lastname.placeholder")}
                    {...register("lastname")}
                  />
                  <FieldError
                    errors={errors.lastname ? [errors.lastname] : undefined}
                  />
                </FieldContent>
              </Field>
            </div>

            <Field data-invalid={!!errors.address}>
              <FieldLabel htmlFor="address">
                {t("form.fields.address.label")}
              </FieldLabel>
              <FieldContent>
                <Input
                  id="address"
                  placeholder={t("form.fields.address.placeholder")}
                  {...register("address")}
                />
                <FieldError
                  errors={errors.address ? [errors.address] : undefined}
                />
              </FieldContent>
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <Field data-invalid={!!errors.zip}>
                <FieldLabel htmlFor="zip">
                  {t("form.fields.zip.label")}
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="zip"
                    placeholder={t("form.fields.zip.placeholder")}
                    {...register("zip")}
                  />
                  <FieldError errors={errors.zip ? [errors.zip] : undefined} />
                </FieldContent>
              </Field>

              <Field data-invalid={!!errors.city}>
                <FieldLabel htmlFor="city">
                  {t("form.fields.city.label")}
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="city"
                    placeholder={t("form.fields.city.placeholder")}
                    {...register("city")}
                  />
                  <FieldError
                    errors={errors.city ? [errors.city] : undefined}
                  />
                </FieldContent>
              </Field>

              <Field data-invalid={!!errors.country}>
                <FieldLabel htmlFor="country">
                  {t("form.fields.country.label")}
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="country"
                    placeholder={t("form.fields.country.placeholder")}
                    {...register("country")}
                  />
                  <FieldError
                    errors={errors.country ? [errors.country] : undefined}
                  />
                </FieldContent>
              </Field>
            </div>

            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="phone">
                {t("form.fields.phone.label")}
              </FieldLabel>
              <FieldContent>
                <Input
                  id="phone"
                  placeholder={t("form.fields.phone.placeholder")}
                  {...register("phone")}
                />
                <FieldError
                  errors={errors.phone ? [errors.phone] : undefined}
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("page.cancel")}
            </Button>
            <LoadingButton
              type="submit"
              isBusy={isBusy}
              label={isEditing ? t("form.submitEdit") : t("form.submitCreate")}
              busyLabel={isEditing ? t("form.busyEdit") : t("form.busyCreate")}
              icon={<Save className="h-4 w-4" />}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
