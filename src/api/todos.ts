import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (fieldsToCreate: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', fieldsToCreate);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`)
    .then(response => Boolean(response));
};

export const updateTodo = (todoId: number, newData: Partial<Todo>) => {
  return client.patch(`/todos/${todoId}`, newData);
};
