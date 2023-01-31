import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (fieldsToCreate: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', fieldsToCreate);
};

export const deleteTodo = (id: number) => {
  return client.delete <number>(`/todos/${id}`)
    .then(Boolean);
};

export const updateTodo = (
  todoId: number,
  updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
) => {
  const url = `/todos/${todoId}`;

  return client.patch<Todo>(url, updateData);
};
