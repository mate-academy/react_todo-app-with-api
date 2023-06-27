import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const fetchTodos = async (userId: string): Promise<Todo[]> => {
  try {
    const arrTodos = await client.get<Todo[]>(`/todos?userId=${userId}`);

    return arrTodos;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const addOneTodo = (userId: number, todo: Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const updateTodos = (todoId: number, title: string) => {
  return client.patch<Todo>(`/todos/${todoId}`, { title });
};

export const complited = (todoId: number, todo: Todo) => {
  return client.patch<Todo>(`/todos/${todoId}`, { completed: todo.completed });
};

export const complitedAll = (ids: number[], todos: Todo[]): Promise<Todo[]> => {
  const complitedReq = ids.map((id, index) => complited(id, todos[index]));

  return Promise.all(complitedReq);
};

export const remove = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const removeTodos = (ids: number[]) => {
  const deleteReq = ids.map(id => remove(id));

  return Promise.all(deleteReq);
};
