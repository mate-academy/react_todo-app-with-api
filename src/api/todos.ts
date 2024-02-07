import { Todo } from '../types/Todo';
import { PatchCompleteTodo } from '../types/PatchCompleteTodo';
import { client } from '../utils/fetchClient';
import { PatchTitleTodo } from '../types/PatchTitleTodo';

export const getTodos = async (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodos = (data: Todo) => {
  return client.post<Todo>('/todos', data);
};

export const patchTodos = (
  todoId : number,
  data: PatchCompleteTodo | PatchTitleTodo,
) => {
  return client.patch<Todo[]>(`/todos/${todoId}`, data);
};

export const deleteTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};
