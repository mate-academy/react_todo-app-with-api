export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum SortType {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}
