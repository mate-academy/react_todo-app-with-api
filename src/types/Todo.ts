export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type UpdateTodoDto = Partial<Omit<Todo, 'id'>>;
