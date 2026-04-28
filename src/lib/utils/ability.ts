import { User } from "@/features/User/types/user";
import {
  MongoAbility,
  AbilityBuilder,
  createMongoAbility,
} from "@casl/ability";

// Utilisation d'enums pour les actions et les subjects
export enum Action {
  READ = "read",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  MODERATE = "moderate",
}

export enum SubjectType {
  ADMIN_CONTENT = "AdminContent",
  MODERATOR_CONTENT = "ModeratorContent",
  MEMBER_CONTENT = "MemberContent",
}

// Définition d'interfaces pour chaque type de subject
export interface AdminContent {
  type: SubjectType.ADMIN_CONTENT;
}

export interface ModeratorContent {
  type: SubjectType.MODERATOR_CONTENT;
}

export interface MemberContent {
  type: SubjectType.MEMBER_CONTENT;
}

// Type union pour tous les subjects
export type AppSubject =
  | AdminContent
  | ModeratorContent
  | MemberContent
  | SubjectType; // On garde aussi les strings pour la compatibilité

// Type pour l'ability
export type AppAbility = MongoAbility<[Action, AppSubject]>;

// Définition des rôles et leurs hiérarchies
export enum Role {
  USER = "ROLE_USER",
  MODERATEUR = "ROLE_MODERATEUR",
  ADMIN = "ROLE_ADMIN",
}

const ROLE_HIERARCHY: Record<Role, Role[]> = {
  [Role.USER]: [Role.USER],
  [Role.MODERATEUR]: [Role.USER, Role.MODERATEUR],
  [Role.ADMIN]: [Role.USER, Role.MODERATEUR, Role.ADMIN],
};

// Pour l'ability, on n'a besoin que d'un sous-ensemble de l'utilisateur
export type AbilityUser = Pick<User, "id" | "roles">;

// Définition des permissions par rôle
type PermissionDefinition = (
  can: AbilityBuilder<AppAbility>["can"],
  user: AbilityUser
) => void;

const ROLE_PERMISSIONS: Record<Role, PermissionDefinition> = {
  [Role.USER]: (can) => {
    can(Action.READ, SubjectType.MEMBER_CONTENT);
    can(Action.CREATE, SubjectType.MEMBER_CONTENT);
  },
  [Role.MODERATEUR]: (can) => {
    can(Action.READ, SubjectType.MODERATOR_CONTENT);
    can(Action.CREATE, SubjectType.MODERATOR_CONTENT);
  },
  [Role.ADMIN]: (can) => {
    can(Action.READ, SubjectType.ADMIN_CONTENT);
    can(Action.CREATE, SubjectType.ADMIN_CONTENT);
  },
};

// Fonction pour créer l'ability en fonction de l'utilisateur
export const defineAbilityFor = (
  user: AbilityUser | null | undefined
): AppAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (user) {
    const userRoles = (user.roles || []) as Role[];

    const effectiveRoles = new Set<Role>();
    userRoles.forEach((role) => {
      const inheritedRoles = ROLE_HIERARCHY[role] || [];
      inheritedRoles.forEach((r) => effectiveRoles.add(r));
    });

    effectiveRoles.forEach((role) => {
      const applyPermissions = ROLE_PERMISSIONS[role];
      if (applyPermissions) {
        applyPermissions(can, user);
      }
    });
  }

  return build();
};
