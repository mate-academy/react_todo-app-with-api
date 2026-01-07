export enum UpdateTodo {
  Title = 'title',
  Status = 'status',
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum FilterBy {
  All = '',
  Completed = 'completed',
  Active = 'active',
}

export enum ErrorMessage {
  None = '',
  Load = 'Unable to load todos',
  TitleValidation = 'Title should not be empty',
  Create = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
}
