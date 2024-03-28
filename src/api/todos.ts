import { Todo, TodoWithoutId } from '../types/Todo';
import { TodoId } from '../types/TodoId';
import { client } from '../utils/fetchClient';

export const USER_ID = 276;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (todoData: TodoWithoutId): Promise<Todo> => {
  return client.post<Todo>(`/todos`, todoData);
};

export const deleteTodo = (todoId: TodoId) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: TodoId, todoData: Todo) => {
  return client.patch(`/todos/${todoId}`, todoData);
};
