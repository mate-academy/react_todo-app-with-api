import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3406;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const clearCompletedTodos = (ids: number[]) => {
  return Promise.allSettled(ids.map(id => client.delete(`/todos/${id}`)));
};

export const toggleTodo = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const toggleAllTodos = (todos: Todo[], targetStatus: boolean) => {
  return Promise.allSettled(
    todos.map(todo =>
      client.patch<Todo>(`/todos/${todo.id}`, { completed: targetStatus }),
    ),
  );
};

export const updateTodoTitle = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};
