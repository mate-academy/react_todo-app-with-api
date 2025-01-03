import React from 'react';
import cn from 'classnames';
import { TodoError } from '../types/types';

interface Props {
  error: TodoError | '';
  setErrors: (error: TodoError | '') => void;
}

export const Errors: React.FC<Props> = ({ error, setErrors }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn({
        'notification is-danger is-light has-text-weight-normal': error,
        hidden: !error,
      })}
    >
      {error && (
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrors('')}
        />
      )}
      {error}
    </div>
  );
};
