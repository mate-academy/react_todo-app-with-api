import { Todo } from '../Types/Todo';
import { client } from '../Utils/fetchClient';

export const USER_ID = 534;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (newTodo: Todo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
