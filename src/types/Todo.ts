export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type CreateTodoArgs = Omit<Todo, 'id'>;

export type UpdateTodoArgs = Partial<Pick<Todo, 'title' | 'completed'>>;
