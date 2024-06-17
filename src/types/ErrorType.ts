export type ErrorType = {
  empty: string;
  load: string;
  add: string;
  found: string;
  deleteTask: string;
  updateTodo: string;
};

export const errorType: ErrorType = {
  empty: 'Title should not be empty',
  load: 'Unable to load todos',
  add: 'Unable to add a todo',
  found: 'Todo not found',
  deleteTask: 'Unable to delete a todo',
  updateTodo: 'Unable to update a todo',
};
