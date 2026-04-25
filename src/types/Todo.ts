import { FILTERS } from '../constants';

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TodoUpdate = Partial<Pick<Todo, 'title' | 'completed'>>;

export type FilterStatus = (typeof FILTERS)[keyof typeof FILTERS];
