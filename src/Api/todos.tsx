import { NewTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchclient';

// This function let us take data from api
export const getTodosByUserId = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// This function let us delete TODO from api
export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

// This function let us add TODO to api
export const createTodo = (todo: NewTodo) => {
  return client.post<Todo>('/todos', todo);
};

// This function let us update information about TODO on api
export const updateTodo = (
  todoId: number,
  property: Partial<Todo>,
) => {
  return client.patch(`/todos/${todoId}`, property);
};
