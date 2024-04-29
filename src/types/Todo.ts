export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum Select {
  'All',
  'Active',
  'Completed',
}
