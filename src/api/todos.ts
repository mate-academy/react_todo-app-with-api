import { Todo, SendedTodo } from '../types/types';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => (
  client.get<Todo[]>(`/todos?userId=${userId}`)
);

export const addTodo = (todo: SendedTodo) => (
  client.post<SendedTodo>('/todos', todo)
);

export const removeTodo = (itemId: number) => (
  client.delete(`/todos/${itemId}`)
);

export const editTodo = (todo: Todo) => (
  client.patch(`/todos/${todo.id}`, todo)
);
