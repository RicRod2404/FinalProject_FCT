export interface User {
  nickname: string;
  password?: string;
  name?: string;
  email: string;
  phoneNum?: string;
  role: string;
  status: string;
  address?: string;
  postalCode?: string;
  nif?: string;
  profilePic?: string;
  leafPoints?: number;
  isPublic: boolean;
  level: number;
  bannerPic?: string;
  levelExp?: number;
  levelExpToNextLevel: number;
}
