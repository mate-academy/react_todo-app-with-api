export enum ErrorType {
  NoError = 'No error',
  InputError = 'Title cannot be empty',
  GetAllTodosError = 'Unable to load todos',
  NewTodoError = 'Unable to add a todo',
  DeleteTodoError = 'Unable to delete a todo',
  UpdateTodoError = 'Unable to update a todo',
}

export enum FilterType {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}
