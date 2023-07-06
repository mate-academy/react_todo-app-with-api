import { PostTodo } from '../types/PostTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

const postTodo = (newTodo: PostTodo) => {
  return client.post<Todo>('/todos', newTodo);
};

const deleteTodo = (todoID: number) => {
  return client.delete(`/todos/${todoID}`);
};

const editTodo = (
  todoID: number, data: Partial<Todo>,
): Promise<Todo> => {
  return client.patch(`/todos/${todoID}`, data);
};

export const todosReguest = {
  getTodos,
  postTodo,
  deleteTodo,
  editTodo,
};
