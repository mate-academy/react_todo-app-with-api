import { CreateTodoFragment, EditedTodoFragment, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (
  enteredTodo: CreateTodoFragment,
):Promise<Todo> => {
  return client.post<Todo>('/todos', enteredTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const editTodo = (
  todoId: number,
  editedTodo: EditedTodoFragment,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, editedTodo);
};
