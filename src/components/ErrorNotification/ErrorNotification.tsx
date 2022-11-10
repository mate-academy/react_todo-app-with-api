import { FC } from 'react';

type Props = {
  onClose: () => void;
  closeError: () => void;
  emptyTitleError: boolean;
  addingError: boolean;
  deletingError: boolean;
  updatingError: boolean;
};

export const ErrorNotification: FC<Props> = ({
  onClose,
  closeError,
  emptyTitleError,
  addingError,
  deletingError,
  updatingError,
}) => {
  onClose();

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeError}
      />

      {emptyTitleError && 'Title can\'t be empty'}
      {addingError && 'Unable to add a todo'}
      {/* <br /> */}
      {deletingError && 'Unable to delete a todo'}
      {/* <br /> */}
      {updatingError && 'Unable to update a todo'}
    </div>
  );
};
