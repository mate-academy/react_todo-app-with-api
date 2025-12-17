import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3651;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, {
    completed: todo.completed,
    title: todo.title,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
