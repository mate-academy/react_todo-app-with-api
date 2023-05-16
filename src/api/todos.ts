import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

interface PostDataType {
  title:string,
  completed:boolean
}

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, postData: PostDataType) => {
  const { title, completed } = postData;

  return client.post<Todo>('/todos', {
    title,
    userId,
    completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodoCompleted = (todoId: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    completed,
  });
};

export const patchTodoTitle = (todoId: number, title: string) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    title,
  });
};
