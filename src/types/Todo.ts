export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TodoUpdate {
  completed?: boolean;
  title?: string;
}
