import { PASSWORD_REGEX } from "@/lib/utils/form";
import type { TFunction } from "i18next";
import { z } from "zod";

export const createEditPasswordFormSchema = (t: TFunction<"user">) =>
  z
    .object({
      currentPassword: z
        .string()
        .min(1, t("forms.editPassword.current.required")),
      newPassword: z
        .string()
        .min(1, t("forms.editPassword.new.required"))
        .regex(PASSWORD_REGEX, t("forms.editPassword.new.policy")),
      confirmNewPassword: z
        .string()
        .min(1, t("forms.editPassword.confirm.required")),
    })
    .refine((data) => data.newPassword !== data.currentPassword, {
      message: t("forms.editPassword.new.different"),
      path: ["newPassword"],
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("forms.editPassword.confirm.mismatch"),
      path: ["confirmNewPassword"],
    });

export type EditPasswordFormData = z.infer<
  ReturnType<typeof createEditPasswordFormSchema>
>;
