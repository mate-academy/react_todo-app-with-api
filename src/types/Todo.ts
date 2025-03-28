export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum Errors {
  TitleError = 'Title should not be empty',
  AddTodoError = 'Unable to add a todo',
  UpdateTodoError = 'Unable to update a todo',
  LoadTodoError = 'Unable to load todos',
  DeleteTodoError = 'Unable to delete a todo',
  None = ''
}
