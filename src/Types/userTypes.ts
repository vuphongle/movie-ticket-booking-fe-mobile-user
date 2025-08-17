export interface UserProfile {
  name: unknown;
  id: string;
  userName: string;
  email: string;
  surname?: string;
  phoneNumber?: string;
  isExternal?: boolean;
  hasPassword: boolean;
  concurrencyStamp?: string;
  extraProperties: object;
}
