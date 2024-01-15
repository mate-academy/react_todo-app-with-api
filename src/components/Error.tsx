/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { useContext } from 'react';
import { TodosContext } from './TodoContext';

export const Error: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);
  let isErrorHidden = true;

  if (errorMessage !== '') {
    isErrorHidden = false;
    setTimeout(() => {
      setErrorMessage('');
      isErrorHidden = true;
    }, 3000);
  }

  const handleDeleteButton = () => {
    setErrorMessage('');
    isErrorHidden = true;
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isErrorHidden })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => handleDeleteButton}
      />
      {errorMessage}
    </div>
  );
};
