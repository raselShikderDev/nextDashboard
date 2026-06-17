export interface IUser {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  mustChangePassword: boolean;
}

export interface IUserAuth {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface ILoginResponse {
  user: IUserAuth;
}