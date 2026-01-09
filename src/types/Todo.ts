export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoUpdateData = Pick<Todo, 'id'> & Partial<Omit<Todo, 'id'>>;
