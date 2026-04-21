import rawUserAdmin from "@/features/User/__tests__/fixtures/user-admin.json";
import rawUserModer from "@/features/User/__tests__/fixtures/user-moder.json";
import rawUserMember from "@/features/User/__tests__/fixtures/user-member.json";
import { User } from "@/features/User/types/user";

export type UserType = "UserAdmin" | "UserModer" | "UserMember";

export const userAdmin: User = rawUserAdmin;
export const userModer: User = rawUserModer;
export const userMember: User = rawUserMember;

export const userMap: Record<UserType, User> = {
  UserAdmin: userAdmin,
  UserModer: userModer,
  UserMember: userMember,
};
