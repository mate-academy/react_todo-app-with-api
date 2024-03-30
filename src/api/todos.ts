import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { USER_ID } from './config';

const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

const deleteTodo = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};

const createTodo = (todo: Pick<Todo, 'title' | 'userId' | 'completed'>) => {
  return client.post<Todo>(`/todos/`, todo);
};

const patchTodo = ({
  id,
  ...updatetedTodo
}: Partial<Todo> & Pick<Todo, 'id'>) => {
  return client.patch<Todo>(`/todos/${id}`, updatetedTodo);
};

export const todosApi = {
  get: getTodos,
  delete: deleteTodo,
  create: createTodo,
  patch: patchTodo,
};
// Add more methods here
