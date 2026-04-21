import type { TFunction } from "i18next";
import { z } from "zod";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const createRegisterSchema = (t: TFunction<"auth-register">) =>
  z
    .object({
      email: z
        .string()
        .min(1, t("forms.register.email.required"))
        .min(4, t("forms.register.email.min"))
        .max(100, t("forms.register.email.max"))
        .email(t("forms.register.email.invalid")),
      username: z
        .string()
        .min(1, t("forms.register.username.required"))
        .min(2, t("forms.register.username.min"))
        .max(20, t("forms.register.username.max")),
      password: z
        .string()
        .min(1, t("forms.register.password.required"))
        .regex(PASSWORD_REGEX, t("forms.register.password.pattern")),
      confirmPassword: z
        .string()
        .min(1, t("forms.register.confirmPassword.required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("forms.register.confirmPassword.match"),
      path: ["confirmPassword"],
    });

export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;
