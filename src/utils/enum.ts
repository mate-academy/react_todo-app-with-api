export enum FilterBy {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export enum Errors {
  Null = '',
  Add = 'Unable to add a todo',
  Edit = 'Unable to edit a todo',
  Fetch = 'Unable to fetch todos',
  UpdateStatus = 'Unable to update the todo status',
  UpdateTodo = 'Unable to update a todo',
  Delete = 'Unable to delete the todo',
  Empty = 'Title cannot be empty',
}
