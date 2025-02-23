import { Todo } from './Todo';

export type UpdateTodoData = Partial<Omit<Todo, 'id' | 'userId'>>;
