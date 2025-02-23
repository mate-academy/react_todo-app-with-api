import { Todo } from './Todo';

export interface TodoUpdate {
  id: number;
  field: keyof Todo;
}
