import { useContext, useEffect } from 'react';
import cn from 'classnames';
import { TodosContext } from '../TodosContext';
import { ErrorMessage } from '../../types/ErrorMessage';

export const ErrorNotification = () => {
  const {
    alarm,
    setAlarm,
  } = useContext(TodosContext);

  useEffect(() => {
    const timerIdRef = setTimeout(() => {
      setAlarm(ErrorMessage.Default);
    }, 3000);

    return () => clearTimeout(timerIdRef);
  }, [alarm]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-light',
        'is-danger',
        'has-text-weight-normal',
        { hidden: !alarm },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setAlarm(ErrorMessage.Default)}
      >
        {' '}
      </button>
      {alarm}
    </div>
  );
};
