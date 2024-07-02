import { Todo } from './Todo';

export type TempTodo = Todo | null;
export enum FilterOption {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}
