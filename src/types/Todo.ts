export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum Filter {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export enum MakeTodosCompleted {
  do = 'do',
  not = 'not',
  begin = 'begin',
}
