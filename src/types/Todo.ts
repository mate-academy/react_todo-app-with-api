export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TodoToFetch {
  userId: number;
  title: string;
  completed: boolean;
}
