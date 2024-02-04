import { Todo, TodoID, TodoUpdate } from '../types/Todo';
import { client } from '../utils/fetchClient';

const USER_ID = 12058;

const URL_PATH = `/todos?userId=${USER_ID}`;

export const getTodos = () => {
  return client.get<Todo[]>(URL_PATH);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(URL_PATH, newTodo);
};

export const deleteTodo = (todoID: TodoID) => {
  return client.delete(`/todos/${todoID}?userId=${USER_ID}`);
};

export const updateTodo = (todo: TodoUpdate) => {
  return client.patch<Todo>(`/todos/${todo.id}?userId=${USER_ID}`, todo);
};

// Add more methods here
