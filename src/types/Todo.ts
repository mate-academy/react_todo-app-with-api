export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface CreatedTodo {
  title?: string,
  completed?: boolean,
  userId: number,
}

export type UpdatedTodo = Partial<Omit<Todo, 'id' | 'userId'>>;
