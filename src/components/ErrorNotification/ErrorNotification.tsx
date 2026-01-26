import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  error: ErrorType | null;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, onClose }) => {
  const isHidden = error === null;

  const getErrorMessage = () => {
    switch (error) {
      case ErrorType.LoadTodos:
        return 'Unable to load todos';

      case ErrorType.AddTodo:
        return 'Unable to add a todo';

      case ErrorType.DeleteTodo:
        return 'Unable to delete a todo';

      case ErrorType.EmptyTitle:
        return 'Title should not be empty';

      case ErrorType.UpdateTodo:
        return 'Unable to update a todo';

      default:
        return '';
    }
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isHidden },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />

      {getErrorMessage()}
    </div>
  );
};
