export enum ErrorMessage {
  AddError = 'Unable to add a todo',
  UpdateError = 'Unable to update a todo',
  DeleteError = 'Unable to delete a todo',
  TitleError = "Title can't be empty",
  NoError = '',
}

export type Error = [boolean, ErrorMessage];

export type SetError = (err?: boolean, msg?: ErrorMessage) => void;
