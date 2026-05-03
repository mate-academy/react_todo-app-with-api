import classNames from 'classnames';
import { ErrorType } from '../types/Error';
import React from 'react';

type Props = {
  error: ErrorType;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      {error === 'load' && 'Unable to load todos'}
      {error === 'title' && 'Title should not be empty'}
      {error === 'add' && 'Unable to add a todo'}
      {error === 'delete' && 'Unable to delete a todo'}
      {error === 'update' && 'Unable to update a todo'}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          onClose();
        }}
      />
    </div>
  );
};