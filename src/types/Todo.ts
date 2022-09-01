export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type CreateTodoFragment = Pick<Todo, 'title' | 'userId' | 'completed'>;

export type UpdateTodoFragment = Partial<Omit<Todo, 'id' | 'userId'>>;
