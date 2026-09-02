export interface User {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  roles: string[];
  status: number;
  dateNaissance: string;
  ville: string;
  passion: string;
  travail: string;
  citation: string;
  signature: string;
  siteweb: string;
  avatarUrl: string;
  userbarUrl: string;
  lastVisit: string;
  nbLogin: number;
  nbForumMessage: number;
  nbMessageSent: number;
  nbMessageReceived: number;
  createdAt: string;
  updatedAt: string;
  subscriptionPreferencesPlan?: string;
  subscriptionPreferencesInterval?: string;
}

export type AuthUser = {
  id: string;
  roles: string[];
};

export interface UserLink {
  id: string;
  username: string;
}

export interface UserComment {
  id: string;
  username: string;
  roles: string[];
  citation: string;
  signature: string;
  avatarUrl: string;
  userbarUrl: string;
}

export interface UserContactCard {
  id: string;
  username: string;
  avatarUrl: string;
  lastVisit: string;
}
