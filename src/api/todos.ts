import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 426;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const createTodo = ({ title, id }: Pick<Todo, 'title' | 'id'>) => {
  return client.post<Todo>('/todos', {
    id,
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};

// Add more methods here
