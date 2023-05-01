export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type SendedTodo = Omit<Todo, 'id'>;

export type LoadTodos = () => void;

export enum FILTERS {
  all = 'All',
  completed = 'Completed',
  active = 'Active',
}

export enum ErrorTypes {
  none = '',
  get = 'Unable to get todos',
  add = 'Unable to add todo',
  delete = 'Unable to delete a todo',
  emptyTitle = "The title can't be empty",
  edit = "Csan't update todo",
}
