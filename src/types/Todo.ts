export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type CreateTodoFragment = Omit<Todo, 'id'>;

export type EditedTodoFragment = Partial<Omit<Todo, 'id'>>;
