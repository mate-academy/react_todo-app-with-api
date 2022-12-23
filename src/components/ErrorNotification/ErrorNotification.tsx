/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { FC, useEffect } from 'react';
import { TodoErrors } from '../../types/ErrorMessages';

interface Props {
  onErrorSkip: React.Dispatch<React.SetStateAction<TodoErrors>>,
  message: string,
}

export const ErrorNotification: FC<Props> = ({
  onErrorSkip,
  message,
}) => {
  useEffect(() => {
    setTimeout(() => {
      onErrorSkip(TodoErrors.none);
    }, 3000);
  }, [message]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !message },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorSkip(TodoErrors.none)}
      />
      <span>{message}</span>
    </div>

  );
};
