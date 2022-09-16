import { Todo } from './Todo';

export type TodoFragment = Pick<Todo, 'userId' | 'title' | 'completed'>;

export type PatchTodoFragment = Partial<Omit<Todo, 'id' | 'userId'>>;
