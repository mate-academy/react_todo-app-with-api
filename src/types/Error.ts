export enum ErrorMsg {
  AddError = 'Unable to add a todo',
  UpdateError = 'Unable to update a todo',
  DeleteError = 'Unable to delete a todo',
  TitleError = 'Title can\'t be empty',
  NoError = '',
}

export type Error = [boolean, ErrorMsg];

export type SetError = (err?: boolean, msg?: ErrorMsg) => void;
