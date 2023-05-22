export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TodoTitle {
  title: string;
}

export interface TodoStatus {
  completed: boolean;
}
