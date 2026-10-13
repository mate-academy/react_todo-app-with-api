export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoChanges = Partial<Pick<Todo, 'title' | 'completed'>>;
