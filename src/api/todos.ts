import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const addTodo = (title: string, userId: number) => {
  return client.post<Todo[]>('/todos', {
    userId,
    title,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${String(todoId)}`);
};

export const toggleTodo = (todo: Todo) => {
  return client.patch(`/todos/${String(todo.id)}`, {
    ...todo,
    completed: !todo.completed,
  });
};

export const updateTodo = (todo: Todo, newTitle: string) => {
  return client.patch(`/todos/${String(todo.id)}`, {
    ...todo,
    title: newTitle,
  });
};
