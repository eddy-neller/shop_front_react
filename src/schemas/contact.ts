import type { TFunction } from "i18next";
import { z } from "zod";

export const createContactFormSchema = (t: TFunction<"contact-us">) =>
  z.object({
    name: z
      .string()
      .min(2, t("form.name.min"))
      .max(50, t("form.name.max")),
    email: z
      .string()
      .email(t("form.email.pattern"))
      .max(100, t("form.email.max")),
    subject: z
      .string()
      .min(5, t("form.subject.min"))
      .max(100, t("form.subject.max")),
    message: z
      .string()
      .min(10, t("form.message.min"))
      .max(1000, t("form.message.max")),
  });

export type ContactFormData = z.infer<ReturnType<typeof createContactFormSchema>>;
