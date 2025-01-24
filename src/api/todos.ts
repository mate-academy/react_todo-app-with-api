import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type NewValue = {
  title?: string;
  completed?: boolean;
};

export const USER_ID = 2244;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const addTodo = (todoData: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todoData);
};

export const deleteTodo = (todo: Todo) => {
  return client.delete(`/todos/${todo.id}`);
};

export const checkTodo = ({
  id,
  newValue,
}: {
  id: number;
  newValue: NewValue;
}) => {
  return client.patch<Todo>(`/todos/${id}`, newValue);
};
