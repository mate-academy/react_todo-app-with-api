import { Todo } from '../types/Todo';
import { UpdateTodoArgs } from '../types/UpdateTodoArgs';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const changeTodo = (todoId: number, args: UpdateTodoArgs) => {
  return client.patch<Todo>(`/todos/${todoId}`, args);
};
