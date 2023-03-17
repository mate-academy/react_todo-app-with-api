export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface SendTodo {
  userId: number,
  title: string,
  completed: boolean,
}

export enum FilteredBy {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export interface TodoStatus {
  completed: boolean;
}
