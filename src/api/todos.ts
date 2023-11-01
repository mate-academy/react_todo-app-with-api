import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  const newTodo: Todo = {
    id: 0,
    userId,
    title,
    completed,
  };

  return client.post<Todo>('/todos', newTodo);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};
