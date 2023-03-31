import { Todo } from '../types/Todo';
import { NewTodo } from '../types/NewTodo';
import { client } from '../untils/fetchClient';
import { TypeFilter } from '../components/Filter/Filter';

export const getTodos = (userId: number, filter?: string) => {
  if (filter === TypeFilter.ALL) {
    return client.get<Todo[]>(`/todos?userId=${userId}${''}`);
  }

  if (filter === TypeFilter.ACTIVE) {
    return client.get<Todo[]>(`/todos?userId=${userId}${'&completed=false'}`);
  }

  return client.get<Todo[]>(`/todos?userId=${userId}${'&completed=true'}`);
};

export const postTodo = (data:NewTodo) => {
  return client.post<NewTodo>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (id: number, completed: boolean) => {
  return client.patch(`/todos/${id}`, { completed });
};

export const patchTodoTitle = (id: number, title: string) => {
  return client.patch(`/todos/${id}`, { title });
};
