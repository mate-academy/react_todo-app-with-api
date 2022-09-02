export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type NewTodo = Omit<Todo, 'id'>;

export type Compete = Pick<Todo, 'completed'>;

export type Edit = Pick<Todo, 'title'>;

export type FilterType = 'all' | 'active' | 'completed';
