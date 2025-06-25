export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type AddTodo = Omit<Todo, 'id'>;

export interface PatchTodo {
  id: number;
  title?: string;
  completed?: boolean;
}
