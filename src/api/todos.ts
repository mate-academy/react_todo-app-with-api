import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export function delTodos(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export function createTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { userId, title, completed });
}

export function updateTodo(todo: Todo) {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
}

// export const updateTodo = (id: number, title: string) => {
//   return client.patch<Todo>(`/todos/${id}`, title);
// };
