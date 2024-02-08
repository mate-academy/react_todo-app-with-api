import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (todo: Todo) => {
  return client.post<Todo>(
    '/todos',
    { title: todo.title, userId: todo.userId, completed: todo.completed },
  );
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (todo: Omit<Todo, 'userId'>) => {
  return client.patch<Todo>(`/todos/${todo.id}`, {
    title: todo.title,
    completed: todo.completed,
  });
};
