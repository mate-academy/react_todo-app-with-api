import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 10565;

export const todosFromServer = client
  .get<Todo[]>(`/todos?userId=${USER_ID}`);
export const createTodoOnServer = (title: string) => client
  .post<Todo>('/todos', {
  title,
  userId: USER_ID,
  completed: false,
});
export const deleteTodoOnServer = (todoId: number) => client
  .delete(`/todos/${todoId}`);
export const toggleTodoOnServer = (todoId: number, completed: boolean) => client
  .patch<Todo>(`/todos/${todoId}`, { completed: !completed });
export const updateTodoOnServer = (todoId: number, title: string) => client
  .patch<Todo>(`/todos/${todoId}`, { title });
