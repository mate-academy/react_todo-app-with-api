/* eslint-disable jsx-a11y/control-has-associated-label */
import { ErrorType } from '../../types/Error';

type Props = {
  error: ErrorType;
  handleDeleteNotification: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  handleDeleteNotification,
}) => {
  const Errors = {
    [ErrorType.None]: '',
    [ErrorType.Loading]: 'Unable to load a todo',
    [ErrorType.Post]: 'Unable to add a todo',
    [ErrorType.EmptyTitle]: 'Title can\'t be empty',
    [ErrorType.Delete]: 'Unable to delete a todo',
    [ErrorType.Update]: 'Unable to update a todo',
  };

  return (
    <div
      className={`notification is-danger is-light has-text-weight-normal ${!error && 'hidden'}`}
    >
      <button
        type="button"
        className="delete"
        onClick={handleDeleteNotification}
      />

      {Errors[error]}
    </div>
  );
};
