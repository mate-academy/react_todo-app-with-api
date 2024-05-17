import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';

export const USER_ID = 630;

export const getTodos = () => {
  return client.get<Todo[]>(`todos?userId=${USER_ID}`);
};

export const postTodo = (query: string) => {
  return client.post(`todos`, {
    userId: USER_ID,
    title: query,
    completed: false,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodos = (todoId: number, data: Todo) => {
  return client.patch(`/todos/${todoId}`, data);
};
