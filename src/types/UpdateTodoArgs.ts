import { Todo } from './Todo';

export type UpdateTodoArgs = Partial<Omit<Todo, 'id' | 'userId'>>;

export type UpdateTodosArgs = {
  id: number,
  data: UpdateTodoArgs
};
