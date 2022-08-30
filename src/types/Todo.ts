export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface CreateTodo {
  userId: number;
  title: string;
  completed: boolean;
}
