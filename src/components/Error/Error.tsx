import cn from 'classnames';
import { FC } from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  errorMessage: string;
  setErrorMessage: (value: string) => void;
}

export const Error: FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
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
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
