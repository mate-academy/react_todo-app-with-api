import { Todo } from '../types/Types';
import { client } from '../utils/fetchClient';

export const USER_ID = 2491;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodoTitle: string) => {
  const newTodo: Omit<Todo, 'id'> = {
    title: newTodoTitle,
    completed: false,
    userId: USER_ID,
  };

  return client.post<Todo>(`/todos`, newTodo);
};

export const updateTodo = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title: title });
};

export const toggleTodo = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed: !completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
