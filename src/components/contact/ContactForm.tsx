import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { handleAxiosError } from "@/lib/utils/axiosErrorHandler";
import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { sendEmail } from "@/lib/api/contact";
import {
  createContactFormSchema,
  type ContactFormData,
} from "@/schemas/contact";
import { useTranslation } from "react-i18next";

export default function ContactForm() {
  const { t } = useTranslation("contact-us");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(createContactFormSchema(t)),
  });

  const mutation = useMutation({
    mutationFn: (data: ContactFormData) => sendEmail(data),
    onSuccess: () => {
      reset();
      toast.success(t("toast.success"), {
        description: t("toast.description"),
      });
    },
    onError: (error) => {
      handleAxiosError(error, setError, true, t("error.generic"));
    },
  });

  const onSubmit = (data: ContactFormData) => {
    mutation.mutate(data);
  };

  const isBusy = isSubmitting || mutation.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t("hero.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">{t("form.name.label")}</FieldLabel>
              <FieldContent>
                <Input
                  id="name"
                  type="text"
                  placeholder={t("form.name.placeholder")}
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                <FieldError errors={errors.name ? [errors.name] : undefined} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">{t("form.email.label")}</FieldLabel>
              <FieldContent>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("form.email.placeholder")}
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                <FieldError
                  errors={errors.email ? [errors.email] : undefined}
                />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.subject}>
              <FieldLabel htmlFor="subject">
                {t("form.subject.label")}
              </FieldLabel>
              <FieldContent>
                <Input
                  id="subject"
                  type="text"
                  placeholder={t("form.subject.placeholder")}
                  {...register("subject")}
                  className={errors.subject ? "border-destructive" : ""}
                />
                <FieldError
                  errors={errors.subject ? [errors.subject] : undefined}
                />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.message}>
              <FieldLabel htmlFor="message">
                {t("form.message.label")}
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="message"
                  rows={6}
                  placeholder={t("form.message.placeholder")}
                  {...register("message")}
                  className={errors.message ? "border-destructive" : ""}
                />
                <FieldError
                  errors={errors.message ? [errors.message] : undefined}
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          <div className="pt-4 mt-6">
            <LoadingButton
              type="submit"
              variant="default"
              size="lg"
              className="w-full bg-slate-900 text-white hover:bg-slate-800 font-medium"
              isBusy={isBusy}
              label={t("form.submit.label")}
              busyLabel={t("form.submit.busy")}
              icon={<Send className="h-4 w-4" />}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
