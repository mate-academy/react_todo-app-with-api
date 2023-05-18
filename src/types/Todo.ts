export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface Update {
  completed?: boolean;
  title?: string;
}
