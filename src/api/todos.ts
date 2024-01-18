import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/USER_ID';
import { client } from '../utils/fetchClient';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const addTodo = (title: string) => {
  return client.post('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, newTitle: string) => {
  return client.patch(`/todos/${todoId}`, { title: newTitle });
};
