import { TODOS_API_PATH, USER_ID } from '../constants/api';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = () => {
  return client.get<Todo[]>(`${TODOS_API_PATH}?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id' | 'userId'>) => {
  return client.post<Todo>(`${TODOS_API_PATH}`, {
    ...newTodo,
    userId: USER_ID,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`${TODOS_API_PATH}/${todoId}`);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`${TODOS_API_PATH}/${todo.id}`, todo);
};
