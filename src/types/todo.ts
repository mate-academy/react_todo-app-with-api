export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum TodoStatus {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}
