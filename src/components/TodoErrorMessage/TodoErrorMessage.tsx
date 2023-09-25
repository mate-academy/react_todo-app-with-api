import classNames from 'classnames';

import { useEffect } from 'react';
import { UseTodosContext } from '../../utils/TodosContext';
import { ErrorMessages } from '../../types/ErrorMessages';

const ERROR_MESSAGE_DISSAPEAR_DELAY = 3000;

export const TodoErrorMessage = () => {
  const context = UseTodosContext();

  const {
    errorMessage,
    setErrorMessage,
  } = context;

  const removeErrorMessage = () => setErrorMessage(ErrorMessages.Default);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(removeErrorMessage, ERROR_MESSAGE_DISSAPEAR_DELAY);
    }
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        onClick={removeErrorMessage}
        type="button"
        className="delete"
        aria-label="hide error message"
      />
      {errorMessage}
    </div>
  );
};
