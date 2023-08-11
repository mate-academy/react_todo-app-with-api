export enum ErrorType {
  Server = 'Unable to fetch todos',
  Validation = 'Title can\'t be empty',
  Post = 'Unable to add todo',
  Delete = 'Unable to delete a todo',
  Patch = 'Unable to update todo',
  ClearCompleted = 'Clear completed error',
}
