import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2;

export const todosApi = {
  getTodos: () => {
    return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
  },

  createTodo: (newTodo: Omit<Todo, 'id'>) => {
    return client.post<Todo>(`/todos`, newTodo);
  },

  removeTodo: (id: number) => {
    return client.delete(`/todos/${id}`);
  },

  updateTodo: (todo: Todo) => {
    return client.patch<Todo>(`/todos/${todo.id}`, todo);
  },
};
