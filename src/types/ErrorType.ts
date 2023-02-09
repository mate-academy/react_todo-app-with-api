export enum ErrorType {
  None = '',
  RegisteringError = 'Something went wrtong',
  LoadingError = 'No todos were loaded!',
  AddingError = 'Unable to add a todo',
  RemovingError = 'Unable to delete a todo',
  UpdatingError = 'Unable to update a todo',
  TitleError = 'Title can\'t be empty',
}
