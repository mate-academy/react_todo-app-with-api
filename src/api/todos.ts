import { NewTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export const addTodo = (newTodo: NewTodo): Promise<Todo> => {
  return client.post('/todos', newTodo);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
