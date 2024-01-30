import { USER_ID } from './fetchClient';

export const createTodo = (titleText: string) => ({
  id: 0,
  userId: USER_ID,
  title: titleText.trim(),
  completed: false,
});
