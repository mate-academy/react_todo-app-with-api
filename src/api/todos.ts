import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { errorText } from '../constants';

export const USER_ID = 492;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`).catch(() => {
    throw new Error(errorText.noTodos);
  });
};

export const getTodo = (id: number) => {
  return client.get<Todo>(`/todos/${id}`);
};

export const addTodo = ({ title, completed }: Omit<Todo, 'id'>) => {
  return client
    .post<Todo>(`/todos`, { title, completed, userId: USER_ID })
    .catch(() => {
      throw new Error(errorText.failAdding);
    });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`).catch(() => {
    throw new Error(errorText.failDeleting);
  });
};

export const editTodo = (id: number, data: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, data).catch(() => {
    throw new Error(errorText.failUpdating);
  });
};
