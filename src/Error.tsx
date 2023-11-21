import { useContext } from 'react';
import cn from 'classnames';
import { TodosContext } from './TodoContext';
import { ErrorMessage } from './types/Error';

export const Error = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification',
        'is-danger', 'is-light', 'has-text-weight-normal', {
          hidden: errorMessage === ErrorMessage.None,
        })}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessage.None)}
        aria-label="Close error message"
      />
      {errorMessage}
    </div>
  );
};
