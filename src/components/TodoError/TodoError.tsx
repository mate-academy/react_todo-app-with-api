import classNames from 'classnames';
import { useContext } from 'react';
import { ErrorContext } from '../ErrorContextProvider/ErrorContextProvider';
import { ErrorMessage } from '../../types/ErrorMessage';

export const TodoError = () => {
  const { setErrorMessage, errorMessage } = useContext(ErrorContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        'notification',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessage.None)}
        aria-label="close the error"
      />
      {errorMessage}
    </div>
  );
};
