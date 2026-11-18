import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4576;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

type TodoChanges = Partial<Pick<Todo, 'title' | 'completed'>>;

export const updateTodo = (todoId: number, changes: TodoChanges) => {
  return client.patch<Todo>(`/todos/${todoId}`, changes);
};
