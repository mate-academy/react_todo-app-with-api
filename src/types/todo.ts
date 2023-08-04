export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoForServer = {
  completed?: boolean;
  title?: string;
};

export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export enum Error {
  Not = '',
  Add = 'add',
  Delete = 'delete',
  Update = 'update',
  Empty = 'empty',
  Load = 'load',
}
