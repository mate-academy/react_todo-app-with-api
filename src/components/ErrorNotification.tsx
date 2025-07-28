import { useContext, useEffect } from 'react';
import { DispatchContext, StateContext } from './StateContext';
import classNames from 'classnames';

export const ErrorNotification = () => {
  const { errorMessage } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          dispatch({
            type: 'SHOW_ERROR',
            message: '',
          });
        }}
      />

      {errorMessage}
    </div>
  );
};
