export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoFragment = Pick<Todo, 'userId' | 'title' | 'completed'>;
