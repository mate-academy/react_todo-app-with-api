export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type UpdatingTodo = Partial<Pick<Todo, 'title' | 'completed'>>;
