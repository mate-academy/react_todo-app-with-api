import { PostTodo } from '../types/PostTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (newTodo: PostTodo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoID: number) => {
  return client.delete(`/todos/${todoID}`);
};
