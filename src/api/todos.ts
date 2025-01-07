import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2167;
const TODOS_URL = '/todos';

export const getTodos = () => {
  return client.get<Todo[]>(`${TODOS_URL}?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id' | 'userId'>) => {
  return client.post<Todo>(`${TODOS_URL}`, {
    ...newTodo,
    userId: USER_ID,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`${TODOS_URL}/${todoId}`);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`${TODOS_URL}/${todo.id}`, todo);
};
