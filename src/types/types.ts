export const enum FilteredBy {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}
