import React from 'react';
import cn from 'classnames';

type Props = {
  isError: boolean,
  errorText: string,
  closeError: () => void,
};

export const Notification:React.FC<Props> = ({
  isError,
  errorText,
  closeError,
}) => (
  <div className={cn(
    'notification is-danger is-light has-text-weight-normal',
    { hidden: !isError },
  )}
  >
    <button
      type="button"
      className="delete"
      onClick={() => closeError()}
      aria-label="Close Error"
    />

    {errorText}
  </div>
);
