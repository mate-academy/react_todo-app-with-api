import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type TodoCompleted = Pick<Todo, 'completed'>;
type TodoTitle = Pick<Todo, 'title'>;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const changeTodoStatus = (
  todoId: number, { completed } : TodoCompleted,
) => {
  return client.patch(`/todos/${todoId}`, { completed });
};

export const changeTodoTitle = (todoId: number, { title } : TodoTitle) => {
  return client.patch(`/todos/${todoId}`, { title });
};
