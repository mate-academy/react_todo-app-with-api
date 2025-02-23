import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1623;

const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

const createTodo = ({
  title,
  userId = USER_ID,
  completed,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, {
    title,
    userId,
    completed,
  });
};

const updateTodo = (updatedTodo: Todo) =>
  client.patch<Todo>(`/todos/${updatedTodo.id}`, updatedTodo);

export const todosService = {
  getAll: getTodos,
  create: createTodo,
  delete: deleteTodo,
  update: updateTodo,
};
