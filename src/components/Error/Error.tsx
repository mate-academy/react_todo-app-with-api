import React from 'react';
import classNames from 'classnames';
import { ErrorsMessages } from '../../types/ErrorsMessages';

type Props = {
  errorMessage: ErrorsMessages,
  removeMessage: React.Dispatch<React.SetStateAction<ErrorsMessages>>,
};

export const Error: React.FC<Props> = (
  { errorMessage, removeMessage },
) => (
  <div className={classNames(
    'notification is-danger is-light has-text-weight-normal',
    { hidden: errorMessage === ErrorsMessages.Hidden },
  )}
  >
    <button
      aria-label="close error"
      type="button"
      className="delete"
      onClick={() => removeMessage(ErrorsMessages.Hidden)}
    />
    {errorMessage}
  </div>
);
