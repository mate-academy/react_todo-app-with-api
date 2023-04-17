export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface PathchingTodo {
  title?: string;
  completed?: boolean;
}
