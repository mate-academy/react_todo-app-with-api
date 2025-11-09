import { Todo } from './Todo';

export type TodoUpdate = Omit<Todo, 'id'>;
