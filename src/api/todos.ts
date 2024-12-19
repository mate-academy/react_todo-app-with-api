import { TODOS_API_PATH } from '../constants/api';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1826;

export const getTodos = () => {
  return client.get<Todo[]>(`${TODOS_API_PATH}?userId=${USER_ID}`);
};

export const getTodoById = (id: number) => client.get(`/todos/${id}`);

export const getAllCompletedTodoByUserId = (id: number) => {
  client.get(`${TODOS_API_PATH}?userId=${id}&completed=true`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) =>
  client.post<Todo>(TODOS_API_PATH, { title, completed, userId });

export const updateTodo = (todo: Todo, id: number): Promise<Todo> =>
  client.patch(`${TODOS_API_PATH}/${id}`, todo);

export const deleteTodo = (id: number) =>
  client.delete(`${TODOS_API_PATH}/${id}`);
