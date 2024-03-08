import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodosFromServer = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postNewTodoOnServer = (newTodo: Todo) => {
  return client.post('/todos', newTodo);
};

export const editTodoOnServer = (todoId: number, data: any) => {
  return client.patch(`/todos/${todoId}`, data);
};

export const deleteTodoFromServer = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
