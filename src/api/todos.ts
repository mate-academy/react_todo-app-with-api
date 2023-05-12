/* eslint-disable quote-props */
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type PostDataType = {
  title:string,
  completed:boolean
};

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, postData: PostDataType) => {
  return client.post<Todo>('/todos', {
    'title': postData.title,
    'userId': userId,
    'completed': postData.completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodoCompleted = (todoId: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    'completed': completed,
  });
};

export const patchTodoTitle = (todoId: number, title: string) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    'title': title,
  });
};
