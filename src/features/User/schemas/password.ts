import type { TFunction } from "i18next";
import { z } from "zod";

// Regex pour valider le mot de passe : au moins 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial
const PASSWORD_REGEX = /^(?=.*[()!@#$%^&*_-])(?=.*\d)(?=.*[A-Z]).{8,30}$/;

export const createEditPasswordFormSchema = (t: TFunction<"user">) =>
  z
    .object({
      currentPassword: z.string().min(1, t("forms.editPassword.current.required")),
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
