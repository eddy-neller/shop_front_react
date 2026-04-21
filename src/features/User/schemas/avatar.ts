import type { TFunction } from "i18next";
import { z } from "zod";

export const createAvatarFormSchema = (t: TFunction<"user">) =>
  z.object({
    avatarFile: z
      .instanceof(FileList)
      .refine((files) => files.length > 0, {
        message: t("forms.avatar.required"),
      })
      .refine((files) => files[0]?.size <= 200 * 1024, {
        message: t("forms.avatar.size"),
      })
      .refine(
        (files) =>
          files[0]?.type === "image/jpeg" || files[0]?.type === "image/png",
        {
          message: t("forms.avatar.type"),
        }
      ),
  });

export type AvatarFormData = z.infer<ReturnType<typeof createAvatarFormSchema>>;
