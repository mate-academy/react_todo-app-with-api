export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type OmitedTodo = Omit<Todo, 'id'>;

export type TodoUpdate = { title: string } | { completed: boolean };
