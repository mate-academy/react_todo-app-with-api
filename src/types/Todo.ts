export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type NewTodo = Omit<Todo, 'id'>;

export type TodoUpdateFields = Partial<Omit<Todo, 'id'>>;
