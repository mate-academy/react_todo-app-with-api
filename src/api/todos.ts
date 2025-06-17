import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2999;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};



export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const deleteAllCompletedTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}&completed=true`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', { userId: USER_ID, title, completed: false })
};

export const updateTodo = ({ id, title, completed, }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {title, completed,})
};

