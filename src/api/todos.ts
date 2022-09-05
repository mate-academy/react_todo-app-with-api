import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

type TodoData = Pick<Todo, 'title'>;

export const AddTodo = async ({ title }: TodoData) => {
  return client.post<Todo>('/todos', { title, completed: false });
};
// Add more methods here
