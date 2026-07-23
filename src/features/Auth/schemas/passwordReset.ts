import { PASSWORD_REGEX } from "@/lib/utils/form";
import type { TFunction } from "i18next";
import { z } from "zod";

export const createPasswordResetRequestSchema = (
  t: TFunction<"auth-forgotPassword">
) =>
  z.object({
    email: z
      .string()
      .min(1, t("forms.resetRequest.email.required"))
      .max(100, t("forms.resetRequest.email.max"))
      .email(t("forms.resetRequest.email.invalid")),
  });

export type PasswordResetRequestFormData = z.infer<
  ReturnType<typeof createPasswordResetRequestSchema>
>;

export const createPasswordResetConfirmSchema = (
  t: TFunction<"auth-forgotPassword">
) =>
  z
    .object({
      newPassword: z
        .string()
        .min(1, t("forms.resetConfirm.newPassword.required"))
        .regex(PASSWORD_REGEX, t("forms.resetConfirm.newPassword.pattern")),
      confirmNewPassword: z
        .string()
        .min(1, t("forms.resetConfirm.confirmNewPassword.required")),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("forms.resetConfirm.confirmNewPassword.match"),
      path: ["confirmNewPassword"],
    });

export type PasswordResetConfirmFormData = z.infer<
  ReturnType<typeof createPasswordResetConfirmSchema>
>;
