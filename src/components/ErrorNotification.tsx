/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  onAddTodoError: (errorMessage: string) => void;
  todosError: string;
};

export const ErrorNotification: React.FC<Props> = ({
  onAddTodoError,
  todosError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !todosError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onAddTodoError('')}
      />
      {todosError}

    </div>
  );
};
