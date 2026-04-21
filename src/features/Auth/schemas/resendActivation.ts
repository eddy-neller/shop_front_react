import type { TFunction } from "i18next";
import { z } from "zod";

export const createResendActivationSchema = (
  t: TFunction<"auth-registerValidation">
) =>
  z.object({
    email: z
      .string()
      .min(1, t("validation.forms.resendActivation.email.required"))
      .max(100, t("validation.forms.resendActivation.email.max"))
      .email(t("validation.forms.resendActivation.email.invalid")),
  });

export type ResendActivationFormData = z.infer<
  ReturnType<typeof createResendActivationSchema>
>;
