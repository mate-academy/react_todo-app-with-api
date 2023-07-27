import { Todo, TodoData } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { USER_ID } from '../utils/user';

export function getTodos() {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
}

export function addTodo(title: string, completed: boolean) {
  return client.post<Todo>('/todos', { userId: USER_ID, title, completed });
}

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export function updateTodo(todoId: number, data: TodoData) {
  return client.patch<Todo>(`/todos/${todoId}`, data);
}
