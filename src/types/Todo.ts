export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface UpdatedTodo {
  id: number;
  title?: string;
  completed?: boolean;
}
