import { Todo } from './Todo';

export type UpdateTodo = Omit<Todo, 'userId'>;
