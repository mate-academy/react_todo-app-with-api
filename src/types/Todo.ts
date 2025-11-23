export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export const FILTERS = {
  all: 'all',
  active: 'active',
  completed: 'completed',
};

export type Filter = (typeof FILTERS)[keyof typeof FILTERS];
