import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export type TodoTitle = Pick<Todo, 'title'>;
export type TodoComplete = Pick<Todo, 'completed'>;

export const addTodo = (title : string, userId: number) => {
  return client.post<Todo>('/todos', { title, userId, completed: false });
};

export const deleteTodo = (id : number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (
  todoId: number,
  newData: TodoComplete | TodoTitle,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, newData);
};
