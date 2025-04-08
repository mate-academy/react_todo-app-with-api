export enum FilterBy {
  All = 'FilterLinkAll',
  Active = 'FilterLinkActive',
  Completed = 'FilterLinkCompleted',
}

export enum TempTodoAction {
  add,
  remove,
}

export enum ERROR {
  no_error = '',
  todos = 'Unable to load todos',
  title = 'Title should not be empty',
  add = 'Unable to add a todo',
  delete = 'Unable to delete a todo',
  update = 'Unable to update a todo',
}
