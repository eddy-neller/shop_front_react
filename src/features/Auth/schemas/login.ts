import type { TFunction } from "i18next";
import { z } from "zod";

export const createLoginSchema = (t: TFunction<"auth">) =>
  z.object({
    email: z
      .string()
      .min(1, t("login.email.required"))
      .email(t("login.email.invalid")),
    password: z
      .string()
      .min(1, t("login.password.required"))
      .min(6, t("login.password.min")),
  });

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
