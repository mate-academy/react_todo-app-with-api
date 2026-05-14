import { USER_ID } from '../constants/todos';

export const getUserId = () => {
  try {
    const user = localStorage.getItem('user');

    return user ? Number(JSON.parse(user).id) : USER_ID;
  } catch {
    return USER_ID;
  }
};
