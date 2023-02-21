export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TodoPart {
  userId: number;
  title: string;
  completed: boolean;
}
