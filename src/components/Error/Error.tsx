import classNames from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';

import { Errors } from '../../types/Errors';
import { ErrorContext } from './ErrorContext';

type Props = {
  loadUsers: () => Promise<void>;
};

export const Error: React.FC<Props> = ({ loadUsers }) => {
  const {
    currentError,
    setCurrentError,
    hasError,
    setHasError,
    setIsAdding,
    setSelectedTodoIds,
  } = useContext(ErrorContext);

  const timerRef = useRef<NodeJS.Timer>();

  const resetCurrentError = useCallback(
    () => {
      setHasError(false);
      setIsAdding(false);
      setSelectedTodoIds([0]);
      setCurrentError(Errors.NoError);
      loadUsers();
    },
    [currentError],
  );

  useEffect(() => {
    if (hasError) {
      timerRef.current = setTimeout(resetCurrentError, 3000);
    } else {
      clearTimeout(timerRef.current);
    }
  }, [currentError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !hasError,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={resetCurrentError}
      />
      {currentError}
    </div>
  );
};
