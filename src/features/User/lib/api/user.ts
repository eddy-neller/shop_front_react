import httpClient from "@/lib/api/httpClient";
import type { User } from "@/features/User/types/user";

export const getMe = async (): Promise<User> => {
  const response = await httpClient.get<User>("/users/me");
  return response.data;
};

export const getUser = async (id: string): Promise<User> => {
  const response = await httpClient.get<User>(`/users/${id}`);
  return response.data;
};

export const updatePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}): Promise<User> => {
  const response = await httpClient.patch<User>(
    "/users/me/update-password",
    data,
    {
      headers: {
        "Content-Type": "application/merge-patch+json",
      },
    }
  );

  return response.data;
};

export const updateAvatar = async (avatarFile: File): Promise<User> => {
  const formData = new FormData();
  formData.append("avatarFile", avatarFile);

  const response = await httpClient.post<User>("/users/me/avatar", formData);
  return response.data;
};
