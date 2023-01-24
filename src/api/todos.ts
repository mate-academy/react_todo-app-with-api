import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

type TodoData = Omit<Todo, 'id'>;

export const postTodos = (newTodo: TodoData) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (id: number, todo: Todo): Promise<Todo> => {
  return client.patch(`/todos/${id}`, todo);
};
