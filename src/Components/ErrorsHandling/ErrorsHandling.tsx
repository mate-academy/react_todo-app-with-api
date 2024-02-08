/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
} from 'react';
import cn from 'classnames';
import { TodoContext } from '../../TodoContext';

export const ErrorsHandling: React.FC = React.memo(() => {
  const {
    error,
    setError,
  } = useContext(TodoContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: !error,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setError('');
        }}
      />
      {error === 'Unable to load todos' && (
        'Unable to load todos'
      )}
      {error === 'Title should not be empty' && (
        'Title should not be empty'
      )}
      {error === 'Unable to add a todo' && (
        'Unable to add a todo'
      )}
      {error === 'Unable to delete a todo' && (
        'Unable to delete a todo'
      )}
      {error === 'Unable to update a todo' && (
        'Unable to update a todo'
      )}
    </div>
  );
});
