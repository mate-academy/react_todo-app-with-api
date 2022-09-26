export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum FilterType {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export type TodoFragment = Pick<Todo, 'userId' | 'title' | 'completed'>;
