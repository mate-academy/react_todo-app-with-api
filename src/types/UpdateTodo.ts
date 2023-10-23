import { Todo } from './Todo';

export type UpdateTodo = Partial<Pick<Todo, 'title' | 'completed'>>;
