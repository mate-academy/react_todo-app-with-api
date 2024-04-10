import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { DispatchContext, StateContext } from '../../store/Store';

export const ErrorNotification = () => {
  const { status } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'SUCCESS') {
      setErrorMessage(status);
    }

    const timeout = setTimeout(() => {
      setErrorMessage(null);
      dispatch({ type: 'RESET_STATUS' });
    }, 3000);

    return () => clearTimeout(timeout);
  }, [dispatch, status]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
