export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum FilterStatus {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export type UpdateTodoArgs = Partial<Pick<Todo, 'title' | 'completed'>>;
