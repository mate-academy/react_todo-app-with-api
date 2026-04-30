export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export enum Filter {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

export type ItemType = {
  id: string | number;
  checked: boolean;
};
