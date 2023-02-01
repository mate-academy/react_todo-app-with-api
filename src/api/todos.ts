import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

const addTodo = (fieldsToCreate: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', fieldsToCreate);
};

const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`)
    .then(Boolean);
};

export const updateTodo = (
  todoId: number,
  updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
) => {
  const url = `/todos/${todoId}`;

  return client.patch<Todo>(url, updateData);
};

export const todosApi = {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
};
