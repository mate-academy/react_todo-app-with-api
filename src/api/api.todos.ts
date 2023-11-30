import { CreateTodoArgs, Todo, UpdateTodoArgs } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todo: CreateTodoArgs) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, args: UpdateTodoArgs) => {
  return client.patch<UpdateTodoArgs>(`/todos/${todoId}`, args);
};
