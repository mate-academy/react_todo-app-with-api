import { TempTodo } from './TempTodo';

export interface Todo extends TempTodo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}
