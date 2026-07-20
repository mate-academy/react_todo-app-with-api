import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4387;

type TodoData = Omit<Todo, 'id'>;

type TodoChanges = Partial<Pick<Todo, 'title' | 'completed'>>;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todoData: TodoData) => {
  return client.post<Todo>('/todos', todoData);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, changes: TodoChanges) => {
  return client.patch<Todo>(`/todos/${todoId}`, changes);
};
