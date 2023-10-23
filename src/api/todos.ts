import { CreateTodo } from '../types/CreateTodo';
import { Todo } from '../types/Todo';
import { UpdateTodo } from '../types/UpdateTodo';
import { client } from '../utils/fetchClient';

const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

const createTodo = (args: CreateTodo) => {
  return client.post<Todo>('/todos', args);
};

const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

const updateTodo = (id: number, args: UpdateTodo) => {
  return client.patch<Todo>(`/todos/${id}`, args);
};

export const todosApi = {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
};
