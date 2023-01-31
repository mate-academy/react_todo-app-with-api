import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

const addTodo = (fieldsToCreate: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', fieldsToCreate);
};

const deleteTodo = (id: number) => {
  return client.delete<number>(`/todos/${id}`)
    .then(Boolean);
};

const updateTodo = (
  todoId: number,
  updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
) => {
  const url = `/todos/${todoId}`;

  return client.patch<Todo>(url, updateData);
};

export const todoApi = {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
};

// Add more methods here
