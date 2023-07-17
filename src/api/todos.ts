import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userID: number) => {
  return client.get<Todo[]>(`/todos?userId=${userID}`);
};

export const postTodo = (userID: number, newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${userID}`, newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete<number>(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  todoForUpdate: Pick<Todo, 'completed' | 'title'>,
) => {
  const { completed, title } = todoForUpdate;

  return client.patch<Todo>(`/todos/${todoId}`, { completed, title });
};
