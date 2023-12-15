import cn from 'classnames';
import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { ContextKey } from '../../types/Context';

export const ErrorInfo = () => {
  const { state, changeState } = useContext(AppContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: state.errorMsg === null,
      })}
    >
      <button
        aria-label="Hide Notification"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => changeState(ContextKey.ErrorMsg, null)}
      />
      {state.errorMsg}
    </div>
  );
};
