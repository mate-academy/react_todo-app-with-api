import { EditTodo, NewTodo, Todo, UpdateTodo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4099;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (newTodo: NewTodo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (idTodo: number) => {
  return client.delete(`/todos/${idTodo}`);
};

export const updateTodo = ({ id, completed }: UpdateTodo) => {
  return client.patch<Todo>(`/todos/${id}`, { completed: !completed });
};

export const editingTodo = ({ id, title }: EditTodo) => {
  return client.patch<Todo>(`/todos/${id}`, { title: title });
};
