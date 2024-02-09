/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { useContext, useEffect } from 'react';
import { GlobalContext } from '../TodoContext';

export const TodoErrorNotification: React.FC = () => {
  const { setError, error } = useContext(GlobalContext);

  useEffect(() => {
    const hideErrorTimeout = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(hideErrorTimeout);
    };
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
      {error}
    </div>
  );
};
