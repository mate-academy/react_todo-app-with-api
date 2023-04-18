export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  username: string | null;
  email: string;
  phone: string | number | null;
  website: string;
}
