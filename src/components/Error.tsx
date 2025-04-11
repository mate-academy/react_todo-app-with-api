import classNames from 'classnames';
import { ErrorMessage } from '../types/Todo';
import React from 'react';

type Props = {
  errorMessage: ErrorMessage;
  setErrorMessage: (newErrorMessage: ErrorMessage) => void;
};

// eslint-disable-next-line react/display-name
export const Error: React.FC<Props> = React.memo(
  ({ errorMessage, setErrorMessage }: Props) => (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
      hidden={!errorMessage}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessage.DEFAULT)}
      />
      {errorMessage}
    </div>
  ),
);
