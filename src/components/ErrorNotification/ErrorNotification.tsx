/* eslint-disable jsx-a11y/control-has-associated-label */
import { useContext, useEffect, useRef } from 'react';
import cn from 'classnames';
import { TodosContext } from '../TodosContext';
import { ErrorMessage } from '../../types/ErrorMessage';

export const ErrorNotification = () => {
  const {
    alarm,
    setAlarm,
  } = useContext(TodosContext);

  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setAlarm(ErrorMessage.Default);
    }, 3000);
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
      />
      {alarm}
    </div>
  );
};
