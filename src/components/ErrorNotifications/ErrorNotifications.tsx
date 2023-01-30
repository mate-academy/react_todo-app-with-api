/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, memo } from 'react';
import cn from 'classnames';
import uniqid from 'uniqid';

type Props = {
  errorMessages: string[],
  onCloseBtnClick: ((errorMessage: string) => void),
};

export const ErrorNotifications: FC<Props> = memo(({
  errorMessages,
  onCloseBtnClick,
}) => {
  return (
    <>
      {errorMessages.map(message => (
        <div
          key={uniqid()}
          data-cy="ErrorNotification"
          className={cn(
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
            onClick={() => onCloseBtnClick(message)}
          />
          {message}
        </div>
      ))}
    </>
  );
});
