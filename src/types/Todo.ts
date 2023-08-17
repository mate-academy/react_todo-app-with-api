export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoForChange = Partial<Pick<Todo, 'title' | 'completed'>>;
