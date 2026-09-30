export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoUpdate = Partial<Pick<Todo, 'title' | 'completed'>>;
