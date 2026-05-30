export type FilterType = 'all' | 'active' | 'completed';

export type Todo = {
  id: number | string;
  userId: number;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
  isTemp?: boolean;
};
