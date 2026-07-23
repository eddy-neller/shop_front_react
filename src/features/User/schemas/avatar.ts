import type { TFunction } from "i18next";
import { z } from "zod";

export const createAvatarFormSchema = (t: TFunction<"user">) =>
  z.object({
    avatarFile: z
      .instanceof(FileList)
      .refine((files) => files.length > 0, {
        message: t("forms.avatar.required"),
      })
      .refine((files) => files[0]?.size <= 2 * 1024 * 1024, {
        message: t("forms.avatar.size"),
      })
      .refine(
        (files) =>
          files[0]?.type === "image/jpeg" ||
          files[0]?.type === "image/png" ||
          files[0]?.type === "image/webp",
        {
          message: t("forms.avatar.type"),
        }
      ),
  });

export type AvatarFormData = z.infer<ReturnType<typeof createAvatarFormSchema>>;
