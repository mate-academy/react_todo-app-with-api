import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2176;

const TODOS_PATH = '/todos';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todoTitle: string) => {
  return client.post<Todo>(TODOS_PATH, {
    title: todoTitle,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`${TODOS_PATH}/${todoId}`);
};

export const updateTodo = (todoId: number, updatedFields: Partial<Todo>) => {
  return client.patch<Todo>(`${TODOS_PATH}/${todoId}`, updatedFields);
};
