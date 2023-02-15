import { User } from '../types/User';
import { client } from '../utils/fetchClient';

export const getUserByEmail = async (email: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const users = await client.get<User[]>(`/users?email=${email}`);

    return users[0] || null;
  } catch (error) {
    throw error;
  }
};

type UserData = Pick<User, 'name' | 'email'>;

export const createUser = async ({ email, name }: UserData) => {
  return client.post<User>('/users', { email, name });
};
