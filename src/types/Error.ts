export enum ErrorMessages {
  None = '',
  ErrorLoadTodos = 'Unable to load todos',
  EroroTitle = "Title can't be empty",
  ErrorRemove = 'Unable to remove todo',
  ErrorAddTodo = 'Unable to add todo',
  ErrorUpdate = 'Unable to update a todo',
}

export type Error = {
  isError: boolean;
  message: ErrorMessages;
};
