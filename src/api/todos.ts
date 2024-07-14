import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 882;

const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

const onDelete = (todoId: number) => {
  return client.delete<number>(`/todos/${todoId}`);
};

const handleAddTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', newTodo);
};

const updateTodo = (todo: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};

export const todoService = {
  getTodos,
  onDelete,
  handleAddTodo,
  updateTodo,
};
