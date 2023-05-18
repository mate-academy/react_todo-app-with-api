import { Todo } from '../types/Todo';
import { TodoData } from '../types/TodoData';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todoData: TodoData): Promise<Todo> => {
  return client.post<Todo>('/todos', todoData);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodoCompleted = (todoId: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${todoId}`, { completed });
};
