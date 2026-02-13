export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoChangeOptions = Partial<Pick<Todo, 'completed' | 'title'>>;
