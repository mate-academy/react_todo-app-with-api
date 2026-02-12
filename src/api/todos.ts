import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3868;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (title: string) => {
  const newTodo: Omit<Todo, 'id'> = {
    title,
    userId: USER_ID,
    completed: false,
  };

  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};
