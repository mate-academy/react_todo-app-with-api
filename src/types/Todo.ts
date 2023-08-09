export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoData = Omit<Todo, 'id'>;

export type TodoUpdateData = Partial<Pick<Todo, 'title' | 'completed'>>;
