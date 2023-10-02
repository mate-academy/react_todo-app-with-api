import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClients';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export function postTodo(todo: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', todo);
}

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export const updateTodo = (id: number, todo: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, todo);
};
