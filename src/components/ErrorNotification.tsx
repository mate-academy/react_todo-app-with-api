import classNames from 'classnames';
import { ErrorType } from '../types/ErrorType';

type Props = {
  todoError: ErrorType | null,
  setTodoError: (error: ErrorType | null) => void
};

export const ErrorNotification: React.FC<Props> = ({
  todoError,
  setTodoError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !todoError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setTodoError(null)}
        aria-label="HideErrorButton"
      />
      {todoError}
    </div>
  );
};
