import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 560;

export const getTodosFromServer = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodoToServer = (newTodo: Todo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodoFromServer = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  updatedTodoPartial: Partial<Todo>,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, updatedTodoPartial);
};
// Add more methods here
