export enum TodoError {
  LoadError = 'Unable to load todos',
  AddError = 'Unable to add a todo',
  DeleteError = 'Unable to delete a todo',
  UpdateError = 'Unable to update a todo',
  ToggleError = 'Unable to toggle todos',
  EmptyTitleError = 'Title should not be empty',
}

export enum Filter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}
