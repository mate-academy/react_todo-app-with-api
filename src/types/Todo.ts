export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoData = Pick<Todo, 'title' | 'completed'>
| Pick<Todo, 'title'>
| Pick<Todo, 'completed'>;
