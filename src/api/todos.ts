import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, title: string) => {
  const todo = {
    title,
    userId,
    completed: false,
  };

  return client.post<Todo[]>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const upgradeTodo = (todo: Todo) => {
  return client.patch(`/todos/${todo.id}`, todo);
};
