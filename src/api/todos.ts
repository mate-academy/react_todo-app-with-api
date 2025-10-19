import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3567;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// export const updateTodoStatus = (id: number, completed: boolean) => {
//   return client.patch<Todo>(`/todos/${id}`, { completed });
// };

export const updateTodoStatus = ({
  id,
  completed,
}: Omit<Todo, 'userId' | 'title'>) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const updateTodoTitle = ({
  id,
  title,
}: Omit<Todo, 'userId' | 'completed'>) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};

export const addTodo = (title: string, completed = false) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
// Add more methods here
