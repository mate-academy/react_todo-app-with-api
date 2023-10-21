import { Todo } from '../types/Todo';
import { TodoSentToServer } from '../types/TodoSentToServer';
import { TodoUpdates } from '../types/TodoUpdates';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: TodoSentToServer) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (delatedTodoId: number) => {
  return client.delete(`/todos/${delatedTodoId}`);
};

export const changeTodo = (todoId: number, todoChanges: TodoUpdates) => {
  return client.patch<Todo>(`/todos/${todoId}`, todoChanges);
};
