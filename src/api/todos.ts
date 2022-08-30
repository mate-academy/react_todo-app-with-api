import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: Todo): Promise<Todo> => {
  return client.post<Todo>('/todos', {
    userId: todo.userId,
    title: todo.title,
    completed: todo.completed,
  });
};

export const changeTodoStatus = (todo: Todo): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todo.id}`, { completed: !todo.completed });
};

export const deleteTodo = (todo: Todo) => {
  return client.delete(`/todos/${todo.id}`);
};

export const changeTodoTitle = (todo: Todo, title:string): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todo.id}`, { title });
};
