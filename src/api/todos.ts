import { NewTodo, Todo, TodoUpdateFields } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: NewTodo): Promise<Todo> => {
  return client.post<Todo>('/todos', todo);
};

export const removeTodoByTodoId = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoByTodoId = (
  todoId: number,
  data: Partial<TodoUpdateFields>,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
