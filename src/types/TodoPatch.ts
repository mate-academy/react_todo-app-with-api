import { Todo } from './Todo';

export type TodoPatch = Pick<Todo, 'completed'> | Pick<Todo, 'title'>;
