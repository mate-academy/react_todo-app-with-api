import { Todo } from '../types/Todo';
import { axiosClient } from '../utils/axiosCilent';

export const USER_ID = 4239;

export const getTodos = () => {
  return axiosClient
    .get<Todo[]>(`/todos?userId=${USER_ID}`)
    .then(response => response.data);
};

export const updateAll = (items: Todo[]): Promise<Todo[]> => {
  return axiosClient
    .patch('/todos?action=delete', { items })
    .then(response => response.data);
};

export const addTodo = (newTodo: Omit<Todo, 'id' | 'userId'>) => {
  return axiosClient
    .post('/todos', { ...newTodo, userId: USER_ID })
    .then(response => response.data);
};

export const deleteTodo = (todoId: number) => {
  return axiosClient.delete(`/todos/${todoId}`);
};

export const updateTodo = (todo: Partial<Todo> & { id: number }) => {
  return axiosClient
    .patch(`/todos/${todo.id}`, todo)
    .then(response => response.data);
};

export const clearCompleted = (ids: number[]) => {
  return axiosClient
    .patch<Todo[]>('/todos?action=delete', { ids })
    .then(response => response.data);
};
