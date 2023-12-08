/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { ErrorType } from '../types/ErrorType';

export type ErrorMessageProps = {
  errorText: ErrorType | null
  setErrorText: (error: ErrorType | null) => void
};

export const ErrorMessage = ({
  errorText, setErrorText,
} : ErrorMessageProps) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorText === null },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorText(null)}
      />
      {errorText}
    </div>
  );
};
