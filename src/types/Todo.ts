export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type UpdateData = Pick<Todo, 'title'> | Pick<Todo, 'completed'>;

export type NewTodo = Omit<Todo, 'id'>;
