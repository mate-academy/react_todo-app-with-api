import { Todo } from './Todo';

export type UpdateTodoArgs = Partial<Pick<Todo, 'title' | 'completed'>>;
