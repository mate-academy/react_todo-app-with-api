export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type UpdatedTodo = Partial<Omit<Todo, 'id' | 'userId'>>;
