import { Todo } from './Todo';

export type AddTodo = Omit<Todo, 'id'>;
