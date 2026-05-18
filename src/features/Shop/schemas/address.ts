import type { TFunction } from "i18next";
import { z } from "zod";

const trimmedString = (message: string, minMessage: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, message)
    .min(2, minMessage)
    .max(max);

export const createAddressFormSchema = (t: TFunction<"addresses">) =>
  z.object({
    name: trimmedString(
      t("form.fields.name.required"),
      t("form.fields.name.min"),
      100
    ),
    firstname: trimmedString(
      t("form.fields.firstname.required"),
      t("form.fields.firstname.min"),
      32
    ),
    lastname: trimmedString(
      t("form.fields.lastname.required"),
      t("form.fields.lastname.min"),
      32
    ),
    company: z
      .string()
      .trim()
      .max(50, t("form.fields.company.max"))
      .optional()
      .or(z.literal("")),
    address: trimmedString(
      t("form.fields.address.required"),
      t("form.fields.address.min"),
      150
    ),
    zip: trimmedString(
      t("form.fields.zip.required"),
      t("form.fields.zip.min"),
      30
    ),
    city: trimmedString(
      t("form.fields.city.required"),
      t("form.fields.city.min"),
      50
    ),
    country: trimmedString(
      t("form.fields.country.required"),
      t("form.fields.country.min"),
      50
    ),
    phone: trimmedString(
      t("form.fields.phone.required"),
      t("form.fields.phone.min"),
      30
    ),
  });

export type AddressFormData = z.infer<
  ReturnType<typeof createAddressFormSchema>
>;
