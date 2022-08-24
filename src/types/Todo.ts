export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type addedTodo = Pick<Todo, 'userId' | 'title' | 'completed'>;
