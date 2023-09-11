/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

import React from 'react';
import { useTodo } from '../TodoContext/TodoContext';

export const TodoNotification: React.FC = () => {
  const {
    isError,
    resetError,
  } = useTodo();

  const handleButtonClick = () => {
    resetError();
  };

  return (

    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !isError.isError },
    )}
    >
      <button
        type="button"
        className="delete"
        title="Click here"
        onClick={handleButtonClick}
      />

      {isError.message}
    </div>
  );
};
