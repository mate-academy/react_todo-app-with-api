export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoEdit = Partial<Todo>;
export type TodoAdd = Omit<Todo, 'id'>;

export type SortTypes = 'all' | 'completed' | 'active';

export type ErrorTypes
  = 'Title should not be empty'
  | 'Unable to load todos'
  | 'Unable to add a todo'
  | 'Unable to delete a todo'
  | 'Unable to update a todo';
