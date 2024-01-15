import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { TodoforPATCH, TodoforUPDATE } from '../types/TodoForPATCH';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, completed: TodoforPATCH) => {
  return client.patch(`/todos/${todoId}`, completed);
};

export const updateTodoTitle = (todoId: number, title: TodoforUPDATE) => {
  return client.patch(`/todos/${todoId}`, title);
};
