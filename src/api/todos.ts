import { NewTodo } from '../types/NewTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3800;

export const getTodosRequest = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodoRequest = (todo: NewTodo) => {
  return client.post<Todo>(`/todos`, todo);
};

export const updateTodoRequest = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};

export const deleteTodoRequest = (id: number) => {
  return client.delete(`/todos/${id}`);
};
