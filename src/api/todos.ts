import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2154;
const todosLink = '/todos';

export const getTodos = () => {
  return client.get<Todo[]>(`${todosLink}?userId=${USER_ID}`);
};

export const addTodo = (todo: Omit<Todo, 'id' | 'userId' | 'completed'>) => {
  return client.post<Todo>(`${todosLink}`, {
    ...todo,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`${todosLink}/${todoId}`);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`${todosLink}/${todo.id}`, todo);
};

// Add more methods here
