import React, { useEffect } from 'react';
import cn from 'classnames';

interface TodoErrorsProps {
  errors: string;
  onUpdateError: (error: string) => void;
}

export const TodoErrors: React.FC<TodoErrorsProps> = ({
  errors,
  onUpdateError,
}) => {
  useEffect(() => {
    if (!errors) {
      return;
    }

    const timerId = setTimeout(() => {
      onUpdateError('');
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errors, onUpdateError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errors,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className={cn(errors && 'delete')}
        onClick={() => onUpdateError('')}
      />
      {errors}
    </div>
  );
};
