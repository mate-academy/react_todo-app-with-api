import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = () => {
  return client.get<Todo[]>('/todos?userId=11497');
};

export const addNewTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodoById = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoById = (
  todoId: number,
  data: Partial<Todo>,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
