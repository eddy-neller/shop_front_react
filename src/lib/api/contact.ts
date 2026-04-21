import httpClient from "@/lib/api/httpClient";
import type { ContactFormData } from "@/schemas/contact";

export const sendEmail = async (
  data: ContactFormData
): Promise<{ message: string }> => {
  const response = await httpClient.post<{ message: string }>(
    "/util/send-mail",
    data
  );
  return response.data;
};
