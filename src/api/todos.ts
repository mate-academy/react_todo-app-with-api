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

export const updateTodo = async (
  todo:Todo,
  value: Partial<Omit<Todo, 'id'>>,
) => {
  return client.patch(`/todos/${todo.id}`, value);
};
