import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const USER_ID = 5997;

export const getTodos = (userId: number = USER_ID) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

type TodoWithoutId = {
  title: string,
  userId: number,
  completed: boolean
};

export const postTodos = (todo: TodoWithoutId) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({ id, title, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed });
};
