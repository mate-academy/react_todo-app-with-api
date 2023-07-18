import { Todo } from './Todo';

export type UpdateTodoArgs = Partial<Pick<Todo, 'completed' | 'title'>>;
