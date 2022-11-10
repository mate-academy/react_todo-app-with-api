import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = async (userId: number) => {
  const todo = await client.get<Todo[]>(`/todos?userId=${userId}`);

  return todo || null;
};

type TodoData = Omit<Todo, 'id'>;

export const createTodos = async (
  {
    userId,
    title,
    completed,
  }: TodoData,
) => {
  return client.post<Todo[]>('/todos', {
    userId,
    title,
    completed,
  });
};

export const deleteTodos = async (todo: Todo) => {
  return client.delete(`/todos/${todo.id}`);
};

export const UpdateTodo = async (todo:Todo, value: boolean | string) => {
  if (typeof value === 'boolean') {
    return client.patch(`/todos/${todo.id}`, { completed: value });
  }

  return client.patch(`/todos/${todo.id}`, { title: value });
};
