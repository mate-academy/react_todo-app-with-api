import { Todo } from '../types/Todo';
import { NewTodo } from '../types/NewTodo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: NewTodo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  updatedFields:{ title?:string; completed?: boolean },
) => {
  return client.patch<Todo>(`/todos/${todoId}`, updatedFields);
};
