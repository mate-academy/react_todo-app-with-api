import classNames from 'classnames';
import { useEffect } from 'react';
import { useTodosContext } from '../../hook/useTodosContext';

export const ErrorNotification = () => {
  const { error, dispatch } = useTodosContext();

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeError = setTimeout(() => {
      dispatch({ type: 'SET_ERROR', payload: '' });
    }, 3000);

    return () => {
      clearTimeout(timeError);
    };
  }, [error, dispatch]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {error}
    </div>
  );
};
