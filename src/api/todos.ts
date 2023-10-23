import { Todo } from '../types/Todo';
import { UpdateTodoArgs } from '../types/UpdateTodoArgs';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here post, patch, delete
// export const postTodos = ()
export const postTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (id: number, data: UpdateTodoArgs) => {
  return client.patch(`/todos/${id}`, data);
};
