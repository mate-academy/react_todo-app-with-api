export enum ErrorType {
  NONE = '',
  LOAD = 'Unable to load todos',
  ADD = 'Unable to add a todo',
  UPDATE = 'Unable to update a todo',
  DELETE = 'Unable to delete a todo',
  TITLE = 'Title can\'t be empty',
}

export enum FilterType {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}
