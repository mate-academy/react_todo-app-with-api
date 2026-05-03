export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type NewTodo = Omit<Todo, 'id'>;

export interface UpdateTodo {
  id: number;
  completed: boolean;
}
export interface EditTodo {
  id: number;
  title: string;
}
