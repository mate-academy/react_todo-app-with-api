export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type PostTodo = Pick<Todo, 'userId' | 'title' | 'completed'>;

export type PatchTodo = Partial<Pick<Todo, | 'title' | 'completed'>>;
