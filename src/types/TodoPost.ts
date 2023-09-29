import { Todo } from './Todo';

export type TodoPost = Omit<Todo, 'id'>;
