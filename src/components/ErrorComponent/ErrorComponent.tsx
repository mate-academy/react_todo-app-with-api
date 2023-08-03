/* eslint-disable jsx-a11y/control-has-associated-label */
import classnames from 'classnames';

import React, { useContext, useEffect, useState } from 'react';
import { TodosContext } from '../../context/TodosContext';

export const ErrorComponent: React.FC = () => {
  const { error, onCloseError } = useContext(TodosContext);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setLocalError('');
    }, 3000);

    setLocalError(error);

    return () => {
      clearTimeout(timeOut);
    };
  }, [error]);

  return (
    <div
      className={classnames({
        'notification is-danger is-light has-text-weight-normal': true,
        hidden: !localError,
      })}
    >
      <button type="button" className="delete" onClick={() => onCloseError()} />
      {error}
    </div>
  );
};
