import classNames from 'classnames';
import { ErrorType } from '../types/Todo';

type ErrorPopupProps = {
  error: string | null;
  setError: (error: ErrorType | null) => void;
};
export const ErrorPopup: React.FC<ErrorPopupProps> = ({ error, setError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
      {error}
    </div>
  );
};
