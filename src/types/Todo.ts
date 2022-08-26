export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type addedTodo = Pick<Todo, 'userId' | 'title' | 'completed'>;
