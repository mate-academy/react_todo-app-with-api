import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodos = (newTodo: Omit<Todo, 'id'>) => {
  return client.post('/todos', newTodo);
  // return client.post<Todo>(`/todos?userId=${userId}`, newTodo);
};

export const updateTodo = (id: number, todo:Omit <Todo, 'id'>) => {
  return client.patch<Todo>(`/todos/${id}`, todo);
};
