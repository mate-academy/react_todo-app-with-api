import { ErrorType } from '../types/ErrorType';

export const USER_ID = 6955;

export const errorMessages: { [key in ErrorType]: string } = {
  [ErrorType.None]: '',
  [ErrorType.LoadTodos]: 'An error occurred while loading todos',
  [ErrorType.EmptyTitle]: 'Title can\'t be empty',
  [ErrorType.AddTodo]: 'Unable to add a todo',
  [ErrorType.DeleteTodo]: 'Unable to delete a todo',
  [ErrorType.DeleteCompletedTodo]: 'Unable to delete one of these todos',
  [ErrorType.UpdateTodo]: 'Unable to update a todo',
};
