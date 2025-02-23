import { client } from '../client/client';
import { Todo } from '../types/Todo';

export const USER_ID = 377;

export const getTodosByUserId = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodoById = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addNewTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, userId, completed });
};

export const updateTodoById = ({
  title,
  completed,
  id,
}: Omit<Todo, 'userId'>) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed });
};
