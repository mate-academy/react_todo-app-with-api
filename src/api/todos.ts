import { createNewTodo } from '../helpers/createNewTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (title: string) => {
  const newTodo = createNewTodo(title);

  return client.post<Todo>('/todos', newTodo);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const toggleTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, { completed: !todo.completed });
};

export const changeTodoTitle = (todoId: number, title: string) => {
  return client.patch<Todo>(`/todos/${todoId}`, { title });
};
