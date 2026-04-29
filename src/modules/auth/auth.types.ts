export type AuthUser = {
  id: string;
  username: string;
  email: string;
  password: string;
  fullname: string;
  created_at?: Date;
};

export type SafeAuthUser = Omit<AuthUser, "password">;
