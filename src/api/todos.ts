import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1920;

// RETRIEVE TODOs of a certain user from the server
export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// CREATE a new TODO on the server
export const postTodo = (title: string, completed = false) => {
  const data = {
    title: title,
    userId: USER_ID,
    completed: completed,
  };

  return client.post<Todo>('/todos', data);
};

// UPDATE existing TODO on the server
export const patchTodo = (updatedTodo: Todo) => {
  const { id, title, completed } = updatedTodo;
  const data = { title: title, completed: completed };

  return client.patch<Todo>(`/todos/${id}`, data);
};

// DELETE existing TODO from the server
export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
