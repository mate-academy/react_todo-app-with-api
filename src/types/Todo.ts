export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type UpdateTodoArgs = Partial<Pick<Todo, 'title' | 'completed'>>;
