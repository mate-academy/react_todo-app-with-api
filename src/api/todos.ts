import { Todo } from '../types/Todo';
import { NewTodo } from '../types/NewTodo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (todo: NewTodo) => {
  return client.post('/todos', todo);
};

export const patchTodo = (todoId: number, todo: Todo) => {
  return client.patch(`/todos/${todoId}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
