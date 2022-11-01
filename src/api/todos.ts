import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const addTodo = (title: string, userId: number) => {
  const data = {
    userId,
    title,
    completed: false,
  };

  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${String(todoId)}`);
};

export const toggleTodo = (todo: Todo) => {
  const data = {
    ...todo,
    completed: !todo.completed,
  };

  return client.patch(`/todos/${String(todo.id)}`, data);
};

export const updateTodo = (todo: Todo, newTitle: string) => {
  const data = {
    ...todo,
    title: newTitle,
  };

  return client.patch(`/todos/${String(todo.id)}`, data);
};
