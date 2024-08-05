import { memo, useContext } from 'react';
import cn from 'classnames';
import { TodosContext } from '../store/TodosContext';

export const ErrorMessage = memo(function ErrorMessageComponent() {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete hidden"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
});
