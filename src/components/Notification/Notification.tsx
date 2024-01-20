import {
  memo, useCallback, useContext, useMemo,
} from 'react';
import cn from 'classnames';
import { DispatchContext, StateContext } from '../../store/store';
import { ActionType } from '../../types/ActionType';

export const Notification: React.FC = memo(() => {
  const { error } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const hideError = useCallback(
    () => dispatch({ type: ActionType.ClearError }),
    [dispatch],
  );

  const hiddenError = useMemo(
    () => error === null,
    [error],
  );

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: hiddenError },
      )}
    >
      <button
        className="delete"
        data-cy="HideErrorButton"
        type="button"
        aria-label="hide-error"
        onClick={hideError}
      />
      {error}
    </div>
  );
});
